use five_in_a_row_io::{
    Config, GameAction, GameInit, GameInstance, GameReply, GameResult, Mark, StateQuery, StateReply,
};
use gstd::{collections::HashMap, debug, exec, msg, prelude::*, ActorId};
static mut GAME: Option<Game> = None;

#[derive(Debug, Default)]
struct Game {
    pub admins: Vec<ActorId>,
    pub current_games: HashMap<ActorId, GameInstance>,
    pub config: Config,
    pub messages_allowed: bool,
}

pub const BOARD_SIZE: usize = 9;

#[no_mangle]
extern "C" fn init() {
    let init_msg: GameInit = msg::load().expect("Unable to load the message");

    unsafe {
        GAME = Some(Game {
            admins: vec![msg::source()],
            current_games: HashMap::with_capacity(10_000),
            config: init_msg.config,
            messages_allowed: true,
        });
    }
}

impl Game {
    fn start_game(&mut self) {
        let msg_source = msg::source();

        if let Some(current_game) = self.current_games.get(&msg_source) {
            if !current_game.game_over {
                panic!("Please complete the previous game");
            }
        }

        let turn = turn();

        let (player_mark, bot_mark) = if turn == 0 {
            (Mark::O, Mark::X)
        } else {
            (Mark::X, Mark::O)
        };
        let mut game_instance = GameInstance {
            board: vec![None; BOARD_SIZE * BOARD_SIZE], // 9x9 board
            player_mark,
            bot_mark,
            last_time: exec::block_timestamp(),
            game_result: None,
            game_over: false,
        };

        // If bot first, it mark on the center of the board
        if bot_mark == Mark::X {
            game_instance.board[BOARD_SIZE * BOARD_SIZE / 2] = Some(Mark::X);
        }

        self.current_games.insert(msg_source, game_instance.clone());

        msg::reply(
            GameReply::GameStarted {
                game: game_instance,
            },
            0,
        )
        .expect("Error in sending a reply");
    }

    fn player_move(&mut self, step: u8) {
        let msg_source = msg::source();
        let game_instance = self
            .current_games
            .get_mut(&msg_source)
            .expect("The player has no game, please start the game");
        if game_instance.board[step as usize].is_some() {
            panic!("The cell is already occupied!");
        }
        if game_instance.game_over {
            panic!("Game is already over");
        }

        if game_instance.last_time + self.config.turn_deadline_ms < exec::block_timestamp() {
            panic!("You missed your turn, please skip the move");
        }
        game_instance.board[step as usize] = Some(game_instance.player_mark);

        game_instance.last_time = exec::block_timestamp();

        if let Some(mark) = get_result(step as usize, &game_instance.board.clone()) {
            game_instance.game_over = true;
            if mark == game_instance.player_mark {
                game_instance.game_result = Some(GameResult::Player);
                send_messages(&msg_source, &self.config);
            } else {
                game_instance.game_result = Some(GameResult::Bot);
                send_messages(&msg_source, &self.config);
            }
            msg::reply(
                GameReply::MoveMade {
                    game: game_instance.clone(),
                },
                0,
            )
            .expect("Error in sending a reply");
            return;
        }

        let bot_step = make_move(game_instance);

        if let Some(step_num) = bot_step {
            game_instance.board[step_num] = Some(game_instance.bot_mark);
        }

        let win = get_result(bot_step.map_or(41, |x| x), &game_instance.board.clone());

        if let Some(mark) = win {
            game_instance.game_over = true;
            if mark == game_instance.player_mark {
                game_instance.game_result = Some(GameResult::Player);
                send_messages(&msg_source, &self.config);
            } else {
                game_instance.game_result = Some(GameResult::Bot);
                send_messages(&msg_source, &self.config);
            }
        } else if !game_instance.board.contains(&None) || bot_step.is_none() {
            game_instance.game_over = true;
            game_instance.game_result = Some(GameResult::Draw);
            send_messages(&msg_source, &self.config);
        }

        msg::reply(
            GameReply::MoveMade {
                game: game_instance.clone(),
            },
            0,
        )
        .expect("Error in sending a reply");
    }

    fn skip(&mut self) {
        let msg_source = msg::source();
        let game_instance = self
            .current_games
            .get_mut(&msg_source)
            .expect("The player has no game, please start the game");

        if game_instance.game_over {
            panic!("Game is already over");
        }

        if game_instance.last_time + self.config.turn_deadline_ms >= exec::block_timestamp() {
            panic!("You did not missed your turn, please make move");
        }

        let bot_step = make_move(game_instance);
        game_instance.last_time = exec::block_timestamp();

        match bot_step {
            Some(step_num) => {
                game_instance.board[step_num] = Some(game_instance.bot_mark);
                let win = get_result(step_num, &game_instance.board.clone());
                if let Some(mark) = win {
                    game_instance.game_over = true;
                    if mark == game_instance.player_mark {
                        game_instance.game_result = Some(GameResult::Player);
                        send_messages(&msg_source, &self.config);
                    } else {
                        game_instance.game_result = Some(GameResult::Bot);
                        send_messages(&msg_source, &self.config);
                    }
                } else if !game_instance.board.contains(&None) {
                    game_instance.game_over = true;
                    game_instance.game_result = Some(GameResult::Draw);
                    send_messages(&msg_source, &self.config);
                }
            }
            None => {
                game_instance.game_over = true;
                game_instance.game_result = Some(GameResult::Draw);
                send_messages(&msg_source, &self.config);
            }
        }

        msg::reply(
            GameReply::MoveMade {
                game: game_instance.clone(),
            },
            0,
        )
        .expect("Error in sending a reply");
    }

    fn remove_game_instance(&mut self, account: &ActorId) {
        assert_eq!(
            msg::source(),
            exec::program_id(),
            "This message can be sent only by the program"
        );
        let game_instance = self
            .current_games
            .get(account)
            .expect("Unexpected: the game does not exist");

        if game_instance.game_over {
            self.current_games.remove(account);
        }
    }

    fn remove_instances(&mut self, accounts: Option<Vec<ActorId>>) {
        assert!(
            self.admins.contains(&msg::source()),
            "Only admin can send this message"
        );
        match accounts {
            Some(accounts) => {
                for account in accounts {
                    self.current_games.remove(&account);
                }
            }
            None => {
                self.current_games.retain(|_, game_instance| {
                    exec::block_timestamp() - game_instance.last_time
                        < self.config.time_interval as u64 * self.config.s_per_block
                });
            }
        }
    }
}

#[gstd::async_main]
async fn main() {
    let game = unsafe { GAME.as_mut().expect("`Game` is not initialized.") };
    let action: GameAction = msg::load().expect("Failed to decode `GameAction` message.");
    if let GameAction::AllowMessages(messages_allowed) = action {
        assert!(
            game.admins.contains(&msg::source()),
            "Only an admin can send this message"
        );
        game.messages_allowed = messages_allowed;
        return;
    }

    assert!(
        game.messages_allowed,
        "Message processing has been suspended for some time"
    );
    match action {
        GameAction::StartGame => game.start_game(),
        GameAction::Turn { step } => game.player_move(step),
        GameAction::Skip => game.skip(),
        GameAction::RemoveGameInstance { account_id } => game.remove_game_instance(&account_id),
        GameAction::RemoveGameInstances { accounts } => game.remove_instances(accounts),
        GameAction::AddAdmin(admin) => {
            assert!(game.admins.contains(&msg::source()), "You are not admin");
            game.admins.push(admin);
        }
        GameAction::RemoveAdmin(admin) => {
            assert!(game.admins.contains(&msg::source()), "You are not admin");

            game.admins.retain(|id| *id != admin);
        }
        GameAction::UpdateConfig {
            s_per_block,
            gas_to_remove_game,
            time_interval,
            turn_deadline_ms,
        } => {
            assert!(game.admins.contains(&msg::source()), "You are not admin");

            if let Some(s_per_block) = s_per_block {
                game.config.s_per_block = s_per_block;
            }
            if let Some(gas_to_remove_game) = gas_to_remove_game {
                game.config.gas_to_remove_game = gas_to_remove_game;
            }
            if let Some(time_interval) = time_interval {
                game.config.time_interval = time_interval;
            }
            if let Some(turn_deadline_ms) = turn_deadline_ms {
                game.config.turn_deadline_ms = turn_deadline_ms;
            }
        }
        _ => {}
    }
}

fn turn() -> u8 {
    let random_input: [u8; 32] = msg::source().into();
    let (random, _) = exec::random(random_input).expect("Error in getting random number");
    random[0] % 2
}

fn make_move(game: &mut GameInstance) -> Option<usize> {
    for step_size in 0..BOARD_SIZE * BOARD_SIZE {
        if game.board[step_size as usize] == None {
            return Some(step_size as usize);
        }
    }
    None
}

// fn check_line(map: &[Option<Mark>], sum_o: u8, sum_x: u8) -> Option<usize> {
//     for line in VICTORIES.iter() {
//         let mut o = 0;
//         let mut x = 0;
//         for i in 0..3 {
//             if map[line[i]] == Some(Mark::O) {
//                 o += 1;
//             }
//             if map[line[i]] == Some(Mark::X) {
//                 x += 1;
//             }
//         }

//         if sum_o == o && sum_x == x {
//             for i in 0..3 {
//                 if map[line[i]] != Some(Mark::O) && map[line[i]] != Some(Mark::X) {
//                     return Some(line[i]);
//                 }
//             }
//         }
//     }
//     None
// }

fn get_result(last_step: usize, map: &[Option<Mark>]) -> Option<Mark> {
    let row = last_step as i8 / BOARD_SIZE as i8;
    let col = last_step as i8 % BOARD_SIZE as i8;

    // Directions: vertical, horizontal, diagonal (down-right), diagonal (down-left)
    let directions = [(1, 0), (0, 1), (1, 1), (-1, 1)];

    for (dx, dy) in directions.iter() {
        let mut count = 1;

        // Check in both directions
        for &dir in [-1, 1].iter() {
            let (mut x, mut y) = (row as i8 + dir * dx, col as i8 + dir * dy);

            while x >= 0 && x < BOARD_SIZE as i8 && y >= 0 && y < BOARD_SIZE as i8 {
                match map[x as usize * BOARD_SIZE + y as usize] {
                    Some(mark) if Some(mark) == map[last_step] => count += 1,
                    _ => break,
                }

                x += dir * dx;
                y += dir * dy;
            }
        }

        if count >= 5 {
            return map[last_step];
        }
    }

    None
}

#[no_mangle]
extern "C" fn state() {
    let Game {
        admins,
        current_games,
        config,
        messages_allowed,
    } = unsafe { GAME.take().expect("Failed to get state") };
    let query: StateQuery = msg::load().expect("Unable to load the state query");

    match query {
        StateQuery::Admins => {
            msg::reply(StateReply::Admins(admins), 0).expect("Unable to share the state");
        }
        StateQuery::Game { player_id } => {
            let game: Option<GameInstance> = current_games.get(&player_id).cloned();
            msg::reply(StateReply::Game(game), 0).expect("Unable to share the state");
        }
        StateQuery::AllGames => {
            msg::reply(StateReply::AllGames(current_games.into_iter().collect()), 0)
                .expect("Unable to share the state");
        }
        StateQuery::Config => {
            msg::reply(StateReply::Config(config), 0).expect("Unable to share the state");
        }
        StateQuery::MessagesAllowed => {
            msg::reply(StateReply::MessagesAllowed(messages_allowed), 0)
                .expect("Unable to share the state");
        }
    }
}

fn send_messages(account: &ActorId, config: &Config) {
    msg::send_with_gas_delayed(
        exec::program_id(),
        GameAction::RemoveGameInstance {
            account_id: *account,
        },
        config.gas_to_remove_game,
        0,
        config.time_interval,
    )
    .expect("Error in sending message");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_exact_five_consecutive_marks_horizontal() {
        let mut map = vec![None; 81];
        for i in 3..8 {
            map[i] = Some(Mark::X);
        }
        assert_eq!(get_result(7, &map), Some(Mark::X));
    }

    #[test]
    fn test_exact_five_consecutive_marks_diagonal() {
        let mut map = vec![None; 81];
        for i in 0..5 {
            map[i * 10] = Some(Mark::X); // Set 5 diagonal
        }
        assert_eq!(get_result(40, &map), Some(Mark::X));
    }

    #[test]
    fn test_exact_five_consecutive_marks_vertical() {
        let mut map = vec![None; 81];
        for i in 0..5 {
            map[i * 9] = Some(Mark::O)
        }
        assert_eq!(get_result(2 * 9, &map), Some(Mark::O));
    }

    #[test]
    fn test_no_five_consecutive_marks() {
        let mut map = vec![None; 81];
        map[0] = Some(Mark::O);
        map[1] = Some(Mark::X);
        map[2] = Some(Mark::X);
        map[3] = Some(Mark::X);
        map[4] = Some(Mark::X);
        assert_eq!(get_result(2, &map), None);
    }
}

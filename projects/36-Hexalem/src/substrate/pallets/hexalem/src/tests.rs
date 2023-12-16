use crate::{
	mock::{self, *},
	pallet, Error, Event, GameProperties, GameState, GameStorage, GetTileInfo, HexBoardStorage,
	HexGrid, Move, ResourceType, HexBoard,
};
use frame_support::{assert_noop, assert_ok};

#[test]
fn create_new_game_successfully() {
	new_test_ext().execute_with(|| {
		// Go past genesis block so events get deposited
		System::set_block_number(1);
		// Dispatch a signed extrinsic.

		let players = vec![1, 2, 3];

		assert_ok!(HexalemModule::create_game(RuntimeOrigin::signed(1), players.clone(), 25));
		// Read pallet storage and assert an expected result.
		let hex_board_option: Option<crate::HexBoard<TestRuntime>> =
			HexBoardStorage::<TestRuntime>::get(1);

		let hex_board = hex_board_option.unwrap();

		assert_eq!(
			hex_board.resources,
			<mock::TestRuntime as pallet::Config>::DefaultPlayerResources::get()
		);

		let default_hex_grid: HexGrid<TestRuntime> = vec![
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile::get_home(),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
		]
		.try_into()
		.unwrap();
		assert_eq!(hex_board.hex_grid, default_hex_grid);

		let game_id = hex_board.game_id;

		// Assert that the correct event was deposited
		System::assert_last_event(
			Event::GameCreated { game_id, grid_size: 25, players: players.clone() }.into(),
		);

		let game_option = GameStorage::<TestRuntime>::get(game_id);

		let game = game_option.unwrap();

		assert_eq!(game.players, players.clone());

		assert_eq!(game.get_player_turn(), 0);

		assert_eq!(game.get_played(), false);

		assert_eq!(game.get_round(), 0);

		assert_eq!(game.get_selection_size(), 2);

		assert_eq!(game.get_state(), GameState::Playing);

		let current_selection_indexes = game.selection.clone();

		let selection_one_cost = <mock::TestRuntime as pallet::Config>::TileCosts::get()
			[current_selection_indexes[0] as usize];

		let move_played = Move { place_index: 11, buy_index: 0 };

		assert_eq!(selection_one_cost.cost.resource_type, ResourceType::Mana);
		assert_eq!(selection_one_cost.cost.amount, 1);

		assert_ok!(HexalemModule::play(RuntimeOrigin::signed(1), move_played.clone()));

		System::assert_last_event(Event::MovePlayed { game_id, player: 1, move_played }.into());

		let hex_board_option: Option<crate::HexBoard<TestRuntime>> =
			HexBoardStorage::<TestRuntime>::get(1);

		let hex_board = hex_board_option.unwrap();
		assert_eq!(hex_board.resources, [0, 1, 0, 0, 0, 0, 0]);

		let expected_hex_grid: HexGrid<TestRuntime> = vec![
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			selection_one_cost.tile_to_buy,
			HexalemTile::get_home(),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
		]
		.try_into()
		.unwrap();
		assert_eq!(hex_board.hex_grid, expected_hex_grid);

		let game_option = GameStorage::<TestRuntime>::get(game_id);

		let game = game_option.unwrap();

		assert_eq!(game.players, players.clone());

		assert_eq!(game.get_player_turn(), 0);

		assert_eq!(game.get_played(), true);

		assert_eq!(game.get_round(), 0);

		assert_eq!(game.get_selection_size(), 4);

		assert_eq!(game.get_state(), GameState::Playing);

		assert_ok!(HexalemModule::finish_turn(RuntimeOrigin::signed(1)));

		System::assert_last_event(Event::NewTurn { game_id, next_player: 2 }.into());

		let hex_board_option: Option<crate::HexBoard<TestRuntime>> =
			HexBoardStorage::<TestRuntime>::get(1);

		let hex_board = hex_board_option.unwrap();
		assert_eq!(hex_board.resources, [1, 1, 2, 0, 0, 0, 0]);

		assert_eq!(hex_board.hex_grid, expected_hex_grid);

		let game_option = GameStorage::<TestRuntime>::get(game_id);

		let game = game_option.unwrap();

		assert_eq!(game.players, players.clone());

		assert_eq!(game.get_player_turn(), 1);

		assert_eq!(game.get_played(), false);

		assert_eq!(game.get_round(), 0);

		assert_eq!(game.get_selection_size(), 4);

		assert_eq!(game.get_state(), GameState::Playing);
	});
}

#[test]
fn create_new_game_fails_number_of_players_is_too_small() {
	new_test_ext().execute_with(|| {
		// Ensure the expected error is thrown when no value is present.
		assert_noop!(
			HexalemModule::create_game(RuntimeOrigin::signed(1), vec![], 25),
			Error::<TestRuntime>::NumberOfPlayersIsTooSmall
		);
	});
}

#[test]
fn create_new_game_fails_bad_grid_size() {
	new_test_ext().execute_with(|| {
		// Ensure the expected error is thrown when no value is present.
		assert_noop!(
			HexalemModule::create_game(RuntimeOrigin::signed(1), vec![1], 1),
			Error::<TestRuntime>::BadGridSize
		);
	});

	new_test_ext().execute_with(|| {
		// Ensure the expected error is thrown when no value is present.
		assert_noop!(
			HexalemModule::create_game(RuntimeOrigin::signed(1), vec![1], 2),
			Error::<TestRuntime>::BadGridSize
		);
	});
}

#[test]
fn test_resource_generation() {
	new_test_ext().execute_with(|| {
		assert_ok!(HexalemModule::create_game(RuntimeOrigin::signed(1), vec![1], 25));

		let new_hex_grid: HexGrid<TestRuntime> = vec![
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(56),
			HexalemTile(48),
			HexalemTile(40),
			HexalemTile(32),
			HexalemTile(24),
			HexalemTile(16),
			HexalemTile(8),
			HexalemTile::get_home(),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
		].try_into()
		.unwrap();

		let hex_board_option: Option<HexBoard<TestRuntime>> =
			HexBoardStorage::<TestRuntime>::get(1);

		let hex_board = hex_board_option.unwrap();

		let game_id = hex_board.game_id;

		HexalemModule::set_hex_board(1, HexBoard {
			game_id,
			hex_grid: new_hex_grid,
			resources: [0, 1, 0, 0, 0, 0, 0],
		});

		assert_ok!(HexalemModule::finish_turn(RuntimeOrigin::signed(1)));
		
		let hex_board_option: Option<HexBoard<TestRuntime>> =
			HexBoardStorage::<TestRuntime>::get(1);

		let hex_board = hex_board_option.unwrap();

		assert_eq!(hex_board.resources, [2, 2, 2, 3, 1, 1, 1]);
	});
}

#[test]
fn test_saturate_99() {
	new_test_ext().execute_with(|| {
		assert_ok!(HexalemModule::create_game(RuntimeOrigin::signed(1), vec![1], 25));

		let new_hex_grid: HexGrid<TestRuntime> = vec![
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(56),
			HexalemTile(48),
			HexalemTile(40),
			HexalemTile(32),
			HexalemTile(24),
			HexalemTile(16),
			HexalemTile(8),
			HexalemTile::get_home(),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
			HexalemTile(0),
		].try_into()
		.unwrap();

		let hex_board_option: Option<HexBoard<TestRuntime>> =
			HexBoardStorage::<TestRuntime>::get(1);

		let hex_board = hex_board_option.unwrap();

		let game_id = hex_board.game_id;

		HexalemModule::set_hex_board(1, HexBoard {
			game_id,
			hex_grid: new_hex_grid,
			resources: [99, 99, 99, 99, 99, 99, 99],
		});

		assert_ok!(HexalemModule::finish_turn(RuntimeOrigin::signed(1)));
		
		let hex_board_option: Option<HexBoard<TestRuntime>> =
			HexBoardStorage::<TestRuntime>::get(1);

		let hex_board = hex_board_option.unwrap();

		assert_eq!(hex_board.resources, [99, 6, 99, 99, 99, 99, 99]);
	});
}

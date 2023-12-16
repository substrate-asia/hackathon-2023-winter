use crate::{mock::{*, self}, Error, Event, HexBoardStorage, GameStorage, pallet, HexGrid, GameProperties, GameState};
use frame_support::{assert_noop, assert_ok};
use crate::GetTileInfo;

#[test]
fn create_new_game_successfully() {
	new_test_ext().execute_with(|| {
		// Go past genesis block so events get deposited
		System::set_block_number(1);
		// Dispatch a signed extrinsic.

		let players = vec![1];

		assert_ok!(HexalemModule::create_game(RuntimeOrigin::signed(1), players.clone(), 25));
		// Read pallet storage and assert an expected result.
		let hex_board_option: Option<crate::HexBoard<TestRuntime>> = HexBoardStorage::<TestRuntime>::get(1);

		assert_eq!(hex_board_option.is_some(), true);

		let hex_board = hex_board_option.unwrap();

		assert_eq!(hex_board.resources, <mock::TestRuntime as pallet::Config>::DefaultPlayerResources::get());

		let default: HexGrid<TestRuntime> = vec![HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile::get_home(), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0), HexalemTile(0)].try_into().unwrap();
		assert_eq!(hex_board.hex_grid, default);

		let game_id = hex_board.game_id;

		// Assert that the correct event was deposited
		System::assert_last_event(Event::GameCreated { game_id, grid_size: 25, players: vec![1] }.into());

		let game_option = GameStorage::<TestRuntime>::get(game_id);

		let game = game_option.unwrap();

		assert_eq!(game.players, players);

		assert_eq!(game.get_player_turn(), 0);

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


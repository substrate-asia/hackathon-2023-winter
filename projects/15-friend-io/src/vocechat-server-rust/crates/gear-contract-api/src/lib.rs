use gclient::{EventProcessor, GearApi, Result};

const WASM_PATH: &str = "./target/wasm32-unknown-unknown/release/first_gear_app.opt.wasm";

#[tokio::test]
async fn test_example() -> Result<()> {
    let share_program_id = "0x3bc507b6d448d7f279e6f0edb80bd86e569d0543a84a6c5cde8c93ed01453161";
    // Create API instance
    let api = GearApi::dev().await?;

    // Subscribe to events
    let mut listener = api.subscribe().await?;

    // Check that blocks are still running
    assert!(listener.blocks_running().await?);

    // Calculate gas amount needed for initialization
    let gas_info = api
        .calculate_upload_gas(None, gclient::code_from_os(WASM_PATH)?, vec![], 0, true)
        .await?;

    // Upload and init the program
    let (message_id, program_id, _hash) = api
        .upload_program_bytes_by_path(
            WASM_PATH,
            gclient::now_micros().to_le_bytes(),
            vec![],
            gas_info.min_limit,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let payload = b"PING".to_vec();

    // Calculate gas amount needed for handling the message
    let gas_info = api
        .calculate_handle_gas(None, program_id, payload.clone(), 0, true)
        .await?;

    // Send the PING message
    let (message_id, _hash) = api
        .send_message_bytes(program_id, payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    Ok(())
}
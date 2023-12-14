use kee_bee_io::KeeBeeMetadata; 

fn main() {
    gear_wasm_builder::build_with_metadata::<KeeBeeMetadata>();
    // gear_wasm_builder::build();
    // gear_wasm_builder::build_metawasm();
}
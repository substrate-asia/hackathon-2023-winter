pub trait TypeInfo {
    fn check_type(&self) -> bool;
}

// TODO: Using macro!
impl TypeInfo for String {
    fn check_type(&self) -> bool {
        match self.as_str() {
            "u8" | "u16" | "u32" | "u64" | "u128" => true,
            "i8" | "i16" | "i32" | "i64" | "i128" => true,
            "Vec<u8>" => true,
            "usize" => true,
            //TODO: Option
            _ => false,
        }
    }
}

use gstd::msg;

use crate::KeeBeeShare;


impl KeeBeeShare{
    pub fn assert_admin(&self) {
        assert!(self.manager.get(&msg::source()).unwrap(),  "msg::source() must be manager");
    }
}

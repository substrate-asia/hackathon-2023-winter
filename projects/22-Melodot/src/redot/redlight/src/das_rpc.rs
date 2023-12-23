// Copyright 2023 ZeroDAO
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use serde_json::{json, Value};
use anyhow::{Result, anyhow};

pub struct DasClient {
    rpc_url: String,
}

impl DasClient {
    pub fn new(rpc_url: String) -> Self {
        DasClient { rpc_url }
    }

    pub fn get_latest_block(&self) -> Result<Option<(u32, Vec<u8>)>> {
        let resp = ureq::post(&self.rpc_url)
            .send_json(json!({
                "method": "das_last",
                "params": [],
                "id": 1,
                "jsonrpc": "2.0"
            }))?;

        let value: Value = resp.into_json()?;
        if let Some(result) = value["result"].as_array() {
            let number = result.get(0)
                .and_then(|v| v.as_u64())
                .map(|n| n as u32)
                .ok_or_else(|| anyhow!("Invalid number format"))?;

            let hash_str = result.get(1)
                .and_then(|v| v.as_str())
                .ok_or_else(|| anyhow!("Invalid hash format"))?;

            let hash = hex::decode(&hash_str.trim_start_matches("0x"))?;

            Ok(Some((number, hash)))
        } else {
            Ok(None)
        }
    }

    pub fn check_data_availability(&self, block_hash: &str) -> Result<Option<bool>> {
        let resp = ureq::post(&self.rpc_url)
            .send_json(json!({
                "method": "das_isAvailable",
                "params": [block_hash],
                "id": 1,
                "jsonrpc": "2.0"
            }))?;
    
        let value: Value = resp.into_json()?;
        match value.get("result") {
            Some(Value::Bool(is_available)) => Ok(Some(*is_available)),
            None => Ok(None),
            _ => Err(anyhow!("Unexpected response format")),
        }
    }
}

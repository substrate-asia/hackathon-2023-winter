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

use codec::{Decode, Encode};
use cumulus_primitives_core::{
	relay_chain::{Hash as RelayHash, ValidatorId},
	BlockT,
};
use cumulus_relay_chain_interface::RelayChainInterface;
use melo_das_db::traits::DasKv;
use redot_core_primitives::GetValidatorsFromRuntime;
use std::sync::Arc;

const STORE_KEY: &[u8] = b"redot_relay_validators";

/// A structure representing information about validators.
/// This structure is used to store and retrieve validator information,
/// and update it based on information from the relay chain or runtime.
pub struct ValidatorsInfo {
    set: Vec<ValidatorId>,
}

impl ValidatorsInfo {
    /// Creates a new `ValidatorsInfo` instance with a given set of validators.
    ///
    /// # Arguments
    /// * `set` - A slice of `ValidatorId` which are the initial set of validators.
    pub fn new(set: &[ValidatorId]) -> Self {
        Self { set: set.to_vec() }
    }

    /// Retrieves the set of validators from the database.
    ///
    /// # Arguments
    /// * `db` - A mutable reference to an object implementing the `DasKv` trait,
    ///          typically representing a database.
    ///
    /// # Returns
    /// An `Option` containing a vector of `ValidatorId`. Returns `None` if no data is found
    /// or if an error occurs during decoding.
    pub fn get<DB>(&self, db: &mut DB) -> Option<Vec<ValidatorId>>
    where
        DB: DasKv,
        ValidatorId: Decode,
    {
        db.get(STORE_KEY).and_then(|data| Decode::decode(&mut &data[..]).ok())
    }

    /// Saves the current set of validators into the database.
    ///
    /// # Arguments
    /// * `db` - A mutable reference to an object implementing the `DasKv` trait,
    ///          typically representing a database.
    pub fn save<DB>(&self, db: &mut DB)
    where
        DB: DasKv,
    {
        db.set(STORE_KEY, self.set.encode().as_slice())
    }

    /// Updates the set of validators based on information from the relay chain.
    ///
    /// # Arguments
    /// * `hash` - A `RelayHash` representing the block hash on the relay chain.
    /// * `client` - A shared reference to an object implementing `RelayChainInterface`.
    ///
    /// # Returns
    /// An `Option` containing a `ValidatorId` of a new validator not present in the current set.
    /// Returns `None` if no new validator is found or if an error occurs.
    pub async fn update_from_relay<RCC>(
        &mut self,
        hash: RelayHash,
        client: &Arc<RCC>,
    ) -> Option<ValidatorId>
    where
        RCC: RelayChainInterface,
        ValidatorId: PartialEq,
    {
        let validators = client.validators(hash).await.ok()?;
        for new_validator in &validators {
            if !self.set.contains(new_validator) {
                return Some(new_validator.clone());
            }
        }
        None
    }

    /// Updates the set of validators based on information from the runtime.
    ///
    /// # Arguments
    /// * `db` - A mutable reference to an object implementing the `DasKv` trait.
    /// * `block_hash` - The hash of a specific block.
    /// * `runtime` - A shared reference to an object implementing `GetValidatorsFromRuntime`.
    ///
    /// # Returns
    /// An `Option` containing a vector of `ValidatorId` representing validators that have been removed.
    /// Returns `None` if no validators are removed or if an error occurs.
    pub fn update_from_runtime<Runtime, DB, Block>(
        &mut self,
        db: &mut DB,
        block_hash: Block::Hash,
        runtime: &Arc<Runtime>,
    ) -> Option<Vec<ValidatorId>>
    where
        Runtime: GetValidatorsFromRuntime<Block, ValidatorId>,
        DB: DasKv,
        ValidatorId: PartialEq + Clone + Encode + Decode,
        Block: BlockT,
    {
        let new_validators = runtime.validators(block_hash).ok()?;
        let removed_validators = self
            .set
            .iter()
            .filter(|old_validator| !new_validators.contains(old_validator))
            .cloned()
            .collect::<Vec<_>>();

        self.set = new_validators;
        self.save(db);

        if removed_validators.is_empty() {
            None
        } else {
            Some(removed_validators)
        }
    }
}

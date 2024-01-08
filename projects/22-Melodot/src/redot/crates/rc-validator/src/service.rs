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

use crate::{Command, DkgSignature, DkgVerifyingKey};
use anyhow::{Context, Result};
use cumulus_primitives_core::relay_chain::ValidatorId;
use futures::{
	channel::{mpsc, oneshot},
	SinkExt,
};
use std::fmt::Debug;

/// `Service` serves as an intermediary to interact with the Worker, handling requests and
/// facilitating communication. It mainly operates on the message passing mechanism between service
/// and worker.
#[derive(Clone)]
pub struct Service {
	// Channel sender to send messages to the worker.
	to_worker: mpsc::Sender<Command>,
}

impl Debug for Service {
	/// Provides a human-readable representation of the Service, useful for debugging.
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		f.debug_tuple("ValidatorNetworkService").finish()
	}
}

impl Service {
	pub(crate) fn new(to_worker: mpsc::Sender<Command>) -> Self {
		Self { to_worker }
	}
	// 轮换密钥
	pub async fn rotate_key(&self) -> Result<DkgVerifyingKey> {
		let (sender, receiver) = oneshot::channel();
		self.to_worker
			.clone()
			.send(Command::RotateKey { sender })
			.await
			.context("Failed to send command to worker")?;
		receiver.await.context("Failed to receive response from worker")?
	}

	// 启动签名服务
	pub async fn start_signing(&self, message: &[u8]) -> Result<DkgSignature> {
		let (sender, receiver) = oneshot::channel();
		self.to_worker
			.clone()
			.send(Command::Sign { message: message.to_vec(), sender })
			.await
			.context("Failed to send command to worker")?;
		receiver.await.context("Failed to receive response from worker")?
	}

	// 设置参数
	pub async fn setup(&self, nt: (u16, u16)) -> Result<()> {
		let (sender, receiver) = oneshot::channel();
		self.to_worker
			.clone()
			.send(Command::Setup { nt, sender })
			.await
			.context("Failed to send command to worker")?;
		receiver.await.context("Failed to receive response from worker")?
	}

	// 删除验证者
	pub async fn remove_validators(&self, validators: Vec<ValidatorId>) -> Result<()> {
		let (sender, receiver) = oneshot::channel();
		self.to_worker
			.clone()
			.send(Command::RemoveValidators { validators, sender })
			.await
			.context("Failed to send command to worker")?;
		receiver.await.context("Failed to receive response from worker")?
	}

	// 添加验证者
	pub async fn add_validators(&self, validators: Vec<ValidatorId>) -> Result<()> {
		let (sender, receiver) = oneshot::channel();
		self.to_worker
			.clone()
			.send(Command::AddValidators { validators, sender })
			.await
			.context("Failed to send command to worker")?;
		receiver.await.context("Failed to receive response from worker")?
	}
}

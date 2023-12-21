## 密码学相关说明

### 前端调用ZK相关函数
* 初始化 setup函数
```rust
fn setup<R: Rng>(
        rng: &mut R,
        m: usize,
        n: usize,
    ) -> Result<Self::Parameters, CardProtocolError> 
```
* 对Card（ElGamal明文）和 ClassicPlayingCard(原来的牌) 做一个映射
```rust
fn encode_cards<R: Rng>(rng: &mut R, num_of_cards: usize) -> HashMap<Card, ClassicPlayingCard>
```
* 前端 mask 一张牌
```rust
fn mask<R: Rng>(
        rng: &mut R,
        pp: &Self::Parameters,
        shared_key: &Self::AggregatePublicKey,
        original_card: &Self::Card,
        r: &Self::Scalar,
    ) -> Result<(Self::MaskedCard, Self::ZKProofMasking), CardProtocolError>
```
* 前端 洗牌
```rust
fn shuffle_and_remask<R: Rng>(
        rng: &mut R,
        pp: &Self::Parameters,
        shared_key: &Self::AggregatePublicKey,
        deck: &Vec<Self::MaskedCard>,
        masking_factors: &Vec<Self::Scalar>,
        permutation: &Permutation,
    ) -> Result<(Vec<Self::MaskedCard>, Self::ZKProofShuffle), CardProtocolError>
```
* 和玩家操作相关的函数
  * 生成玩家： `pub fn new<R: Rng>(rng: &mut R, pp: &CardParameters, name: &Vec<u8>) -> anyhow::Result<Self>`
  * 收到一张牌： `pub fn receive_card(&mut self, card: MaskedCard)`
  - [ ] 打出某张牌: `pub fn play_card(&mut self, card: MaskedCard)`(待修改)
  * 计算token，计算结果放在合约上存储
    ```rust
    pub fn compute_reveal_token<R: Rng>(
            &self,
            rng: &mut R,
            pp: &CardParameters,
            card: &MaskedCard,
        ) -> anyhow::Result<(RevealToken, RevealProof, PublicKey)>
    ```

### 合约调用ZK相关函数
* 合约计算公共的公钥并验证
```rust
fn compute_aggregate_key<B: ToBytes>(
        pp: &Self::Parameters,
        player_keys_proof_info: &Vec<(Self::PlayerPublicKey, Self::ZKProofKeyOwnership, B)>,
    ) -> Result<Self::AggregatePublicKey, CardProtocolError>
``` 
* 验证洗牌
```rust
fn verify_shuffle(
        pp: &Self::Parameters,
        shared_key: &Self::AggregatePublicKey,
        original_deck: &Vec<Self::MaskedCard>,
        shuffled_deck: &Vec<Self::MaskedCard>,
        proof: &Self::ZKProofShuffle,
    ) -> Result<(), CryptoError>
```
* 公开牌，并验证是否正确
```rust
pub fn open_card(
    parameters: &CardParameters,
    reveal_tokens: &Vec<(RevealToken, RevealProof, PublicKey)>,
    card_mappings: &HashMap<Card, ClassicPlayingCard>,
    card: &MaskedCard,
) -> Result<ClassicPlayingCard, anyhow::Error>
```
* 私自看牌，函数中需要验证unmask是否正确
    ```rust
    pub fn peek_at_card(
        &mut self,
        parameters: &CardParameters,
        reveal_tokens: &mut Vec<(RevealToken, RevealProof, PublicKey)>,
        card_mappings: &HashMap<Card, ClassicPlayingCard>,
        card: &MaskedCard,
    ) -> Result<(), anyhow::Error>
    ```
* unmask 函数
  ```rust
  fn unmask(
        pp: &Self::Parameters,
        decryption_key: &Vec<(
            Self::RevealToken,
            Self::ZKProofReveal,
            Self::PlayerPublicKey,
        )>,
        masked_card: &Self::MaskedCard,
    ) -> Result<Self::Card, CardProtocolError>
  ```
- [ ] 对玩家打出的牌进行验证，证明这张牌属于自己 
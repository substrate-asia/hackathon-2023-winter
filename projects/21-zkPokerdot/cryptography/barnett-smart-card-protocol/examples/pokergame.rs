use barnett_smart_card_protocol::discrete_log_cards;
use barnett_smart_card_protocol::BarnettSmartProtocol;

use anyhow;
use ark_ff::{to_bytes, UniformRand};
use ark_std::{rand::Rng, One};
use proof_essentials::utils::permutation::Permutation;
use proof_essentials::utils::rand::sample_vector;
use proof_essentials::zkp::proofs::{chaum_pedersen_dl_equality, schnorr_identification};
use rand::thread_rng;
use std::collections::HashMap;
use std::iter::Iterator;
use std::thread::sleep;
use ark_crypto_primitives::CryptoError;
use thiserror::Error;

// Choose elliptic curve setting
type Curve = starknet_curve::Projective;
type Scalar = starknet_curve::Fr;

// Instantiate concrete type for our card protocol
type CardProtocol<'a> = discrete_log_cards::DLCards<'a, Curve>;
type CardParameters = discrete_log_cards::Parameters<Curve>;
type PublicKey = discrete_log_cards::PublicKey<Curve>;
type SecretKey = discrete_log_cards::PlayerSecretKey<Curve>;

type Card = discrete_log_cards::Card<Curve>;
type MaskedCard = discrete_log_cards::MaskedCard<Curve>;
type RevealToken = discrete_log_cards::RevealToken<Curve>;

type ProofKeyOwnership = schnorr_identification::proof::Proof<Curve>;
type RemaskingProof = chaum_pedersen_dl_equality::proof::Proof<Curve>;
type RevealProof = chaum_pedersen_dl_equality::proof::Proof<Curve>;

#[derive(Error, Debug, PartialEq)]
pub enum GameErrors {
    #[error("No such card in hand")]
    CardNotFound,

    #[error("Invalid card")]
    InvalidCard,
}

// 扑克牌的编号 1~54
#[derive(PartialEq, Clone, Eq, Copy)]
pub struct ClassicPlayingCard {
    card_id: usize,
}

impl ClassicPlayingCard {
    pub fn new(card_id: usize) -> Self {
        Self { card_id }
    }
}

// 输出格式
impl std::fmt::Debug for ClassicPlayingCard {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.card_id)
    }
}

#[derive(Clone)]
struct Player {
    name: Vec<u8>,
    sk: SecretKey,
    pk: PublicKey,
    proof_key: ProofKeyOwnership,
    cards: Vec<MaskedCard>,
    opened_cards: Vec<Option<ClassicPlayingCard>>,  // 自己可以看的牌
}

impl PartialEq for Player {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name && self.sk == other.sk && self.proof_key == other.proof_key
    }
}

impl Player {
    pub fn new<R: Rng>(rng: &mut R, pp: &CardParameters, name: &Vec<u8>) -> anyhow::Result<Self> {
        let (pk, sk) = CardProtocol::player_keygen(rng, pp)?;
        let proof_key = CardProtocol::prove_key_ownership(rng, pp, &pk, &sk, name)?;
        Ok(Self {
            name: name.clone(),
            sk,
            pk,
            proof_key,
            cards: vec![],
            opened_cards: vec![],
        })
    }

    // 玩家拿到牌
    pub fn receive_card(&mut self, card: MaskedCard) {
        self.cards.push(card);
        self.opened_cards.push(None);
    }

    // 玩家自己看牌
    pub fn peek_at_card(
        &mut self,
        parameters: &CardParameters,
        reveal_tokens: &mut Vec<(RevealToken, RevealProof, PublicKey)>,
        card_mappings: &HashMap<Card, ClassicPlayingCard>,
        card: &MaskedCard,
    ) -> Result<(), anyhow::Error> {
        let i = self.cards.iter().position(|&x| x == *card);

        let i = i.ok_or(GameErrors::CardNotFound)?;

        //TODO add function to create that without the proof
        let rng = &mut thread_rng();
        let own_reveal_token = self.compute_reveal_token(rng, parameters, card)?;
        reveal_tokens.push(own_reveal_token);

        let unmasked_card = CardProtocol::unmask(&parameters, reveal_tokens, card)?;
        let opened_card = card_mappings.get(&unmasked_card);
        let opened_card = opened_card.ok_or(GameErrors::InvalidCard)?;

        self.opened_cards[i] = Some(*opened_card);
        Ok(())
    }

    // 揭露token
    pub fn compute_reveal_token<R: Rng>(
        &self,
        rng: &mut R,
        pp: &CardParameters,
        card: &MaskedCard,
    ) -> anyhow::Result<(RevealToken, RevealProof, PublicKey)> {
        let (reveal_token, reveal_proof) =
            CardProtocol::compute_reveal_token(rng, &pp, &self.sk, &self.pk, card)?;

        Ok((reveal_token, reveal_proof, self.pk))
    }


}

//Every player will have to calculate this function for cards that are in play
pub fn open_card(
    parameters: &CardParameters,
    reveal_tokens: &Vec<(RevealToken, RevealProof, PublicKey)>,
    card_mappings: &HashMap<Card, ClassicPlayingCard>,
    card: &MaskedCard,
) -> Result<ClassicPlayingCard, anyhow::Error> {
    let unmasked_card = CardProtocol::unmask(&parameters, reveal_tokens, card)?;
    let opened_card = card_mappings.get(&unmasked_card);
    let opened_card = opened_card.ok_or(GameErrors::InvalidCard)?;

    Ok(*opened_card)
}

fn encode_cards<R: Rng>(rng: &mut R, num_of_cards: usize) -> HashMap<Card, ClassicPlayingCard> {
    let mut map: HashMap<Card, ClassicPlayingCard> = HashMap::new();
    let plaintexts = (0..num_of_cards)
        .map(|_| Card::rand(rng))
        .collect::<Vec<_>>();

    let mut i = 0;
    for id in 1..55 {
        let current_card = ClassicPlayingCard::new(id);
        map.insert(plaintexts[i], current_card);
        i += 1;
    }

    map
}

// 前端：每位玩家都协助解密第 k 张牌
fn public_deck_reveal_token<R: Rng>(
    players:&Vec<Player>,
    rng: &mut R,
    pp: &discrete_log_cards::Parameters<Curve>,
    card: &MaskedCard
)-> anyhow::Result<Vec<(RevealToken, RevealProof, PublicKey)>>{
    let mut result = Vec::new();
    for player in players {
        result.push(player.compute_reveal_token(rng, &pp, &card)?);
    }
    Ok(result)

}

// 前端：除第i位玩家外的其他玩家都协助解密第 k 张牌
fn secret_deck_reveal_token<R: Rng>(
    current_player: &Player,
    players: &Vec<Player>,
    rng: &mut R,
    pp: &CardParameters,
    card: &MaskedCard
)-> anyhow::Result<Vec<(RevealToken, RevealProof, PublicKey)>>{
    let mut result = Vec::new();
    for player in players{
        if player != current_player {
            result.push(player.compute_reveal_token(rng, &pp, &card)?);
        }
    }

    Ok(result)
}


fn main() -> anyhow::Result<()> {
    let m = 2;
    let n = 27;
    let num_of_cards = m * n;
    let rng = &mut thread_rng();  // 随机数

    // 前端：生成公共参数，包括承诺参数、加密参数、以及群生成元G
    let parameters = CardProtocol::setup(rng, m, n)?;
    // 前端：对Card（ElGamal明文）和 ClassicPlayingCard(原来的牌) 做一个映射
    let card_mapping = encode_cards(rng, num_of_cards);

    // 前端：生成3名玩家
    let mut alice = Player::new(rng, &parameters, &to_bytes![b"Alice"].unwrap())?;
    let mut bob = Player::new(rng, &parameters, &to_bytes![b"Bob"].unwrap())?;
    let mut carol = Player::new(rng, &parameters, &to_bytes![b"Carol"].unwrap())?;

    let players = vec![alice.clone(), bob.clone(), carol.clone()];

    let key_proof_info = players
        .iter()
        .map(|p| (p.pk, p.proof_key, p.name.clone()))
        .collect::<Vec<_>>();

    // Each player should run this computation. Alternatively, it can be ran by a smart contract
    // 合约：需要合约进行验证，验证拥有对应的公钥，在compute_aggregate_key函数中需要验证每位玩家拥有正确的公钥和私钥
    let joint_pk = CardProtocol::compute_aggregate_key(&parameters, &key_proof_info)?;

    // Each player should run this computation and verify that all players agree on the initial deck
    // ？前端：第一次mask牌
    let deck_and_proofs: Vec<(MaskedCard, RemaskingProof)> = card_mapping
        .keys()
        .map(|card| CardProtocol::mask(rng, &parameters, &joint_pk, &card, &Scalar::one()))
        .collect::<Result<Vec<_>, _>>()?;

    let deck = deck_and_proofs
        .iter()
        .map(|x| x.0)
        .collect::<Vec<MaskedCard>>();

    // // TODO 合约：验证第一次mask牌，还需要修改
    // for deck_and_proof in &deck_and_proofs {
    //     for card in card_mapping.keys() {
    //         CardProtocol::verify_mask(&parameters, &joint_pk, &card, &deck_and_proof.0, &deck_and_proof.1)?;
    //     }
    // }


    // SHUFFLE TIME --------------
    // 1.a Alice shuffles first
    // 前端：洗牌
    let permutation = Permutation::new(rng, m * n);
    let masking_factors: Vec<Scalar> = sample_vector(rng, m * n);

    let (a_shuffled_deck, a_shuffle_proof) = CardProtocol::shuffle_and_remask(
        rng,
        &parameters,
        &joint_pk,
        &deck,
        &masking_factors,
        &permutation,
    )?;

    // 1.b everyone checks!
    // 合约：进行验证
    CardProtocol::verify_shuffle(
        &parameters,
        &joint_pk,
        &deck,
        &a_shuffled_deck,
        &a_shuffle_proof,
    )?;

    //2.a Bob shuffles second
    // 前端
    let permutation = Permutation::new(rng, m * n);
    let masking_factors: Vec<Scalar> = sample_vector(rng, m * n);

    let (b_shuffled_deck, b_shuffle_proof) = CardProtocol::shuffle_and_remask(
        rng,
        &parameters,
        &joint_pk,
        &a_shuffled_deck,
        &masking_factors,
        &permutation,
    )?;

    //2.b Everyone checks
    // 合约
    CardProtocol::verify_shuffle(
        &parameters,
        &joint_pk,
        &a_shuffled_deck,
        &b_shuffled_deck,
        &b_shuffle_proof,
    )?;

    //3.a Carol shuffles last
    // 前端
    let permutation = Permutation::new(rng, m * n);
    let masking_factors: Vec<Scalar> = sample_vector(rng, m * n);

    let (final_shuffled_deck, final_shuffle_proof) = CardProtocol::shuffle_and_remask(
        rng,
        &parameters,
        &joint_pk,
        &b_shuffled_deck,
        &masking_factors,
        &permutation,
    )?;

    //3.b Everyone checks before accepting last deck for game
    // 合约：进行验证
    CardProtocol::verify_shuffle(
        &parameters,
        &joint_pk,
        &b_shuffled_deck,
        &final_shuffled_deck,
        &final_shuffle_proof,
    )?;


    // CARDS ARE SHUFFLED. ROUND OF THE GAME CAN BEGIN
    // 前端：洗牌完成
    let deck = final_shuffled_deck;

    // 前端：发牌
    // 首先，给每人发17张牌
    for i in 0..17 {
        alice.receive_card(deck[3 * &i]);
        bob.receive_card(deck[3 * &i + 1]);
        carol.receive_card(deck[3 * &i + 2]);
    }
    // 地主牌
    let landlord_deck1 = deck[51];
    let landlord_deck2 = deck[52];
    let landlord_deck3 = deck[53];

    //  前端：叫地主阶段
    println!("=========叫地主阶段=========");
    // 前端：首先每个玩家协助解密每张地主牌
    let rt_landlord_deck1 = public_deck_reveal_token(&players, rng, &parameters, &landlord_deck1)?;
    let rt_landlord_deck2 = public_deck_reveal_token(&players, rng, &parameters, &landlord_deck2)?;
    let rt_landlord_deck3 = public_deck_reveal_token(&players, rng, &parameters, &landlord_deck3)?;

    // 合约：open_card里需要做验证，确保公开的牌正确，公开地主牌
    let landlord_card1 = open_card(&parameters, &rt_landlord_deck1, &card_mapping, &landlord_deck1)?;
    let landlord_card2 = open_card(&parameters, &rt_landlord_deck2, &card_mapping, &landlord_deck2)?;
    let landlord_card3 = open_card(&parameters, &rt_landlord_deck3, &card_mapping, &landlord_deck3)?;
    print!("地主牌是： ");
    print!("{:?} ", landlord_card1);
    print!("{:?} ", landlord_card2);
    print!("{:?}\n", landlord_card3);

    // 前端：假设是Alice叫到地主，Alice接收这三张地主牌
    alice.receive_card(landlord_deck1);
    alice.receive_card(landlord_deck2);
    alice.receive_card(landlord_deck3);

    // 前端：每位玩家获得自己的牌，进行自己看牌阶段
    println!("=============每位玩家自己查看自己的手牌============");
    for i in 0..17 {
        let mut rts_alice = secret_deck_reveal_token(&alice, &players, rng, &parameters, &deck[3 * &i])?;
        let mut rts_bob = secret_deck_reveal_token(&bob, &players, rng, &parameters, &deck[3 * &i + 1])?;
        let mut rts_carol = secret_deck_reveal_token(&carol, &players, rng, &parameters, &deck[3 * &i + 2])?;

        alice.peek_at_card(&parameters, &mut rts_alice, &card_mapping, &deck[3 * &i])?;
        bob.peek_at_card(&parameters, &mut rts_bob, &card_mapping, &deck[3 * &i + 1])?;
        carol.peek_at_card(&parameters, &mut rts_carol, &card_mapping, &deck[3 * &i + 2])?;
    }

    // 前端：Alice 自己看地主牌
    let mut rts_landlord1_alice = secret_deck_reveal_token(&alice, &players, rng, &parameters, &landlord_deck1)?;
    let mut rts_landlord2_alice = secret_deck_reveal_token(&alice, &players, rng, &parameters, &landlord_deck2)?;
    let mut rts_landlord3_alice = secret_deck_reveal_token(&alice, &players, rng, &parameters, &landlord_deck3)?;
    alice.peek_at_card(&parameters, &mut rts_landlord1_alice, &card_mapping, &landlord_deck1)?;
    alice.peek_at_card(&parameters, &mut rts_landlord2_alice, &card_mapping, &landlord_deck2)?;
    alice.peek_at_card(&parameters, &mut rts_landlord3_alice, &card_mapping, &landlord_deck3)?;

    // 前端：如果玩家本地要看自己的牌，可以调用，进行显示
    println!("Alice查看自己的牌：");
    for alice_cards in &alice.opened_cards {
        match alice_cards {
            Some(s) => {
                print!("{:?} ", s);
            }
            None => {}
        }
    }
    println!("\nBob查看自己的牌：");
    for bob_cards in &bob.opened_cards {
        match bob_cards {
            Some(s) => {
                print!("{:?} ", s);
            }
            None => {}
        }
    }
    println!("\nCarol查看自己的牌：");
    for carol_cards in &carol.opened_cards {
        match carol_cards {
            Some(s) => {
                print!("{:?} ", s);
            }
            None => {}
        }
    }


    /* Here we can add custom logic of a game:
        1. swap card
        2. place a bet
        3. ...
    */

    //At this moment players reveal their cards to each other and everything becomes public
    //1.a everyone reveals the secret for their card
    //2. tokens for all other cards are exchanged

    // 前端：进入游戏阶段
    // 假设每个人打出单牌
    // Alice,Bob,Carol 每个人打出自己的第一张牌
    println!("\n=========打牌阶段=========");
    // 前端：每个人协助解密要打的牌
    let rt_0 = public_deck_reveal_token(&players, rng, &parameters, &deck[0])?;
    let rt_1 = public_deck_reveal_token(&players, rng, &parameters, &deck[1])?;
    let rt_2 = public_deck_reveal_token(&players, rng, &parameters, &deck[2])?;

    //Everyone computes for each card (except for their own card):
    // 合约：open_card里需要做验证，确保公开的牌正确，公开要打的牌
    let alice_card = open_card(&parameters, &rt_0, &card_mapping, &deck[0])?;
    let bob_card = open_card(&parameters, &rt_1, &card_mapping, &deck[1])?;
    let carol_card = open_card(&parameters, &rt_2, &card_mapping, &deck[2])?;

    println!("========= Round 1 =========");
    println!("Alice出牌: {:?}", alice_card);
    println!("Bob出牌: {:?}", bob_card);
    println!("Carol出牌: {:?}", carol_card);

    Ok(())
}
use gear_contract_api::user_have_subject_share;


#[tokio::main]
async fn main() {
    let subject_address= "0xec59e48cf877dfab6e6ba04b24d29349f11cf0bcfa44d04d7b875397225a1b2a";
    let user_have_subject_share = user_have_subject_share(subject_address,subject_address).await;
    println!("user_have_subject_share is:{:?}",user_have_subject_share);
}
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
    msg,  // 这里导入了msg宏
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VotingAccount {
    pub votes: u64,                  // 总票数
    pub voted_entries: Vec<VoteEntry>, // 已投票的记录
    pub balance: u64,                // token余额
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VoteEntry {
    pub index: u64,   // 被投票的index
    pub vote_count: u64, // 投票数
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    match instruction_data[0] {
        0 => claim_token(accounts, program_id),
        1 => view_balance(accounts, program_id),
        2 => vote(accounts, program_id, instruction_data),
        _ => Err(ProgramError::InvalidInstructionData),
    }
}

fn claim_token(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    let account = next_account_info(&mut accounts.iter())?; // 这里进行了修改
    if account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut voting_account = VotingAccount::try_from_slice(&account.data.borrow())?;
    voting_account.balance += 1; // 假设每次claim增加1 token
    voting_account.serialize(&mut *account.data.borrow_mut())?;
    
    Ok(())
}

fn view_balance(
    accounts: &[AccountInfo],
    _program_id: &Pubkey,
) -> ProgramResult {
    let account = next_account_info(&mut accounts.iter())?; // 这里进行了修改
    let voting_account = VotingAccount::try_from_slice(&account.data.borrow())?;
    msg!("Your balance is {}", voting_account.balance); // 这里使用了msg宏
    
    Ok(())
}

fn vote(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    instruction_data: &[u8],
) -> ProgramResult {
    let account = next_account_info(&mut accounts.iter())?; // 这里进行了修改
    if account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    if instruction_data.len() < 9 {
        return Err(ProgramError::InvalidInstructionData);
    }
    let vote_index = u64::from_le_bytes(instruction_data[1..9].try_into().unwrap());

    let mut voting_account = VotingAccount::try_from_slice(&account.data.borrow_mut())?;
    
    if voting_account.balance == 0 {
        return Err(ProgramError::InsufficientFunds);
    }

    // 简单的投票逻辑：每次投票消耗1个token
    voting_account.balance -= 1;
    let mut voted = false;
    for entry in &mut voting_account.voted_entries {
        if entry.index == vote_index {
            entry.vote_count += 1;
            voted = true;
            break;
        }
    }
    if !voted {
        voting_account.voted_entries.push(VoteEntry {
            index: vote_index,
            vote_count: 1,
        });
    }
    
    voting_account.serialize(&mut *account.data.borrow_mut())?;
    
    Ok(())
}

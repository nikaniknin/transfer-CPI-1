use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    system_instruction,
    program::invoke,
};

// Entry point for the program
entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let from_account = next_account_info(accounts_iter)?;
    let to_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    let transfer_amount = 1_000_000; // Amount in lamports (0.001 SOL)

    let ix = system_instruction::transfer(
        from_account.key,
        to_account.key,
        transfer_amount,
    );

    invoke(
        &ix,
        &[
            from_account.clone(),
            to_account.clone(),
            system_program_account.clone(),
        ],
    )?;

    Ok(())
}

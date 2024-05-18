const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

(async () => {
    // Connect to the cluster
    const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('devnet'),
        'confirmed',
    );


     // Path to your wallet keypair
    //const keypairPath = path.resolve('/Users/nika/.config/solana/devnet-keypair.json');

     // Load the from wallet
    //const fromWallet = solanaWeb3.Keypair.fromSecretKey(
    //   Uint8Array.from(JSON.parse(fs.readFileSync(keypairPath, 'utf8')))
    //);

    // Load the from wallet
    const fromWallet = solanaWeb3.Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '/Users/nika/.config/solana/devnet-keypair.json'), 'utf8')))
    );

    // Create a new wallet to receive the funds
    const toWallet = solanaWeb3.Keypair.generate();

    // Airdrop some SOL to the fromWallet
    const airdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        solanaWeb3.LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);
    console.log('Airdrop complete to From Wallet:', fromWallet.publicKey.toBase58());

    // Deploy Program ID
    const programId = new solanaWeb3.PublicKey('6pJaNqhR3nq7ZhTgEfjZB2N9XFvSeuyqRHeq5jFEqqs6');  // Replace with your deployed program ID
    const systemProgramId = solanaWeb3.SystemProgram.programId;

    const transaction = new solanaWeb3.Transaction().add(
        new solanaWeb3.TransactionInstruction({
            programId,
            keys: [
                { pubkey: fromWallet.publicKey, isSigner: true, isWritable: true },
                { pubkey: toWallet.publicKey, isSigner: false, isWritable: true },
                { pubkey: systemProgramId, isSigner: false, isWritable: false },
            ],
            data: Buffer.alloc(0), // No additional data
        })
    );

    // Sign and send the transaction
    const signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
    );

    console.log('Transaction complete with signature:', signature);
    console.log('Funds transferred to:', toWallet.publicKey.toBase58());
})();

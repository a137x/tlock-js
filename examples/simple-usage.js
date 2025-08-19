const { timelockEncrypt, mainnetClient } = require('../dist/index.js');

/**
 * Simple example: Encrypt arbitrary text for a specific round
 * 
 * This is the most basic usage pattern for encrypting text with tlock-js.
 * 
 * USAGE:
 * node examples/simple-usage.js
 */

async function simpleEncrypt() {
    try {
        // 1. Your text to encrypt
        const text = "Hello, this is my secret message!";
        
        // 2. Target round (when decryption becomes possible)
        const round = 11645812;
        
        // 3. Create client for mainnet (quicknet)
        const client = mainnetClient();
        
        // 4. Encrypt the text
        console.log(`🔐 Encrypting: "${text}"`);
        console.log(`🎯 For round: ${round}`);
        
        const encrypted = await timelockEncrypt(round, Buffer.from(text, 'utf8'), client);
        
        console.log('✅ Encryption successful!');
        
        // 5. Save to file
        const fs = require('fs');
        const filename = `secret-message-round-${round}.age`;
        fs.writeFileSync(filename, encrypted);
        
        console.log(`📁 Saved to: ${filename}`);
        console.log(`⏰ Can be decrypted after round ${round} is reached`);
        
        return encrypted;
        
    } catch (error) {
        console.error('❌ Encryption failed:', error);
        throw error;
    }
}

// Run the example
simpleEncrypt().catch(console.error);

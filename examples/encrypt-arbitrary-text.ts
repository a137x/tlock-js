import { timelockEncrypt, timelockDecrypt, mainnetClient, testnetClient, ChainClient } from '../dist/index.js';

/**
 * TLOCK-JS: Encrypt Arbitrary Text for Specific Rounds
 * 
 * This file demonstrates how to use tlock-js to encrypt arbitrary text
 * that can only be decrypted after a specific drand round is reached.
 * 
 * USAGE:
 * 1. Compile: npm run compile
 * 2. Run: node examples/encrypt-arbitrary-text.js
 */

// =============================================================================
// BASIC ENCRYPTION FUNCTION
// =============================================================================

/**
 * Encrypt arbitrary text for a specific round
 * @param text - The text to encrypt
 * @param roundNumber - The target round number (must be >= 1)
 * @param client - The drand chain client
 * @returns Promise<string> - The encrypted age file content
 */
export async function encryptText(
    text: string, 
    roundNumber: number, 
    client: ChainClient
): Promise<string> {
    // Validate input
    if (roundNumber < 1) {
        throw new Error('Round number must be at least 1');
    }
    
    if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
    }
    
    console.log(`🔐 Encrypting: "${text}"`);
    console.log(`🎯 Target round: ${roundNumber}`);
    
    try {
        // Convert text to Buffer and encrypt
        const textBuffer = Buffer.from(text, 'utf8');
        const encrypted = await timelockEncrypt(roundNumber, textBuffer, client);
        
        console.log('✅ Encryption successful!');
        return encrypted;
        
    } catch (error) {
        console.error('❌ Encryption failed:', error);
        throw error;
    }
}

// =============================================================================
// ENCRYPTION EXAMPLES
// =============================================================================

/**
 * Example 1: Encrypt for mainnet (quicknet) - Long-term storage
 */
export async function exampleMainnet(): Promise<void> {
    console.log('\n=== Example 1: Mainnet Quicknet ===');
    
    const text = "This is a secret message for mainnet!";
    const round = 11645812;
    
    try {
        const client = mainnetClient();
        const encrypted = await encryptText(text, round, client);
        
        // Save to file
        const fs = await import('fs');
        const filename = `mainnet-round-${round}.age`;
        fs.writeFileSync(filename, encrypted);
        
        console.log(`📁 Saved to: ${filename}`);
        console.log(`⏰ Can be decrypted after round ${round} is reached`);
        
    } catch (error) {
        console.error('Mainnet example failed:', error);
    }
}

/**
 * Example 2: Encrypt for future round - Very long-term storage
 */
export async function exampleFutureRound(): Promise<void> {
    console.log('\n=== Example 2: Future Round ===');
    
    const text = "This message will be decryptable much later!";
    const round = 12000000; // Very future round
    
    try {
        const client = mainnetClient();
        const encrypted = await encryptText(text, round, client);
        
        // Save to file
        const fs = await import('fs');
        const filename = `future-round-${round}.age`;
        fs.writeFileSync(filename, encrypted);
        
        console.log(`📁 Saved to: ${filename}`);
        console.log(`⏰ Can be decrypted after round ${round} is reached`);
        console.log(`💡 Note: This is a very future round, so decryption will be much later`);
        
    } catch (error) {
        console.error('Future round example failed:', error);
    }
}

/**
 * Example 3: Encrypt for testnet - Shorter wait times for testing
 */
export async function exampleTestnet(): Promise<void> {
    console.log('\n=== Example 3: Testnet (Shorter Wait) ===');
    
    const text = "Testnet message with shorter timelock!";
    const round = 20000; // This might be available sooner
    
    try {
        const client = testnetClient();
        const encrypted = await encryptText(text, round, client);
        
        // Save to file
        const fs = await import('fs');
        const filename = `testnet-round-${round}.age`;
        fs.writeFileSync(filename, encrypted);
        
        console.log(`📁 Saved to: ${filename}`);
        console.log(`⏰ Can be decrypted after round ${round} is reached`);
        console.log(`🧪 This is on testnet, so rounds may be available sooner`);
        
    } catch (error) {
        console.error('Testnet example failed:', error);
        console.log('⚠️  This is normal if testnet endpoints are not available');
    }
}

/**
 * Example 4: Custom text and round
 */
export async function exampleCustom(text: string, round: number): Promise<void> {
    console.log('\n=== Example 4: Custom Text and Round ===');
    
    try {
        const client = mainnetClient();
        const encrypted = await encryptText(text, round, client);
        
        // Save to file
        const fs = await import('fs');
        const filename = `custom-round-${round}.age`;
        fs.writeFileSync(filename, encrypted);
        
        console.log(`📁 Saved to: ${filename}`);
        console.log(`⏰ Can be decrypted after round ${round} is reached`);
        
    } catch (error) {
        console.error('Custom example failed:', error);
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get current round information from a client
 */
export async function getCurrentRoundInfo(client: ChainClient): Promise<void> {
    try {
        const chainInfo = await client.chain().info();
        console.log('\n📊 Current Chain Information:');
        console.log(`   Chain Hash: ${chainInfo.hash}`);
        console.log(`   Scheme: ${chainInfo.schemeID}`);
        console.log(`   Public Key: ${chainInfo.public_key.substring(0, 32)}...`);
        
        // Note: We can't get the exact current round without additional API calls
        console.log('   💡 To get current round, check drand network status');
        
    } catch (error) {
        console.error('Failed to get chain info:', error);
    }
}

/**
 * Validate and format round number
 */
export function validateRound(round: number): number {
    if (!Number.isInteger(round)) {
        throw new Error('Round number must be an integer');
    }
    
    if (round < 1) {
        throw new Error('Round number must be at least 1');
    }
    
    if (round > Number.MAX_SAFE_INTEGER) {
        throw new Error('Round number is too large');
    }
    
    return round;
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main(): Promise<void> {
    console.log('🚀 TLOCK-JS: Encrypt Arbitrary Text Examples');
    console.log('=============================================\n');
    
    try {
        // Show current chain info
        const client = mainnetClient();
        await getCurrentRoundInfo(client);
        
        // Run examples
        await exampleMainnet();
        await exampleFutureRound();
        await exampleTestnet();
        
        // Custom example
        const customText = "Hello, this is my custom secret message!";
        const customRound = 11650000;
        await exampleCustom(customText, customRound);
        
        console.log('\n=== Summary ===');
        console.log('✅ Created encrypted files for different rounds');
        console.log('✅ Each file can only be decrypted after its target round');
        console.log('✅ Files include filekey hash for verification');
        console.log('\n📚 To decrypt later, use:');
        console.log('   const decrypted = await timelockDecrypt(encryptedContent, client);');
        console.log('\n🔗 For more info: https://github.com/drand/tlock-js');
        
    } catch (error) {
        console.error('❌ Main execution failed:', error);
    }
}

// Export functions for use in other modules
export {
    encryptText,
    exampleMainnet,
    exampleFutureRound,
    exampleTestnet,
    exampleCustom,
    getCurrentRoundInfo,
    validateRound
};

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

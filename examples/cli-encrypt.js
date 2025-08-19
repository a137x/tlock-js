#!/usr/bin/env node

const { timelockEncrypt, mainnetClient, testnetClient } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

/**
 * TLOCK-JS CLI: Encrypt Text from Command Line
 * 
 * USAGE:
 * node examples/cli-encrypt.js "Your text here" 11645812
 * node examples/cli-encrypt.js "Your text here" 11645812 --output myfile.age
 * node examples/cli-encrypt.js "Your text here" 11645812 --testnet
 * node examples/cli-encrypt.js "Your text here" 11645812 --stdout
 * node examples/cli-encrypt.js --help
 */

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }
    
    if (args.length < 2) {
        console.error('❌ Error: Missing required arguments');
        showUsage();
        process.exit(1);
    }
    
    const text = args[0];
    const round = parseInt(args[1]);
    
    if (!text || text.trim().length === 0) {
        console.error('❌ Error: Text cannot be empty');
        process.exit(1);
    }
    
    if (isNaN(round) || round < 1) {
        console.error('❌ Error: Round must be a positive integer');
        process.exit(1);
    }
    
    const options = {
        text,
        round,
        output: null,
        testnet: false,
        verbose: false,
        stdout: false,
        quiet: false
    };
    
    // Parse flags
    for (let i = 2; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '--output' || arg === '-o') {
            if (i + 1 < args.length) {
                options.output = args[i + 1];
                i++; // Skip next argument
            } else {
                console.error('❌ Error: --output requires a filename');
                process.exit(1);
            }
        } else if (arg === '--testnet' || arg === '-t') {
            options.testnet = true;
        } else if (arg === '--verbose' || arg === '-v') {
            options.verbose = true;
        } else if (arg === '--stdout' || arg === '-s') {
            options.stdout = true;
        } else if (arg === '--quiet' || arg === '-q') {
            options.quiet = true;
        } else if (arg.startsWith('--')) {
            console.error(`❌ Error: Unknown flag: ${arg}`);
            process.exit(1);
        }
    }
    
    // Validate options
    if (options.stdout && options.output) {
        console.error('❌ Error: Cannot use both --stdout and --output');
        process.exit(1);
    }
    
    if (options.quiet && !options.stdout) {
        console.error('❌ Error: --quiet can only be used with --stdout');
        process.exit(1);
    }
    
    return options;
}

function showHelp() {
    console.log(`
🔐 TLOCK-JS CLI: Encrypt Text from Command Line
================================================

USAGE:
  node examples/cli-encrypt.js "text" round [options]

ARGUMENTS:
  text    The text to encrypt (use quotes for spaces)
  round   Target drand round number (must be >= 1)

OPTIONS:
  -o, --output <file>    Output filename (default: auto-generated)
  -s, --stdout           Output encrypted content to stdout (for piping)
  -q, --quiet            Suppress all output except encrypted content (use with --stdout)
  -t, --testnet          Use testnet instead of mainnet
  -v, --verbose          Show detailed information
  -h, --help             Show this help message

EXAMPLES:
  # Basic encryption
  node examples/cli-encrypt.js "Hello World" 11645812
  
  # Save to specific file
  node examples/cli-encrypt.js "Secret message" 11645812 --output secret.age
  
  # Output to stdout (for piping to other tools)
  node examples/cli-encrypt.js "Secret message" 11645812 --stdout
  
  # Quiet stdout output (only encrypted content)
  node examples/cli-encrypt.js "Secret message" 11645812 --stdout --quiet
  
  # Use testnet
  node examples/cli-encrypt.js "Test message" 20000 --testnet
  
  # Verbose output
  node examples/cli-encrypt.js "My text" 11650000 --verbose

NETWORKS:
  Mainnet (default): 52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971
  Testnet:           7672797f548f3f4748ac4bf3352fc6c6b6468c9ad40ad456a397545c6e2df5bf

PIPING EXAMPLES:
  # Save encrypted content to file
  node examples/cli-encrypt.js "My secret" 11645812 --stdout > secret.age
  
  # Encrypt and immediately decrypt (for testing)
  node examples/cli-encrypt.js "Test" 11645812 --stdout | node examples/cli-decrypt.js
  
  # Encrypt and compress
  node examples/cli-encrypt.js "Long text" 11645812 --stdout | gzip > secret.age.gz
`);
}

function showUsage() {
    console.log(`
USAGE: node examples/cli-encrypt.js "text" round [options]
Try: node examples/cli-encrypt.js --help for more information
`);
}

async function encryptText(options) {
    const { text, round, testnet, verbose, stdout, quiet } = options;
    
    try {
        // Choose client
        const client = testnet ? testnetClient() : mainnetClient();
        const networkName = testnet ? 'testnet' : 'mainnet (quicknet)';
        
        if (!quiet) {
            if (verbose) {
                console.log(`🔐 Encrypting text for ${networkName}`);
                console.log(`📝 Text: "${text}"`);
                console.log(`🎯 Round: ${round}`);
                console.log(`🌐 Network: ${networkName}`);
                
                // Show chain info
                try {
                    const chainInfo = await client.chain().info();
                    console.log(`🔗 Chain Hash: ${chainInfo.hash}`);
                    console.log(`📋 Scheme: ${chainInfo.schemeID}`);
                } catch (error) {
                    console.log(`⚠️  Could not fetch chain info: ${error.message}`);
                }
            } else {
                console.log(`🔐 Encrypting: "${text}"`);
                console.log(`🎯 Target round: ${round}`);
            }
        }
        
        // Encrypt
        const textBuffer = Buffer.from(text, 'utf8');
        const encrypted = await timelockEncrypt(round, textBuffer, client);
        
        if (!quiet) {
            console.log('✅ Encryption successful!');
        }
        
        if (stdout) {
            // Output encrypted content to stdout
            if (!quiet) {
                console.log('📤 Outputting encrypted content to stdout:');
                console.log('─'.repeat(50));
            }
            process.stdout.write(encrypted);
            if (!quiet) {
                console.log('\n─'.repeat(50));
            }
        } else {
            // Generate filename if not specified
            let filename = options.output;
            if (!filename) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const network = testnet ? 'testnet' : 'mainnet';
                filename = `encrypted-${network}-round-${round}-${timestamp}.age`;
            }
            
            // Save file
            fs.writeFileSync(filename, encrypted);
            if (!quiet) {
                console.log(`📁 Saved to: ${filename}`);
                console.log(`⏰ Can be decrypted after round ${round} is reached`);
                
                if (verbose) {
                    console.log(`\n📊 File Details:`);
                    console.log(`   Size: ${(encrypted.length / 1024).toFixed(2)} KB`);
                    console.log(`   Format: Age encryption with timelock`);
                    console.log(`   Filekey Hash: Included for verification`);
                }
            }
        }
        
        return { encrypted, filename: stdout ? null : (options.output || 'auto-generated') };
        
    } catch (error) {
        if (!quiet) {
            console.error('❌ Encryption failed:', error.message);
            if (verbose) {
                console.error('Full error:', error);
            }
        }
        throw error;
    }
}

async function main() {
    try {
        const options = parseArgs();
        
        if (!options.quiet) {
            console.log('🚀 TLOCK-JS CLI Encryption Tool');
            console.log('================================\n');
        }
        
        await encryptText(options);
        
        if (!options.quiet) {
            if (options.stdout) {
                console.log('\n🎉 Done! Encrypted content output to stdout.');
                console.log('\n💡 You can pipe this output to other tools or save to file.');
            } else {
                console.log('\n🎉 Done! Your text has been encrypted and saved.');
            }
            console.log('\n💡 To decrypt later, use:');
            console.log('   const decrypted = await timelockDecrypt(encryptedContent, client);');
        }
        
    } catch (error) {
        if (!options.quiet) {
            console.error('\n💥 Fatal error:', error.message);
        }
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = { encryptText, parseArgs };

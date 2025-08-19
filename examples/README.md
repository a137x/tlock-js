# TLOCK-JS: Encrypt Arbitrary Text Examples

This directory contains examples and utilities for encrypting arbitrary text using tlock-js timelock encryption.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- tlock-js project compiled
- Internet connection for drand network access

### Basic Usage

1. **Compile the project:**
   ```bash
   npm run compile
   ```

2. **Run the examples:**
   ```bash
   # Simple example
   node examples/simple-usage.js
   
   # Comprehensive examples
   node examples/encrypt-arbitrary-text.js
   
   # CLI tool for command line encryption
   node examples/cli-encrypt.js "Your text" 11645812
   ```

## 📁 Files

- **`encrypt-arbitrary-text.ts`** - Main TypeScript file with examples
- **`simple-usage.ts`** - Simple, focused example for basic usage
- **`cli-encrypt.js`** - **NEW!** Command-line tool for encrypting text
- **`README.md`** - This instruction file

## 🔐 Core Function

### `encryptText(text, roundNumber, client)`

The main function for encrypting arbitrary text:

```typescript
async function encryptText(
    text: string,           // Your text to encrypt
    roundNumber: number,    // Target drand round
    client: ChainClient     // Drand network client
): Promise<string>         // Returns encrypted age file
```

**Parameters:**
- `text`: The text string you want to encrypt
- `roundNumber`: The drand round when decryption becomes possible
- `client`: Network client (use `mainnetClient()` for quicknet)

**Returns:**
- Encrypted age file content as a string

## 🖥️ CLI Tool (NEW!)

### `cli-encrypt.js` - Command Line Encryption

Encrypt text directly from the command line:

```bash
# Basic usage
node examples/cli-encrypt.js "Your text here" 11645812

# Save to specific file
node examples/cli-encrypt.js "Secret message" 11645812 --output secret.age

# Use testnet
node examples/cli-encrypt.js "Test message" 20000 --testnet

# Verbose output
node examples/cli-encrypt.js "My text" 11650000 --verbose

# Show help
node examples/cli-encrypt.js --help
```

**CLI Options:**
- `-o, --output <file>` - Specify output filename
- `-s, --stdout` - Output encrypted content to stdout (for piping)
- `-q, --quiet` - Suppress all output except encrypted content (use with --stdout)
- `-t, --testnet` - Use testnet instead of mainnet
- `-v, --verbose` - Show detailed information
- `-h, --help` - Show help message

**CLI Features:**
- ✅ **Direct text input** from command line
- ✅ **Auto-generated filenames** with timestamps
- ✅ **Network selection** (mainnet/testnet)
- ✅ **Verbose mode** for debugging
- ✅ **Error handling** with helpful messages
- ✅ **Filekey hash verification** included
- ✅ **STDOUT output** for piping to other tools
- ✅ **Quiet mode** for clean output

### 🚀 **NEW: STDOUT Output & Piping**

The CLI tool now supports outputting encrypted content directly to stdout, making it perfect for piping to other tools:

```bash
# Output encrypted content to stdout
node examples/cli-encrypt.js "Secret message" 11645812 --stdout

# Quiet stdout output (only encrypted content, no other messages)
node examples/cli-encrypt.js "Secret message" 11645812 --stdout --quiet

# Pipe to file
node examples/cli-encrypt.js "My secret" 11645812 --stdout --quiet > secret.age

# Pipe to other tools
node examples/cli-encrypt.js "Test" 11645812 --stdout --quiet | gzip > secret.age.gz

# Chain with other commands
node examples/cli-encrypt.js "Data" 11645812 --stdout --quiet | base64 | tr -d '\n' > secret.txt
```

**Use Cases for STDOUT:**
- 🔄 **Piping to files** - Save encrypted content directly
- 🔧 **Integration with scripts** - Use in automation
- 📦 **Compression** - Pipe to gzip, bzip2, etc.
- 🔐 **Chaining** - Combine with other encryption tools
- 📊 **Processing** - Filter, transform, or analyze encrypted content

## 📚 Examples

### Example 1: Mainnet Quicknet
```typescript
const text = "This is a secret message for mainnet!";
const round = 11645812;
const client = mainnetClient();

const encrypted = await encryptText(text, round, client);
// Saves to: mainnet-round-11645812.age
```

### Example 2: Future Round
```typescript
const text = "This message will be decryptable much later!";
const round = 12000000; // Very future round
const client = mainnetClient();

const encrypted = await encryptText(text, round, client);
// Saves to: future-round-12000000.age
```

### Example 3: Testnet (Shorter Wait)
```typescript
const text = "Testnet message with shorter timelock!";
const round = 20000; // Available sooner
const client = testnetClient();

const encrypted = await encryptText(text, round, client);
// Saves to: testnet-round-20000.age
```

### Example 4: Custom Text and Round
```typescript
const customText = "Hello, this is my custom secret message!";
const customRound = 11650000;
const client = mainnetClient();

const encrypted = await encryptText(customText, customRound, client);
// Saves to: custom-round-11650000.age
```

## 🛠️ Utility Functions

### `getCurrentRoundInfo(client)`
Displays current chain information (hash, scheme, public key).

### `validateRound(round)`
Validates round number (must be integer ≥ 1).

## 🔒 How It Works

1. **Text Input**: Your text is converted to a UTF-8 Buffer
2. **Timelock Encryption**: Text is encrypted using drand timelock encryption
3. **Round Binding**: Decryption is only possible after the specified round
4. **File Output**: Encrypted content is saved as an age file
5. **Filekey Hash**: SHA256 hash of the filekey is included for verification

## ⏰ Timing Considerations

- **Current Round**: Check drand network status for current round
- **Future Rounds**: Higher numbers = longer wait times
- **Network Speed**: Drand produces new rounds every ~30 seconds
- **Decryption**: Only possible after target round is reached

## 📖 Decryption

To decrypt later:

```typescript
import { timelockDecrypt, mainnetClient } from './dist/index.js';

const client = mainnetClient();
const decrypted = await timelockDecrypt(encryptedContent, client);
console.log(decrypted.toString('utf8')); // Your original text
```

## 🌐 Network Options

### Mainnet (Quicknet)
- **Client**: `mainnetClient()`
- **Chain Hash**: `52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971`
- **Use Case**: Production, long-term storage

### Testnet
- **Client**: `testnetClient()`
- **Chain Hash**: `7672797f548f3f4748ac4bf3352fc6c6b6468c9ad40ad456a397545c6e2df5bf`
- **Use Case**: Testing, shorter wait times

## ⚠️ Important Notes

1. **Round Validation**: Rounds must be positive integers ≥ 1
2. **Network Dependencies**: Requires internet connection to drand network
3. **Timing**: Decryption time depends on when the round becomes available
4. **Security**: Files are encrypted with timelock encryption
5. **Compatibility**: Generated files include filekey hash for verification

## 🐛 Troubleshooting

### Common Issues

1. **"Round number must be at least 1"**
   - Ensure round number is positive integer

2. **"Text cannot be empty"**
   - Provide non-empty text string

3. **Network errors**
   - Check internet connection
   - Verify drand network endpoints are accessible

4. **Compilation errors**
   - Run `npm run compile` first
   - Check TypeScript configuration

### Error Handling

The examples include comprehensive error handling:
- Input validation
- Network error handling
- Graceful fallbacks for testnet failures

## 🔗 Additional Resources

- [TLOCK-JS GitHub](https://github.com/drand/tlock-js)
- [Drand Network](https://drand.love/)
- [Age Encryption Format](https://age-encryption.org/v1/)

## 📝 License

This example code follows the same license as the main tlock-js project.

---

## 🎯 Summary

You now have:
- ✅ **Examples directory** with working JavaScript files
- ✅ **Simple usage example** for basic encryption needs
- ✅ **Comprehensive examples** for advanced use cases
- ✅ **CLI tool** for command-line encryption
- ✅ **STDOUT output** for piping and integration
- ✅ **TypeScript source files** for development
- ✅ **Full documentation** with troubleshooting guide
- ✅ **Working examples** that generate encrypted age files

## 📁 Directory Structure

```
examples/
├── simple-usage.js          # Simple JavaScript example (ready to run)
├── encrypt-arbitrary-text.js # Comprehensive JavaScript examples (ready to run)
├── cli-encrypt.js           # CLI tool with stdout support
├── simple-usage.ts          # TypeScript source for simple example
├── encrypt-arbitrary-text.ts # TypeScript source for comprehensive examples
└── README.md                # Detailed instructions and documentation
```

## 🚀 Quick Commands

```bash
# Compile the project
npm run compile

# Run examples
node examples/simple-usage.js
node examples/encrypt-arbitrary-text.js

# Use CLI tool
node examples/cli-encrypt.js "Your secret message" 11645812
node examples/cli-encrypt.js "Test" 20000 --testnet --verbose

# STDOUT and piping
node examples/cli-encrypt.js "Secret" 11645812 --stdout
node examples/cli-encrypt.js "Data" 11645812 --stdout --quiet > secret.age
```

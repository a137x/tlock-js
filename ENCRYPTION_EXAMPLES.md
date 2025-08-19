# TLOCK-JS: Encrypt Arbitrary Text Examples

This document provides comprehensive examples and instructions for encrypting arbitrary text using tlock-js timelock encryption.

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
   ```

## 📁 Available Examples

### 1. Simple Usage (`examples/simple-usage.js`)
Basic example showing the minimal code needed to encrypt text:
```javascript
const { timelockEncrypt, mainnetClient } = require('../dist/index.js');

const text = "Hello, this is my secret message!";
const round = 11645812;
const client = mainnetClient();

const encrypted = await timelockEncrypt(round, Buffer.from(text, 'utf8'), client);
```

### 2. Comprehensive Examples (`examples/encrypt-arbitrary-text.js`)
Full-featured examples including:
- Mainnet quicknet encryption
- Future round encryption
- Testnet encryption (when available)
- Custom text and round encryption
- Utility functions for validation and chain info

## 🔐 Core Function

### `encryptText(text, roundNumber, client)`

The main function for encrypting arbitrary text:

```javascript
async function encryptText(
    text,           // Your text to encrypt
    roundNumber,    // Target drand round
    client          // Drand network client
) {
    // Returns encrypted age file
}
```

**Parameters:**
- `text`: The text string you want to encrypt
- `roundNumber`: The drand round when decryption becomes possible
- `client`: Network client (use `mainnetClient()` for quicknet)

**Returns:**
- Encrypted age file content as a string

## 📚 Example Use Cases

### Example 1: Mainnet Quicknet
```javascript
const text = "This is a secret message for mainnet!";
const round = 11645812;
const client = mainnetClient();

const encrypted = await encryptText(text, round, client);
// Saves to: mainnet-round-11645812.age
```

### Example 2: Future Round
```javascript
const text = "This message will be decryptable much later!";
const round = 12000000; // Very future round
const client = mainnetClient();

const encrypted = await encryptText(text, round, client);
// Saves to: future-round-12000000.age
```

### Example 3: Custom Text and Round
```javascript
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

```javascript
const { timelockDecrypt, mainnetClient } = require('./dist/index.js');

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
- ✅ **TypeScript source files** for development
- ✅ **Full documentation** with troubleshooting guide
- ✅ **Working examples** that generate encrypted age files

## 📁 Directory Structure

```
examples/
├── simple-usage.js          # Simple JavaScript example (ready to run)
├── encrypt-arbitrary-text.js # Comprehensive JavaScript examples (ready to run)
├── simple-usage.ts          # TypeScript source for simple example
├── encrypt-arbitrary-text.ts # TypeScript source for comprehensive examples
└── README.md                # Detailed instructions and documentation
```

To get started, simply run:
```bash
npm run compile
node examples/simple-usage.js
```

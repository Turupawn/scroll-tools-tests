# Scroll Privy API Integration

This package provides a simple integration with Privy's REST API for creating wallets, signing messages, and sending transactions on Scroll Sepolia.

## Features

- 🔧 **Wallet Creation**: Create new Ethereum wallets via Privy API
- ✍️ **Message Signing**: Sign messages with created wallets
- 📤 **Transaction Sending**: Send transactions on Scroll Sepolia
- 🧪 **Comprehensive Testing**: Jest-based test suite with proper error handling

## Prerequisites

1. **Privy Account**: You need a Privy account and app setup
2. **Environment Variables**: Set up your Privy credentials
3. **Node.js**: Version 18+ recommended

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root with your Privy credentials:

```env
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

You can find these credentials in your Privy Dashboard under **App settings > Basics**.

### 3. Fund Your Wallet

For testing transactions, you'll need to fund your wallet with Scroll Sepolia ETH:
- Use a Scroll Sepolia faucet
- Send ETH to the wallet address returned by the script

## Usage

### Running the Main Script

```bash
npm start
```

This will:
1. Create a new Privy wallet
2. Sign a test message
3. Send a small transaction (0.001 ETH) to a test address

### Running Tests

```bash
npm test
```

The test suite includes:
- Environment variable validation
- Wallet creation verification
- Message signing verification
- Transaction execution (with proper error handling for insufficient funds)

## API Reference

### PrivyClient Class

#### `createWallet(): Promise<PrivyWallet>`
Creates a new Ethereum wallet via Privy API.

#### `signMessage(walletId: string, message: string): Promise<string>`
Signs a message with the specified wallet.

#### `sendTransaction(walletId: string, to: string, value: string, chainId?: string): Promise<PrivyTransactionResponse>`
Sends a transaction to the specified address.

## Error Handling

The integration includes comprehensive error handling for:
- Missing environment variables
- API authentication failures
- Insufficient funds for transactions
- Network connectivity issues

## Testing

The test suite is designed to handle various scenarios:
- ✅ Successful wallet creation and transaction
- ⚠️ Insufficient funds (expected for test accounts)
- ❌ Authentication failures
- ❌ Network errors

## Chain Configuration

Currently configured for:
- **Network**: Scroll Sepolia
- **Chain ID**: 534351
- **RPC URL**: https://sepolia-rpc.scroll.io

## Development

### Scripts

- `npm start` - Run the main script
- `npm run dev` - Run with file watching
- `npm test` - Run the test suite

### Project Structure

```
privy/
├── index.ts              # Main Privy client and script
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest test configuration
├── tests/
│   ├── setup.ts          # Test setup and environment validation
│   └── simple.test.ts    # Main test suite
└── README.md             # This file
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure `PRIVY_APP_ID` and `PRIVY_APP_SECRET` are set
   - Check your Privy Dashboard for correct credentials

2. **Insufficient Funds**
   - Fund your wallet with Scroll Sepolia ETH
   - Use a Scroll Sepolia faucet

3. **Authentication Errors**
   - Verify your Privy app ID and secret
   - Check that your Privy app is properly configured

4. **Network Issues**
   - Ensure you have internet connectivity
   - Check that Scroll Sepolia RPC is accessible

## License

MIT

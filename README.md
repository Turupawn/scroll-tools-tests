# Scroll Dev Tools

Unit tests and code snippets for building on Scroll. This repo contains working examples of DeFi protocols and infrastructure services specifically configured for Scroll Sepolia.

## Smart Contracts

| Project      | What It Does                           | Demo | Docs | Test |
|----------------|--------------------------------------------|--------|--------|---------|
| **Chainlink**   | Decentralized oracle for external data    | [Fetch pricefeeds](https://github.com/Turupawn/scroll-tools-tests/blob/master/src/Chainlink.sol) | [Learn more](https://docs.chain.link/data-feeds/price-feeds/addresses?page=1&testnetPage=1&network=scroll) | [Run](https://github.com/Turupawn/scroll-tools-tests/blob/master/test/Chainlink.t.sol)
| **Aave**        | Lending and borrowing protocol            | [Earn by lending Stablecoins](https://github.com/Turupawn/scroll-tools-tests/blob/master/src/Aave.sol) | [Learn more](https://aave.com/docs) | [Run](https://github.com/Turupawn/scroll-tools-tests/blob/master/test/Aave.t.sol)
| **EAS**         | On-chain attestation system               | [Send an attestation](https://github.com/Turupawn/scroll-tools-tests/blob/master/src/EAS.sol)| [Learn more](https://easscan.org/docs) | [Run](https://github.com/Turupawn/scroll-tools-tests/blob/master/test/EAS.t.sol)
| **Uniswap V3**  | Decentralized token exchange              | [Swap through the V3 Router](https://github.com/Turupawn/scroll-tools-tests/blob/master/src/UniV3.sol) | [Learn more](https://docs.uniswap.org/contracts/v3/overview) | [Run](https://github.com/Turupawn/scroll-tools-tests/blob/master/test/UniV3.t.sol)

## Infrastructure Services

| Project      | What It Does                                | Demo | Docs | Test |
|----------------|--------------------------------------------------|--------|--------|---------|
| **Pimlico**     | Paymaster & bundler for AA transactions         | [Send gassless transactions](https://github.com/Turupawn/scroll-tools-tests/blob/master/apis/pimlico/index.ts) | [Learn more](https://docs.pimlico.io/) | [![Test Pimlico API Integration](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-pimlico-api.yml/badge.svg)](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-pimlico-api.yml)
| **Privy**       | Embedded wallet service | [Send transactions from embeded wallet](https://github.com/Turupawn/scroll-tools-tests/blob/master/apis/privy/index.ts) | [Learn more](https://docs.privy.io/) | [![Test Privy API Integration](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-privy-api.yml/badge.svg)](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-privy-api.yml)
| **Alchemy**     | RPC provider for Scroll                        | [Send RPC calls](https://github.com/Turupawn/scroll-tools-tests/blob/master/apis/alchemy/index.ts) | [Learn more](https://docs.alchemy.com/) | [![Test Alchemy API Integration](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-alchemy-api.yml/badge.svg)](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-alchemy-api.yml)
| **ScrollScan**  | Block explorer API                            | [Query indexed on-chain state](https://github.com/Turupawn/scroll-tools-tests/blob/master/apis/scrollscan/index.ts) | [Learn more](https://scrollscan.com/) | [![Test ScrollScan API Integration](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-scrollscan-api.yml/badge.svg)](https://github.com/Turupawn/scroll-tools-tests/actions/workflows/test-scrollscan-api.yml)

## Usage

### Smart Contracts
```bash
# Run tests
forge test
```

### Services
```bash
# Navigate to specific service
cd apis/pimlico

# Install dependencies
npm install

# Set up environment
cp .env_example .env
# Add your API keys

# Run tests
npm test
```
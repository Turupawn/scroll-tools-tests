# Scroll Dev Tools

**A collection of tests for Scroll ecosystem contracts to verify they are live and accessible for developers.**

This repository contains lightweight tests that verify various contracts deployed on the Scroll network are functioning correctly. These tests help developers quickly check if the infrastructure they need is available and working.

## Available Tests

- **EAS (Ethereum Attestation Service)**: Tests EAS contract deployment and accessibility on Scroll Sepolia
- **Chainlink Price Feeds**: Tests Chainlink price feed data retrieval on Scroll Sepolia
- **Aave Protocol**: Tests Aave lending protocol integration on Scroll Sepolia
- **Uniswap V3**: Tests Uniswap V3 DEX router accessibility on Scroll Sepolia
- More tests coming soon...

## Quick Start

### Run All Tests
```bash
forge test -vv
```

### Run Specific Test
```bash
forge test --match-contract EASTest -vv
```

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

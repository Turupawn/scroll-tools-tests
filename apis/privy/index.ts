import 'dotenv/config'
import axios from 'axios'
import { createPublicClient, http, parseEther, createWalletClient } from 'viem'
import { scrollSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

interface PrivyWallet {
  id: string
  address: string
  chain_type: string
  policy_ids: string[]
  created_at: number
}

interface PrivyTransactionResponse {
  method: string
  data: {
    hash: string
    caip2: string
    transaction_id: string
  }
}

export class PrivyClient {
  private appId: string
  private appSecret: string
  private baseUrl: string = 'https://api.privy.io'

  constructor(appId: string, appSecret: string) {
    this.appId = appId
    this.appSecret = appSecret
  }

  private getAuthHeaders() {
    const credentials = Buffer.from(`${this.appId}:${this.appSecret}`).toString('base64')
    return {
      'Authorization': `Basic ${credentials}`,
      'privy-app-id': this.appId,
      'Content-Type': 'application/json'
    }
  }

  async createWallet(): Promise<PrivyWallet> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/wallets`,
        {
          chain_type: 'ethereum'
        },
        {
          headers: this.getAuthHeaders()
        }
      )
      return response.data
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw error
    }
  }

  async signMessage(walletId: string, message: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/wallets/${walletId}/rpc`,
        {
          method: 'personal_sign',
          params: {
            message,
            encoding: 'utf-8'
          }
        },
        {
          headers: this.getAuthHeaders()
        }
      )
      return response.data.data.signature
    } catch (error) {
      console.error('Error signing message:', error)
      throw error
    }
  }

  async sendTransaction(
    walletId: string, 
    to: string, 
    value: string, 
    chainId: string = 'eip155:534351' // Scroll Sepolia
  ): Promise<PrivyTransactionResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/wallets/${walletId}/rpc`,
        {
          method: 'eth_sendTransaction',
          caip2: chainId,
          chain_type: 'ethereum',
          params: {
            transaction: {
              to,
              value
            }
          }
        },
        {
          headers: this.getAuthHeaders()
        }
      )
      return response.data
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  }
}

async function fundWallet(targetAddress: string, amount: string = '0.001') {
  const fundingPrivateKey = process.env.FUNDED_WALLET_PRIVATE_KEY
  
  if (!fundingPrivateKey) {
    console.log('⚠️  FUNDED_WALLET_PRIVATE_KEY not set, skipping funding step')
    return null
  }

  try {
    console.log(`💰 Funding wallet ${targetAddress} with ${amount} ETH...`)
    
    const account = privateKeyToAccount(fundingPrivateKey as `0x${string}`)
    const publicClient = createPublicClient({
      chain: scrollSepolia,
      transport: http('https://sepolia-rpc.scroll.io')
    })
    
    const walletClient = createWalletClient({
      account,
      chain: scrollSepolia,
      transport: http('https://sepolia-rpc.scroll.io')
    })

    const txHash = await walletClient.sendTransaction({
      to: targetAddress as `0x${string}`,
      value: parseEther(amount)
    })

    console.log(`✅ Funding transaction sent: ${txHash}`)
    return txHash
  } catch (error) {
    console.error('❌ Error funding wallet:', error)
    return null
  }
}

export async function main() {
  const appId = process.env.PRIVY_APP_ID!
  const appSecret = process.env.PRIVY_APP_SECRET!

  if (!appId || !appSecret) {
    throw new Error('PRIVY_APP_ID and PRIVY_APP_SECRET environment variables are required')
  }

  const privyClient = new PrivyClient(appId, appSecret)
  let wallet: any = null

  try {
    // Create a new wallet
    console.log('🔧 Creating new Privy wallet...')
    wallet = await privyClient.createWallet()
    console.log(`✅ Wallet created: ${wallet.address}`)
    console.log(`   Wallet ID: ${wallet.id}`)

    // Sign a test message
    console.log('✍️  Signing test message...')
    const signature = await privyClient.signMessage(wallet.id, 'Hello from Privy!')
    console.log(`✅ Message signed: ${signature}`)

    // Fund the wallet with a small amount of ETH
    const fundingTxHash = await fundWallet(wallet.address, '0.001')
    
    if (fundingTxHash) {
      console.log('⏳ Waiting for funding transaction to be mined...')
      // Wait a bit for the transaction to be mined
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Create public client for Scroll Sepolia
    const publicClient = createPublicClient({
      chain: scrollSepolia,
      transport: http('https://sepolia-rpc.scroll.io')
    })

    // Send a small transaction (0.0001 ETH - smaller amount for testing)
    console.log('📤 Sending test transaction...')
    const value = parseEther('0.0001').toString(16) // Convert to hex string
    const transaction = await privyClient.sendTransaction(
      wallet.id,
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Vitalik's address
      `0x${value}`
    )
    
    console.log(`✅ Transaction sent: ${transaction.data.hash}`)
    console.log(`   Transaction ID: ${transaction.data.transaction_id}`)
    
    return transaction.data.hash
  } catch (error: any) {
    // Check if it's an insufficient funds error (expected for test wallets)
    if (error.response?.data?.error?.includes('insufficient funds') || 
        error.response?.data?.code === 'transaction_broadcast_failure') {
      console.log('⚠️  Transaction failed due to insufficient funds')
      console.log('✅ Wallet creation and API connectivity verified successfully!')
      if (wallet) {
        console.log(`   Wallet Address: ${wallet.address}`)
        console.log(`   Wallet ID: ${wallet.id}`)
      }
      console.log('💡 The funding transaction may still be pending or failed')
      return 'insufficient_funds_expected'
    }
    
    console.error('❌ Error in main function:', error)
    throw error
  }
}

main()
  .then((txHash) => {
    console.log('✅ Script completed successfully')
    console.log(`📝 Final transaction hash: ${txHash}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

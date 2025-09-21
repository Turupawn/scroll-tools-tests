import 'dotenv/config'
import axios from 'axios'

export async function main() {
  const apiKey = process.env.ALCHEMY_API_KEY!

  if (!apiKey) {
    throw new Error('ALCHEMY_API_KEY environment variable is required')
  }

  try {
    console.log('🔧 Fetching current block from Scroll Sepolia...')
    
    const response = await axios.post(
      `https://scroll-sepolia.g.alchemy.com/v2/${apiKey}`,
      {
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.error) {
      throw new Error(`RPC Error: ${response.data.error.message}`)
    }

    const blockNumberHex = response.data.result
    const blockNumber = parseInt(blockNumberHex, 16)
    
    console.log(`✅ Current block number: ${blockNumber}`)
    console.log(`   Block number (hex): ${blockNumberHex}`)
    
    if (blockNumber === 0) {
      throw new Error('Block number is 0, which indicates an issue with the RPC connection')
    }
    
    console.log('✅ API connectivity verified successfully!')
    return blockNumber
    
  } catch (error: any) {
    console.error('❌ Error fetching block number:', error)
    throw error
  }
}

main()
  .then((blockNumber) => {
    console.log('✅ Script completed successfully')
    console.log(`📝 Final block number: ${blockNumber}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

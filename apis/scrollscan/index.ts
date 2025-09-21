import 'dotenv/config'
import axios from 'axios'

export async function main() {
  const apiKey = process.env.SCROLLSCAN_API_KEY!

  if (!apiKey) {
    throw new Error('SCROLLSCAN_API_KEY environment variable is required')
  }

  try {
    console.log('🔧 Fetching current block from Scroll Sepolia via ScrollScan...')
    
    const response = await axios.get(
      `https://api-sepolia.scrollscan.com/api?module=proxy&action=eth_blockNumber&apikey=${apiKey}`
    )

    if (response.data.error) {
      throw new Error(`API Error: ${response.data.error.message}`)
    }

    const blockNumberHex = response.data.result
    const blockNumber = parseInt(blockNumberHex, 16)
    
    console.log(`✅ Current block number: ${blockNumber}`)
    console.log(`   Block number (hex): ${blockNumberHex}`)
    
    if (blockNumber === 0) {
      throw new Error('Block number is 0, which indicates an issue with the API connection')
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

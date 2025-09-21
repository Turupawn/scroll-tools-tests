import 'dotenv/config'
import { createPublicClient, http } from 'viem'
import { scrollSepolia } from 'viem/chains'
import { toSimpleSmartAccount } from 'permissionless/accounts'
import { createSmartAccountClient } from 'permissionless'
import { createPimlicoClient } from 'permissionless/clients/pimlico'
import { privateKeyToAccount } from 'viem/accounts'

export async function main() {
  const apiKey = process.env.PIMLICO_API_KEY!
  const privateKey: `0x${string}` = process.env.FUNDED_WALLET_PRIVATE_KEY! as `0x${string}`

  const publicClient = createPublicClient({
    chain: scrollSepolia,
    transport: http('https://sepolia-rpc.scroll.io')
  })

  const pimlicoUrl = `https://api.pimlico.io/v2/${scrollSepolia.id}/rpc?apikey=${apiKey}`
  const pimlicoClient = createPimlicoClient({
    chain: scrollSepolia,
    transport: http(pimlicoUrl)
  })

  const account = await toSimpleSmartAccount({
    client: publicClient,
    owner: privateKeyToAccount(privateKey)
  })
  console.log(`Smart account address: ${account.address}`)

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: scrollSepolia,
    bundlerTransport: http(pimlicoUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () =>
        (await pimlicoClient.getUserOperationGasPrice()).fast
    }
  })

  const txHash = await smartAccountClient.sendTransaction({
    to: '0xb6f5414bab8d5ad8f33e37591c02f7284e974fcb',
    value: 0n,
    data: '0x1234'
  })
  console.log(`Transaction included: ${txHash}`)
  
  return txHash
}

main()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

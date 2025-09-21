import 'dotenv/config'

// Global test setup
beforeAll(() => {
  console.log('🔧 Setting up Privy API tests...')
  
  // Validate required environment variables
  const requiredEnvVars = ['PRIVY_APP_ID', 'PRIVY_APP_SECRET']
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`)
    console.warn('   Tests may fail without proper Privy credentials')
  } else {
    console.log('✅ All required environment variables are set')
  }
  
  console.log(`   - PRIVY_APP_ID: ${process.env.PRIVY_APP_ID ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - PRIVY_APP_SECRET: ${process.env.PRIVY_APP_SECRET ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - Node.js version: ${process.version}`)
  console.log(`   - Platform: ${process.platform}`)
})

afterAll(() => {
  console.log('🧹 Cleaning up after Privy API tests...')
})

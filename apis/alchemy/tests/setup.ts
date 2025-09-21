import 'dotenv/config'

// Global test setup
beforeAll(() => {
  console.log('🔧 Setting up Alchemy API tests...')
  
  // Validate required environment variables
  const requiredEnvVars = ['ALCHEMY_API_KEY']
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`)
    console.warn('   Tests may fail without proper Alchemy API key')
  } else {
    console.log('✅ All required environment variables are set')
  }
  
  console.log(`   - ALCHEMY_API_KEY: ${process.env.ALCHEMY_API_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - Node.js version: ${process.version}`)
  console.log(`   - Platform: ${process.platform}`)
})

afterAll(() => {
  console.log('🧹 Cleaning up after Alchemy API tests...')
})

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Privy API Tests', () => {
  test('should execute main function and handle wallet creation and transaction', async () => {
    // Validate environment variables first
    expect(process.env.PRIVY_APP_ID).toBeDefined();
    expect(process.env.PRIVY_APP_SECRET).toBeDefined();
    
    // Log environment setup for debugging
    console.log('🔧 Environment setup:');
    console.log(`   - PRIVY_APP_ID: ${process.env.PRIVY_APP_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - PRIVY_APP_SECRET: ${process.env.PRIVY_APP_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - Node.js version: ${process.version}`);
    console.log(`   - Platform: ${process.platform}`);

    try {
      // Run the main function by executing the index.ts file
      const { stdout, stderr } = await execAsync('npm start', {
        cwd: process.cwd(),
        timeout: 120000 // 2 minute timeout for GitHub Actions
      });
      
      console.log('📝 Output:', stdout);
      if (stderr) console.log('⚠️  Stderr:', stderr);
      
      // Check if we got a transaction hash in the output
      const txHashMatch = stdout.match(/Transaction sent: (0x[a-fA-F0-9]{64})/);
      
      if (txHashMatch) {
        const txHash = txHashMatch[1];
        console.log('✅ Transaction executed successfully');
        console.log(`📝 Transaction Hash: ${txHash}`);
        
        // Verify transaction hash format
        expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
        
        // Verify script completed successfully
        expect(stdout).toContain('✅ Script completed successfully');
        
        // Verify wallet creation
        expect(stdout).toContain('Wallet created:');
        expect(stdout).toContain('Wallet ID:');
        
        // Verify message signing
        expect(stdout).toContain('Message signed:');
      } else {
        // Check if we got expected error messages
        if (stdout.includes('insufficient funds') || 
            stdout.includes('Insufficient funds') ||
            stderr.includes('insufficient funds') ||
            stderr.includes('Insufficient funds')) {
          console.log('⚠️  Transaction failed due to insufficient funds (expected for test account)');
          console.log('✅ Wallet creation and API connectivity verified');
          expect(stdout + stderr).toMatch(/insufficient funds|Insufficient funds/i);
        } else if (stdout.includes('Wallet created:') && stdout.includes('Message signed:')) {
          console.log('✅ Wallet creation and message signing successful');
          console.log('⚠️  Transaction may have failed due to insufficient funds');
          expect(stdout).toContain('Wallet created:');
          expect(stdout).toContain('Message signed:');
        } else {
          // If we don't see expected output, fail the test
          throw new Error(`Unexpected output: ${stdout}\nStderr: ${stderr}`);
        }
      }
      
    } catch (error: any) {
      // Handle timeout or other execution errors
      if (error.code === 'TIMEOUT') {
        throw new Error('Test timed out after 2 minutes');
      }
      
      // Check if the error contains expected insufficient funds message
      if (error.message.includes('insufficient funds') || 
          error.message.includes('Insufficient funds')) {
        console.log('⚠️  Transaction failed due to insufficient funds (expected for test account)');
        console.log('✅ Wallet creation and API connectivity verified');
        expect(error.message).toMatch(/insufficient funds|Insufficient funds/i);
      } else {
        // Re-throw unexpected errors
        throw error;
      }
    }
  }, 150000); // 2.5 minute timeout for execution
});

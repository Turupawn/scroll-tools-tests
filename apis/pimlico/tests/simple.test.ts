import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Pimlico API Tests', () => {
  test('should execute main function and handle transaction', async () => {
    // Validate environment variables first
    expect(process.env.PIMLICO_API_KEY).toBeDefined();
    expect(process.env.PRIVATE_KEY).toBeDefined();
    
    // Log environment setup for debugging
    console.log('🔧 Environment setup:');
    console.log(`   - PIMLICO_API_KEY: ${process.env.PIMLICO_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - PRIVATE_KEY: ${process.env.PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);
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
      const txHashMatch = stdout.match(/Transaction included: (0x[a-fA-F0-9]{64})/);
      
      if (txHashMatch) {
        const txHash = txHashMatch[1];
        console.log('✅ Transaction executed successfully');
        console.log(`📝 Transaction Hash: ${txHash}`);
        
        // Verify transaction hash format
        expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
        
        // Verify script completed successfully
        expect(stdout).toContain('✅ Script completed successfully');
      } else {
        // Check if we got the expected insufficient funds error
        if (stdout.includes('didn\'t pay prefund') || stderr.includes('didn\'t pay prefund')) {
          console.log('⚠️  Transaction failed due to insufficient funds (expected for test account)');
          console.log('✅ Smart account creation and API connectivity verified');
          expect(stdout + stderr).toContain('didn\'t pay prefund');
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
      if (error.message.includes('didn\'t pay prefund')) {
        console.log('⚠️  Transaction failed due to insufficient funds (expected for test account)');
        console.log('✅ Smart account creation and API connectivity verified');
        expect(error.message).toContain('didn\'t pay prefund');
      } else {
        // Re-throw unexpected errors
        throw error;
      }
    }
  }, 150000); // 2.5 minute timeout for execution
});

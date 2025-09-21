import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('ScrollScan API Tests', () => {
  test('should execute main function and fetch current block number', async () => {
    // Validate environment variables first
    expect(process.env.SCROLLSCAN_API_KEY).toBeDefined();
    
    // Log environment setup for debugging
    console.log('🔧 Environment setup:');
    console.log(`   - SCROLLSCAN_API_KEY: ${process.env.SCROLLSCAN_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - Node.js version: ${process.version}`);
    console.log(`   - Platform: ${process.platform}`);

    try {
      // Run the main function by executing the index.ts file
      const { stdout, stderr } = await execAsync('npm start', {
        cwd: process.cwd(),
        timeout: 60000 // 1 minute timeout for GitHub Actions
      });
      
      console.log('📝 Output:', stdout);
      if (stderr) console.log('⚠️  Stderr:', stderr);
      
      // Check if we got a block number in the output
      const blockNumberMatch = stdout.match(/Current block number: (\d+)/);
      
      if (blockNumberMatch) {
        const blockNumber = parseInt(blockNumberMatch[1]);
        console.log('✅ Block number fetched successfully');
        console.log(`📝 Block Number: ${blockNumber}`);
        
        // Verify block number is not 0
        expect(blockNumber).toBeGreaterThan(0);
        
        // Verify script completed successfully
        expect(stdout).toContain('✅ Script completed successfully');
        expect(stdout).toContain('✅ API connectivity verified successfully!');
      } else {
        // If we don't see expected output, fail the test
        throw new Error(`Unexpected output: ${stdout}\nStderr: ${stderr}`);
      }
      
    } catch (error: any) {
      // Handle timeout or other execution errors
      if (error.code === 'TIMEOUT') {
        throw new Error('Test timed out after 1 minute');
      }
      
      // Re-throw unexpected errors
      throw error;
    }
  }, 90000); // 1.5 minute timeout for execution
});

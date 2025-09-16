// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {UniV3} from "../src/UniV3.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 wad) external;
}

contract UniV3Test is Test {
    UniV3 public uniV3;

    // UniV3 addresses on Scroll Sepolia
    address public constant UNIV3_ROUTER_ADDRESS = 0x17AFD0263D6909Ba1F9a8EAC697f76532365Fb95;
    address public constant TOKEN_IN = 0x5300000000000000000000000000000000000004;
    address public constant TOKEN_OUT = 0xD9692f1748aFEe00FACE2da35242417dd05a8615;

    // Test user
    address public constant TEST_USER = 0x1234567890123456789012345678901234567890;

    function setUp() public {
        // Fork Scroll Sepolia testnet
        uint256 forkId = vm.createFork("https://sepolia-rpc.scroll.io");
        vm.selectFork(forkId);

        // Deploy the UniV3 contract
        uniV3 = new UniV3();

        // Fund the test user with ETH for WETH deposit
        vm.deal(TEST_USER, 2 ether);
    }

    function test_UniV3Swap() public {
        // Set up swap parameters
        uint256 depositAmount = 100000000000000000; // 0.1 ETH
        uint256 amountInMax = 100000000000000000; // 0.1 ETH worth of WETH
        uint256 amountOut = 1000000000000000000; // 1 token
        uint24 fee = 3000; // 0.3% fee

        // Impersonate the test user
        vm.startPrank(TEST_USER);

        // Get initial balances
        uint256 initialWethBalance = IERC20(TOKEN_IN).balanceOf(TEST_USER);
        uint256 initialTokenOutBalance = IERC20(TOKEN_OUT).balanceOf(TEST_USER);

        // Deposit ETH to get WETH tokens
        IWETH(TOKEN_IN).deposit{value: depositAmount}();

        // Check WETH balance after deposit
        uint256 wethBalanceAfterDeposit = IERC20(TOKEN_IN).balanceOf(TEST_USER);
        assertTrue(wethBalanceAfterDeposit > initialWethBalance, "Should have WETH after deposit");

        // Approve the UniV3 contract to spend WETH tokens
        IERC20(TOKEN_IN).approve(address(uniV3), amountInMax);

        // Perform the swap
        uniV3.swap(TOKEN_IN, TOKEN_OUT, amountInMax, amountOut, fee);

        // Check final balances
        uint256 finalWethBalance = IERC20(TOKEN_IN).balanceOf(TEST_USER);
        uint256 finalTokenOutBalance = IERC20(TOKEN_OUT).balanceOf(TEST_USER);

        // Verify balances changed (swap occurred)
        assertTrue(finalWethBalance < wethBalanceAfterDeposit, "WETH balance should decrease after swap");
        assertTrue(finalTokenOutBalance > initialTokenOutBalance, "Token out balance should increase after swap");

        vm.stopPrank();
    }
}

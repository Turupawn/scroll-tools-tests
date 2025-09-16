// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Aave, IERC20} from "../src/Aave.sol";

interface IDaiMinter {
    function mint(address token, address to, uint256 amount) external;
}

contract AaveTest is Test {
    Aave public aave;

    // Aave addresses on Scroll Sepolia
    address public constant AAVE_POOL_ADDRESS = 0x48914C788295b5db23aF2b5F0B3BE775C4eA9440;
    address public constant DAI_ADDRESS = 0x7984E363c38b590bB4CA35aEd5133Ef2c6619C40;
    address public constant DAI_MINTER_ADDRESS = 0x2F826FD1a0071476330a58dD1A9B36bcF7da832d;

    function setUp() public {
        uint256 forkId = vm.createFork("https://sepolia-rpc.scroll.io");
        vm.selectFork(forkId);
        aave = new Aave(AAVE_POOL_ADDRESS, DAI_ADDRESS);
    }

    function test_StakeAndUnstake() public {
        IDaiMinter(DAI_MINTER_ADDRESS).mint(DAI_ADDRESS, address(this), 1 ether);
        uint256 initialDaiBalance = IERC20(DAI_ADDRESS).balanceOf(address(this));
        IERC20(DAI_ADDRESS).approve(address(aave), 1 ether);
        aave.stake(1 ether);

        vm.warp(block.timestamp + 365 days);

        uint256 aTokenBalance = IERC20(aave.ATOKEN_ADDRESS()).balanceOf(address(this));
        IERC20(aave.ATOKEN_ADDRESS()).approve(address(aave), aTokenBalance);
        aave.unstake(aTokenBalance);

        uint256 finalDaiBalance = IERC20(DAI_ADDRESS).balanceOf(address(this));
        assertTrue(finalDaiBalance > initialDaiBalance, "Balance should increase due to interest");
    }
}

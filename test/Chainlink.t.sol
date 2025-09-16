// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Test, console} from "forge-std/Test.sol";
import {Chainlink} from "../src/Chainlink.sol";

contract ChainlinkTest is Test {
    Chainlink public chainlink;

    // Chainlink price feed address on Scroll Sepolia
    address public constant PRICE_FEED_ADDRESS = 0x87dce67002e66C17BC0d723Fe20D736b80CAaFda;

    function setUp() public {
        uint256 forkId = vm.createFork("https://sepolia-rpc.scroll.io");
        vm.selectFork(forkId);
        chainlink = new Chainlink();
    }

    function test_GetChainlinkDataFeedLatestAnswer() public view {
        // Test calling the getChainlinkDataFeedLatestAnswer function
        int256 answer = chainlink.getChainlinkDataFeedLatestAnswer();

        // Verify we got a valid price (should be > 0 for most assets)
        assertTrue(answer > 0, "Should return a valid price from Chainlink feed");
        // console.log("Chainlink price feed answer:", answer);
    }
}

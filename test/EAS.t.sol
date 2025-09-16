// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {EAS} from "../src/EAS.sol";

contract EASTest is Test {
    EAS public eas;

    function setUp() public {
        // Fork Scroll Sepolia testnet
        uint256 forkId = vm.createFork("https://sepolia-rpc.scroll.io");
        vm.selectFork(forkId);

        // Deploy the EAS contract
        eas = new EAS();
    }

    function test_SendIsFriendCall() public {
        // Test calling the sendIsFriend function
        address testRecipient = address(0x1234);
        bool isFriend = true;

        // Fund the caller
        vm.deal(address(this), 1 ether);

        // Call the function
        bytes32 result = eas.sendIsFriend(testRecipient, isFriend);

        // Verify we got a result (attestation UID)
        assertTrue(result != bytes32(0), "Should return a valid attestation UID");
        // console.log("Attestation UID:", result);
    }
}

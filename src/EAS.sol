// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Constants
bytes32 constant EMPTY_UID = 0;
uint64 constant NO_EXPIRATION_TIME = 0;

// Structs
struct AttestationRequestData {
    address recipient; // The recipient of the attestation.
    uint64 expirationTime; // The time when the attestation expires (Unix timestamp).
    bool revocable; // Whether the attestation is revocable.
    bytes32 refUID; // The UID of the related attestation.
    bytes data; // Custom attestation data.
    uint256 value; // An explicit ETH amount to send to the resolver. This is important to prevent accidental user errors.
}

struct AttestationRequest {
    bytes32 schema; // The unique identifier of the schema.
    AttestationRequestData data; // The arguments of the attestation request.
}

// Interface
interface IEAS {
    function attest(AttestationRequest calldata request) external payable returns (bytes32);
}

contract EAS {
    address easAddress = 0xaEF4103A04090071165F78D45D83A0C0782c2B2a;
    bytes32 schema = 0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a;

    // check at https://scroll-sepolia.easscan.org/schema/view/0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a

    function sendIsFriend(address to, bool isFriend) public returns (bytes32) {
        return IEAS(easAddress).attest(
            AttestationRequest({
                schema: schema,
                data: AttestationRequestData({
                    recipient: to,
                    expirationTime: NO_EXPIRATION_TIME,
                    revocable: false,
                    refUID: EMPTY_UID,
                    data: abi.encode(isFriend),
                    value: 0 // No value/ETH
                })
            })
        );
    }
}

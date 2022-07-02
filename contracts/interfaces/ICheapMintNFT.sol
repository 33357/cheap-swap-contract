// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapMintNFT {
    /* ==================== VIEW FUNCTIONS =================== */

    function calculateAddr(bytes32 salt) external view returns (address);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint() external payable;

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

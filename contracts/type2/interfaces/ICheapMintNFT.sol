// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapMintNFT {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint() external;

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

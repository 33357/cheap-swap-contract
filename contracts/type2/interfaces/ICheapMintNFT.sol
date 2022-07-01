// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapMintNFT {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint(bytes calldata mintNFTData) external;
}

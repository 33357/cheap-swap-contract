// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapMintNFT {
    /* ================ EVENTS ================ */

    event MintNFTCreated(address indexed owner, address mintNFTContract);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint(bytes calldata mintNFTData) external;

    function getNFTFromContractList(
        address target,
        address[] calldata contractList,
        uint256[] calldata tokenId
    ) external;

    function getNFTFromTokenIdList(
        address target,
        address contractAddress,
        uint256[] calldata tokenId
    ) external;
}

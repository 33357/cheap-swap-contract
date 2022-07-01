//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT_TEST is ERC721 {
    uint256 public nextTokenId;

    constructor() ERC721("ERC721_TEST", "ERC721") {}

    function mint() external {
        _mint(msg.sender, nextTokenId);
        nextTokenId++;
    }
}

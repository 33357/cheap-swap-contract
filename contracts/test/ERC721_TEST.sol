//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721_TEST is ERC721 {
    uint256 public nextTokenId;
    uint256 public price = 100;

    constructor() ERC721("ERC721_TEST", "ERC721") {}

    function mint(uint256 quality) external {
        for (uint256 i = 0; i < quality; i++) {
            _mint(msg.sender, nextTokenId);
            nextTokenId++;
        }
    }

    function safeMint(uint256 quality) external {
        for (uint256 i = 0; i < quality; i++) {
            _safeMint(msg.sender, nextTokenId);
            nextTokenId++;
        }
    }

    function priceMint(uint256 quality) external payable {
        require(msg.value >= price * quality, "ERC721_TEST: error value");
        for (uint256 i = 0; i < quality; i++) {
            _safeMint(msg.sender, nextTokenId);
            nextTokenId++;
        }
    }
}

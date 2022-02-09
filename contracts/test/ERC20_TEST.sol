//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20_TEST is ERC20 {
    constructor() ERC20("ERC20_TEST", "T20") {
        super._mint(msg.sender, 10**8 * 10**18);
    }
}

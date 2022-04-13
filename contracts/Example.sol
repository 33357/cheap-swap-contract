//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/IExample.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Example is IExample {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    constructor() {}

    /* ================ UTIL FUNCTIONS ================ */

    /* ================ VIEW FUNCTIONS ================ */

    function viewIt() external pure override returns (uint256) {
        return 1;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function transaction() external override {}

    /* ================ ADMIN FUNCTIONS ================ */
}

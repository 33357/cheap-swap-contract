// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapFactory2 {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAddress(
        address target,
        uint256[] calldata valueList,
        bytes[] calldata dataList
    ) external;

    /* ================ ADMIN FUNCTIONS ================ */

    function getFee(address to) external;

    function setFee(uint256 _fee) external;
}

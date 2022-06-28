// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapFactory {
    /* ================ ADMIN FUNCTIONS ================ */

    function call(
        address _target,
        uint256 _value,
        bytes calldata _data
    ) external payable;

    function setData(uint256 _value, bytes calldata _data) external;
}

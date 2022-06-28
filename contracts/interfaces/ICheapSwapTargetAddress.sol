// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapFactory {
    /* ================ ADMIN FUNCTIONS ================ */

    function call(
        address _target,
        bytes calldata _data
    ) external payable;

    function setData(bytes calldata _data) external;
}

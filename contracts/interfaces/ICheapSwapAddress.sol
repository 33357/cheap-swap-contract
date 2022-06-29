// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapAddress {
    /* ================ ADMIN FUNCTIONS ================ */

    function callData(address _target, bytes calldata data) external payable;

    function callDataList(
        address[] calldata targetList,
        uint256[] calldata valueList,
        bytes[] calldata dataList
    ) external payable;

    function setData(uint256 value, bytes calldata data) external;

    function setDataList(uint256[] calldata valueList, bytes[] calldata dataList) external;
}

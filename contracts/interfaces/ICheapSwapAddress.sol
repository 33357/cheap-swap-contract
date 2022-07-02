// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapAddress {
    /* ==================== EVENTS =================== */

    event SetApprove(address indexed sender, bool isApprove);

    event SetTargetValueData(uint256 indexed value, bytes targetValueData);

    event SetPause(bool isPause);

    /* ==================== VIEW FUNCTIONS =================== */

    function owner() external view returns (address);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function doReceive() external payable;

    function call(address target, bytes calldata data) external payable;

    /* ===================== ADMIN FUNCTIONS ==================== */

    function setApprove(address sender, bool isApprove) external;

    function setPause(bool isPause) external;

    function setTargetValueData(uint256 value, bytes calldata targetValueData) external;

    function setTargetValueDataList(uint256[] calldata valueList, bytes[] calldata targetValueDataList) external;
}

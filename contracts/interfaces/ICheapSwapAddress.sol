// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapAddress {
    /* ==================== EVENTS =================== */

    event SetApprove(address indexed sender, bool isApprove);

    event SetTargetData(uint256 indexed value, bytes targetData);

    event SetPause(bool isPause);

    /* ==================== VIEW FUNCTIONS =================== */

    function owner() external view returns (address);

    function getTargetData(bytes memory targetData, uint256 msgValue)
        external
        pure
        returns (
            uint8 runTime,
            uint8 maxRunTime,
            uint40 deadline,
            address target,
            uint80 value,
            bytes memory data
        );

    /* ================ TRANSACTION FUNCTIONS ================ */

    function doReceive() external payable;

    function call(address target, bytes calldata data) external payable;

    /* ===================== ADMIN FUNCTIONS ==================== */

    function setApprove(address sender, bool isApprove) external;

    function setPause(bool isPause) external;

    function setTargetData(
        uint256 msgValue,
        uint8 maxRunTime,
        uint40 deadline,
        address target,
        uint80 value,
        bytes calldata data
    ) external;
}

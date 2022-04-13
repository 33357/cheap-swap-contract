// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IExampleUpgradeable {
    /* ================ EVENTS ================ */

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function transaction() external;

    /* ================ ADMIN FUNCTIONS ================ */

    function pause() external;

    function unpause() external;

    function transferAnyERC20Token(
        address token,
        address to,
        uint256 amount
    ) external;
}

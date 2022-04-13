// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IExample {
    /* ================ EVENTS ================ */

    /* ================ VIEW FUNCTIONS ================ */

    function viewIt() external pure returns (uint256);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function transaction() external;

    /* ================ ADMIN FUNCTIONS ================ */
}

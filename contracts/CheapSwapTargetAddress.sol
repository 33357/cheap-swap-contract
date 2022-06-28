//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/ICheapSwapFactory.sol";

contract CheapSwapTargetAddress {
    address public owner;
    address public target;
    bytes public data;

    constructor(
        address _owner,
        address _target,
        bytes memory _data
    ) {
        owner = _owner;
        target = _target;
        data = _data;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        (bool success, ) = target.call{value: msg.value}(data);
        require(success, "CheapSwapTargetAddress: call error");
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function call(
        address _target,
        bytes calldata _data
    ) external payable {
        require(msg.sender == owner, "CheapSwapTargetAddress: not owner");
        (bool success, ) = _target.call{value: msg.value}(_data);
        require(success, "CheapSwapTargetAddress: call error");
    }

    function setData(bytes calldata _data) external {
        require(msg.sender == owner, "CheapSwapTargetAddress: not owner");
        data = _data;
    }
}

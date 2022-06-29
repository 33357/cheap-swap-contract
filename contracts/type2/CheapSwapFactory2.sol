//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICheapSwapFactory2.sol";
import "./CheapSwapAddress.sol";

contract CheapSwapFactory2 is ICheapSwapFactory2, Ownable {
    mapping(address => mapping(address => address)) public addressMap;
    uint256 public fee = 0.001 ether;
    address public feeAddress;

    constructor() {
        feeAddress = msg.sender;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAddress(
        address target,
        uint256[] calldata valueList,
        bytes[] calldata dataList
    ) external {
        CheapSwapAddress cheapSwapAddress = new CheapSwapAddress(msg.sender, target, valueList, dataList);
        addressMap[msg.sender][target] = address(cheapSwapAddress);
    }

    /* =================== ADMIN FUNCTIONS =================== */

    function setFeeAddress(address _feeAddress) external onlyOwner {
        feeAddress = _feeAddress;
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }
}

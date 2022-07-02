//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICheapSwapFactory.sol";
import "./CheapSwapAddress.sol";

contract CheapSwapFactory is ICheapSwapFactory, Ownable {
    mapping(address => address) public addressMap;
    uint256 public fee = 0.001 ether;
    address public feeAddress;

    constructor() {
        feeAddress = msg.sender;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAddress() external {
        addressMap[msg.sender] = address(new CheapSwapAddress(msg.sender));
        emit CreateAddress(msg.sender, addressMap[msg.sender]);
    }

    /* =================== ADMIN FUNCTIONS =================== */

    function setFeeAddress(address _feeAddress) external onlyOwner {
        feeAddress = _feeAddress;
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }
}

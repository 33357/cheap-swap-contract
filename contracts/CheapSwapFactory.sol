//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICheapSwapFactory.sol";
import "./CheapSwapAddress.sol";

contract CheapSwapFactory is ICheapSwapFactory, Ownable {
    // 用户地址对应的 cheapSwapAddress 地址
    mapping(address => address) public addressMap;
    // 手续费
    uint256 public fee = 0.001 ether;
    // 手续费地址
    address public feeAddress;

    constructor() {
        // 手续费地址默认为 msg.sender
        feeAddress = msg.sender;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    // 创建 cheapSwapAddress
    function createAddress() external {
        addressMap[msg.sender] = address(new CheapSwapAddress(msg.sender));
        emit CreateAddress(msg.sender, addressMap[msg.sender]);
    }

    /* =================== ADMIN FUNCTIONS =================== */

    // 设置手续费地址
    function setFeeAddress(address _feeAddress) external onlyOwner {
        feeAddress = _feeAddress;
    }

    // 设置手续费
    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }
}

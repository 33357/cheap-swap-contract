//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CheapSwapAddress is ICheapSwapAddress {
    address public owner;
    address public target;
    ICheapSwapFactory2 public cheapSwapFactory;
    mapping(uint256 => bytes) public dataMap;
    mapping(address => mapping(address => uint256)) public tokenAllowance;

    constructor(
        address _owner,
        address _target,
        uint256[] memory valueList,
        bytes[] memory dataList
    ) {
        owner = _owner;
        target = _target;
        cheapSwapFactory = ICheapSwapFactory2(msg.sender);
        _setDataList(valueList, dataList);
    }

    /* ==================== UTIL FUNCTIONS =================== */

    modifier _onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function _setDataList(uint256[] memory valueList, bytes[] memory dataList) internal {
        require(valueList.length == dataList.length, "CheapSwapAddress: not equal length");
        uint256 length = valueList.length;
        for (uint256 i = 0; i < length; ++i) {
            dataMap[valueList[i]] = dataList[i];
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        require(dataMap[msg.value].length != 0, "CheapSwapAddress: empty data");
        uint256 fee = cheapSwapFactory.fee();
        require(msg.value >= fee, "CheapSwapAddress: insufficient value");
        payable(cheapSwapFactory.feeAddress()).transfer(fee);
        uint256 value = msg.value - fee;
        if (value > 0) {
            payable(owner).transfer(value);
        }
        (bool success, ) = target.call(dataMap[msg.value]);
        require(success, "CheapSwapAddress: call error");
    }

    function tokenTransferFrom(
        address token,
        address to,
        uint256 amount
    ) external {
        require(tokenAllowance[msg.sender][token] >= amount, "CheapSwapAddress: over allowance");
        tokenAllowance[msg.sender][token] -= amount;
        IERC20(token).transferFrom(owner, to, amount);
    }

    /* ==================== ADMIN FUNCTIONS ================== */

    function tokenApprove(
        address sender,
        address token,
        uint256 allowance
    ) external _onlyOwner {
        tokenAllowance[sender][token] = allowance;
    }

    function setData(uint256 value, bytes calldata data) external _onlyOwner {
        dataMap[value] = data;
    }

    function setDataList(uint256[] calldata valueList, bytes[] calldata dataList) external _onlyOwner {
        _setDataList(valueList, dataList);
    }
}

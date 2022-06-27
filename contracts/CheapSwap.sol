//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/ICheapSwap.sol";
import "./lib/ISwapRouter.sol";
import "./lib/IWETH.sol";

contract CheapSwap is ICheapSwap {
    address public recipient;
    ISwapRouter public Router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IWETH9 public WETH = IWETH9(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    bytes public path;
    uint256 public amountInOneETH_amountOutMin;
    address public feeAddress;
    uint256 public feePoint = 10;

    constructor(address _recipient) {
        recipient = _recipient;
        feeAddress = msg.sender;
    }

    /* ================ UTIL FUNCTIONS ================ */

    modifier _onlyRecipient() {
        require(msg.sender == recipient, "CheapSwap: not recipient");
        _;
    }

    /* ================ VIEW FUNCTIONS ================ */

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        uint256 fee = msg.value * feePoint / 10000;
        payable(feeAddress).transfer(fee);
        uint256 amountIn = msg.value - fee;
        WETH.deposit{value: amountIn}();
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: recipient,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: (amountIn * amountInOneETH_amountOutMin) / 10**18
        });
        Router.exactInput(params);
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function setPath(bytes calldata _path) public override {
        path = _path;
    }

    function setAmountOutMin(uint256 _amountInOneETH_amountOutMin) public override {
        amountInOneETH_amountOutMin = _amountInOneETH_amountOutMin;
    }

    function setPathAndAmountOutMin(bytes calldata _path, uint256 _amountInOneETH_amountOutMin) external override {
        setPath(_path);
        setAmountOutMin(_amountInOneETH_amountOutMin);
    }
}

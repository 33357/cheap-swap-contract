//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ICheapSwapRouterV3.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./lib/ISwapRouter.sol";
import "./lib/IWETH.sol";
import "./lib/CheapSwapRouterV3BytesLib.sol";

contract CheapSwapRouterV3 is ICheapSwapRouterV3 {
    using CheapSwapRouterV3BytesLib for bytes;

    // uniswapV3 Router
    ISwapRouter public Router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    // WETH
    IWETH9 public WETH;

    constructor() {
        WETH = IWETH9(Router.WETH9());
        // WETH 授权给 Router
        IERC20(address(WETH)).approve(address(Router), type(uint256).max);
    }

    /* =================== UTIL FUNCTIONS =================== */

    function _preSwap(bool isPer, bool isInput)
        internal
        returns (
            address,
            address,
            uint120,
            uint120,
            bytes memory
        )
    {
        (uint80 callMsgValue, uint120 amountOut, uint120 amountIn, bytes memory path) = getSwapData(
            msg.data,
            msg.value
        );
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        address owner = cheapSwapAddress.owner();
        address tokenIn;
        // 获取卖出代币
        if (msg.value > 0) {
            WETH.deposit{value: amountIn}();
        } else {
            if (isInput) {
                tokenIn = path.toAddress(0);
            } else {
                tokenIn = path.toAddress(23);
            }
            if (isPer && amountIn == 0) {
                amountIn = uint120(IERC20(tokenIn).balanceOf(owner));
            }
            // 从 owner 获取数量为 amountIn 的 tokenIn
            cheapSwapAddress.call(
                callMsgValue,
                tokenIn,
                abi.encodeWithSignature("transferFrom(address,address,uint256)", owner, address(this), amountIn)
            );
            if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
                IERC20(tokenIn).approve(address(Router), type(uint256).max);
            }
        }
        return (owner, tokenIn, amountOut, amountIn, path);
    }

    /* =================== VIEW FUNCTIONS =================== */

    function getSwapData(bytes calldata msgData, uint256 msgValue)
        public
        pure
        override
        returns (
            uint80 callMsgValue,
            // 买入数量
            uint120 amountOut,
            // 卖出数量
            uint120 amountIn,
            // 交易路径
            bytes memory path
        )
    {
        callMsgValue = msgData.toUint80(4);
        amountOut = msgData.toUint120(14);
        if (msgValue > 0) {
            amountIn = uint120(msgValue);
            path = msgData.slice(29, msgData.length - 29);
        } else {
            amountIn = msgData.toUint120(29);
            path = msgData.slice(44, msgData.length - 44);
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput() external payable {
        (address owner, , uint120 amountOutMin, uint120 amountIn, bytes memory path) = _preSwap(false, true);
        // 执行 swap
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: owner,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin
        });
        Router.exactInput(params);
    }

    function exactPerAmountIn() external payable {
        (address owner, , uint120 amountOutMinPerAmountIn, uint120 amountIn, bytes memory path) = _preSwap(true, true);
        // 执行 swap
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: owner,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: (amountIn * amountOutMinPerAmountIn) / 10**18
        });
        Router.exactInput(params);
    }

    function exactOutput() external payable {
        (address owner, address tokenIn, uint120 amountOut, uint120 amountInMax, bytes memory path) = _preSwap(
            false,
            false
        );
        // 执行 swap
        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams({
            path: path,
            recipient: owner,
            deadline: block.timestamp,
            amountOut: amountOut,
            amountInMaximum: amountInMax
        });
        uint256 amountIn = Router.exactOutput(params);
        uint256 amount = amountInMax - amountIn;
        // 退回多余代币
        if (amount > 0) {
            if (msg.value > 0) {
                WETH.withdraw(amount);
                payable(owner).transfer(amount);
            } else {
                IERC20(tokenIn).transfer(owner, amount);
            }
        }
    }

    receive() external payable {
        require(msg.sender == address(WETH), "CheapSwapRouterV3: not WETH");
    }
}

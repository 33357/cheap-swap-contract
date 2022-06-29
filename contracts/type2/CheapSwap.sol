//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ICheapSwap.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "../lib/ISwapRouter.sol";
import "../lib/IWETH.sol";
import "../lib/Path.sol";

contract CheapSwap is ICheapSwap, Ownable {
    using Path for bytes;
    ISwapRouter public Router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IWETH9 public WETH = IWETH9(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    function amountIn_amountOutMin(
        bytes calldata path,
        uint256 amountIn,
        uint256 amountOutMin
    ) external {
        (, address tokenIn, ) = path.decodeFirstPool();
        if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
            IERC20(tokenIn).approve(address(Router), type(uint256).max);
        }
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        cheapSwapAddress.tokenTransferFrom(tokenIn, address(this), amountIn);
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: cheapSwapAddress.owner(),
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin
        });
        Router.exactInput(params);
    }

    function amountOut_amountInMax(
        bytes calldata path,
        uint256 amountOut,
        uint256 amountInMax
    ) external {
        (, address tokenIn, ) = path.decodeFirstPool();
        if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
            IERC20(tokenIn).approve(address(Router), type(uint256).max);
        }
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        cheapSwapAddress.tokenTransferFrom(tokenIn, address(this), amountInMax);
        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams({
            path: path,
            recipient: cheapSwapAddress.owner(),
            deadline: block.timestamp,
            amountOut: amountOut,
            amountInMaximum: amountInMax
        });
        uint256 amountIn = Router.exactOutput(params);
        uint256 amount = amountInMax - amountIn;
        if (amount > 0) {
            IERC20(tokenIn).transfer(cheapSwapAddress.owner(), amount);
        }
    }
}

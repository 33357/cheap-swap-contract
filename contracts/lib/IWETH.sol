//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

interface IWETH9 {
  function deposit() external payable;

  function withdraw(uint256) external;

  function balanceOf(address account) external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);
}
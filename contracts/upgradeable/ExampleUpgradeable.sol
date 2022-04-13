//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IExampleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract ExampleUpgradeable is IExampleUpgradeable, AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /* ================ UTIL FUNCTIONS ================ */

    modifier _onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ExampleUpgradeable: require admin permission");
        _;
    }

    function _authorizeUpgrade(address) internal view override _onlyAdmin {}

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() public pure override returns (string memory) {
        return "1.0.0";
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function transaction() external override {}

    /* ================ ADMIN FUNCTIONS ================ */

    function pause() external override _onlyAdmin {
        _pause();
    }

    function unpause() external override _onlyAdmin {
        _unpause();
    }

    function transferAnyERC20Token(
        address token,
        address to,
        uint256 amount
    ) external override _onlyAdmin {
        IERC20Upgradeable(token).safeTransfer(to, amount);
    }
}

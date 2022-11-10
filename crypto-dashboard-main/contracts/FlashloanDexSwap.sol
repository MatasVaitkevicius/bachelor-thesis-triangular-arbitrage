// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";
import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import { SafeMath } from "./Libraries.sol";
import "./Ownable.sol";
import "hardhat/console.sol";
import "./Uniswap.sol";

contract FlashloanDexSwap is FlashLoanReceiverBase, Ownable {
    ILendingPoolAddressesProvider internal provider;
    using SafeMath for uint256;
    address internal lendingPoolAddr;
    address internal router;
    address internal token2;
    address internal token3;
    uint256 internal minimumOutputAmount;

    constructor(ILendingPoolAddressesProvider _addressProvider) FlashLoanReceiverBase(_addressProvider) public
    {
        provider = _addressProvider;
        lendingPoolAddr = provider.getLendingPool();
    }

    function _flashloan(
        address[] memory _assets,
        uint256[] memory _amounts
    ) internal
    {
        address receiverAddress = address(this);
        address onBehalfOf = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        uint256[] memory modes = new uint256[](_assets.length);

        // 0 = no debt, 1 = stable, 2 = variable
        for (uint256 i = 0; i < _assets.length; i++) {
            modes[i] = 0;
        }

        _lendingPool.flashLoan(
            receiverAddress,
            _assets,
            _amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    function withdrawBalance() public onlyOwner
    {
        // Withdraw the contract's balance.
        msg.sender.transfer(address(this).balance);
    }

    function withdrawToken(address _token) public onlyOwner
    {
        // Withdraw token balance.
        IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this)));
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool)
    {
        // Fetch the contract's token 1 balance.
        uint256 token1BalanceWithLoan = IERC20(assets[0]).balanceOf(address(this));

        // Require that the contract's token 1 balance >= the amount to be swapped.
        require(token1BalanceWithLoan >= amounts[0], "Token 1 balance not >= amount to be swapped.");

        // Require router is approved to spend the token 1 amount to be swapped.
        require(IERC20(assets[0]).approve(router, amounts[0]), "Router not approved to spend the token 1 swap amount.");

        // Require router has sufficient allowance to spend the token 1 amount to be swapped.
        require(IERC20(assets[0]).allowance(address(this), router) >= amounts[0], "Router insufficient allowance for the token 1 swap amount.");

        // Create the router swap path.
        address[] memory path;
        path = new address[](4);
        path[0] = assets[0];
        path[1] = token2;
        path[2] = token3;
        path[3] = assets[0];

        // Run the router swap
        IUniswapV2Router(router).swapExactTokensForTokens(
            amounts[0],
            minimumOutputAmount,
            path,
            address(this),
            block.timestamp + 60
        );

        // Approve the LendingPool contract allowance to pull the owed amount.
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(_lendingPool), amountOwing);
        }

        return true;
    }

    // Public function to kick off the flashloan and swap process.
    function trade(
        address[] memory _assets,
        uint256 _inputAmount,
        uint256 _minimumOutputAmount,
        address _router,
        uint256 _feeAmount
    ) public onlyOwner
    {
        // Store the minimum output amount.
        minimumOutputAmount = _minimumOutputAmount;

        // Store the token 2 address.
        token2 = _assets[1];

        // Store the token 3 address.
        token3 = _assets[2];

        // Store the router address.
        router = _router;

        // Prepare the assets array for the flashloan function.
        address[] memory assets = new address[](1);
        assets[0] = _assets[0];

        // Prepare the amounts array for the flashloan function.
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _inputAmount;

        // If the contract has less token 1 than the input fee amount, receive the fee amount from the sender into the contract.
        if (IERC20(_assets[0]).balanceOf(address(this)) < _feeAmount) {
            IERC20 tokenContract = IERC20(assets[0]);
            tokenContract.transferFrom(msg.sender, address(this), _feeAmount);
        }

        // Run the flashloan function.
        _flashloan(assets, amounts);
    }
}

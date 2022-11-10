const Web3 = require('web3')
const web3 = new Web3('http://127.0.0.1:8545')

const quickSwapRouterAddress = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';
const sushiSwapRouterAddress = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506';

const accountAddress = '0x3C50Ecb35b70E9349988b8625012b1Bf573a8A3f'
const accountPrivateKey = '3ba0ca9744325f06150255a94a3d97ce982f3755762a16c3c11f95bb32533f30'

const flashloanDexSwapContractAddress = '0x8659DF1C638CDA8E475CD3C6481730C2b4f85873'
const flashloanDexSwapContractJson = require('../artifacts/contracts/FlashloanDexSwap.sol/FlashloanDexSwap.json')
const flashloanDexSwapContract = new web3.eth.Contract(flashloanDexSwapContractJson.abi, flashloanDexSwapContractAddress)

const inputAssetAddress = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' // DAI
const outputAssetAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' // WETH

// const erc20Abi = require('../json/erc20abi.json')
// const assetContract = new web3.eth.Contract(erc20Abi, inputAssetAddress)

web3.eth.handleRevert = true

// assetContract.methods.balanceOf(flashloanDexSwapContractAddress).call().then(response => {
//   console.log(response)
// })
//
// return



// const transferFromAccountAmount = web3.utils.toHex(5e18)
//
// const tx = {
//   from: accountAddress,
//   to: inputAssetAddress,
//   gasPrice: web3.utils.toHex(20 * 1e9),
//   gasLimit: web3.utils.toHex(210000),
//   value: 0x0,
//   data: assetContract.methods.transfer(flashloanDexSwapContractAddress, transferFromAccountAmount).encodeABI(),
// }
//
// web3.eth.accounts.signTransaction(tx, accountPrivateKey).then(signed => {
//   const transactionSent = web3.eth.sendSignedTransaction(signed.rawTransaction)
//
//   transactionSent.on('confirmation', (confirmation, receipt) => {
//     console.log('confirmation')
//     console.log(confirmation)
//   })
//
//   transactionSent.on('transactionHash', transactionHash => {
//     console.log('transactionHash')
//     console.log(transactionHash)
//   })
//
//   transactionSent.on('receipt', receipt => {
//     console.log('receipt')
//     console.log(receipt)
//   })
//
//   transactionSent.on('error', error => {
//     console.log('error')
//     console.log(error)
//   })
// })
//
// return


// flashloanDexSwapContract.methods.enableLog().send({
//   from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
// }).then(response => {
//   console.log(response)
// })
//
// return


// flashloanDexSwapContract.methods.getIsLogEnabled().call({
//   from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
// }).then(response => {
//   console.log(response)
// })


// flashloanDexSwapContract.methods.withdraw(inputAssetAddress, outputAssetAddress).send({
//   from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
// }).then(response => {
//   console.log(response)
// })
//
// return


// const borrowAssets = [inputAssetAddress, outputAssetAddress]
// const inputAmount = web3.utils.toBN('5000000000000000000000')
// const minimumOutputAmount = inputAmount.add(web3.utils.toBN('10000000000000000000'))
// const feeAmount = web3.utils.toHex(5e18)

// const routers = [quickSwapRouterAddress, sushiSwapRouterAddress]

// flashloanDexSwapContract.methods.trade(borrowAssets, inputAmount, minimumOutputAmount, routers, feeAmount).send({
//   from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
//   gasPrice: '90000000000',
// }).then(response => {
//   console.log(response)
// })

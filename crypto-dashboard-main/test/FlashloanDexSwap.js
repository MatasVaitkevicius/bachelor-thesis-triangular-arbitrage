const { expect } = require("chai");

describe("FlashloanDexSwap contract", function () {

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("FlashloanDexSwapToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should contract owner be equal to owner address", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should owner have balance of token", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens", async function () {
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender does not have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balance after transfer", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      await hardhatToken.transfer(addr1.address, 100);

      await hardhatToken.transfer(addr2.address, 50);

      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
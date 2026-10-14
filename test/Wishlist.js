const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Wishlist", function () {
  const GOAL = ethers.parseEther("1");

  async function deployFixture() {
    const [owner, funder, stranger] = await ethers.getSigners();
    const Wishlist = await ethers.getContractFactory("Wishlist");
    const wishlist = await Wishlist.deploy();
    return { wishlist, owner, funder, stranger };
  }

  async function deployWithWishFixture() {
    const fixture = await deployFixture();
    await fixture.wishlist.connect(fixture.owner).createWish("Bike", "A new bike", GOAL);
    return fixture;
  }

  describe("createWish", function () {
    it("stores the wish with msg.sender as owner and emits WishCreated", async function () {
      const { wishlist, owner } = await loadFixture(deployFixture);

      await expect(wishlist.createWish("Bike", "A new bike", GOAL))
        .to.emit(wishlist, "WishCreated")
        .withArgs(1, owner.address, "Bike", GOAL);

      const wish = await wishlist.wishes(1);
      expect(wish.id).to.equal(1);
      expect(wish.owner).to.equal(owner.address);
      expect(wish.goalAmount).to.equal(GOAL);
      expect(wish.currentAmount).to.equal(0);
      expect(wish.isClosed).to.equal(false);
      expect(await wishlist.wishCount()).to.equal(1);
    });

    it("rejects an empty title and a zero goal", async function () {
      const { wishlist } = await loadFixture(deployFixture);

      await expect(wishlist.createWish("", "desc", GOAL)).to.be.revertedWith("Title is required.");
      await expect(wishlist.createWish("Bike", "desc", 0)).to.be.revertedWith(
        "Goal amount must be greater than zero."
      );
    });
  });

  describe("fundWish", function () {
    it("accepts a donation and emits WishFunded with the funder", async function () {
      const { wishlist, funder } = await loadFixture(deployWithWishFixture);
      const amount = ethers.parseEther("0.4");

      await expect(wishlist.connect(funder).fundWish(1, { value: amount }))
        .to.emit(wishlist, "WishFunded")
        .withArgs(1, funder.address, amount);

      const wish = await wishlist.wishes(1);
      expect(wish.currentAmount).to.equal(amount);
      expect(wish.isClosed).to.equal(false);
      expect(await ethers.provider.getBalance(wishlist.target)).to.equal(amount);
    });

    it("closes the wish automatically when the goal is reached", async function () {
      const { wishlist, funder } = await loadFixture(deployWithWishFixture);

      await wishlist.connect(funder).fundWish(1, { value: ethers.parseEther("0.5") });
      await expect(wishlist.connect(funder).fundWish(1, { value: ethers.parseEther("0.5") }))
        .to.emit(wishlist, "WishClosed")
        .withArgs(1);

      expect((await wishlist.wishes(1)).isClosed).to.equal(true);
      await expect(
        wishlist.connect(funder).fundWish(1, { value: 1n })
      ).to.be.revertedWith("Wish is closed.");
    });

    it("rejects zero value and unknown wishes", async function () {
      const { wishlist, funder } = await loadFixture(deployWithWishFixture);

      await expect(wishlist.connect(funder).fundWish(1, { value: 0 })).to.be.revertedWith(
        "Must send Ether to fund the wish."
      );
      await expect(wishlist.connect(funder).fundWish(2, { value: 1n })).to.be.revertedWith(
        "Wish does not exist."
      );
    });
  });

  describe("closeWish", function () {
    it("lets the owner close the wish", async function () {
      const { wishlist, owner } = await loadFixture(deployWithWishFixture);

      await expect(wishlist.connect(owner).closeWish(1)).to.emit(wishlist, "WishClosed").withArgs(1);
      expect((await wishlist.wishes(1)).isClosed).to.equal(true);
    });

    it("does not let a stranger close someone else's wish", async function () {
      const { wishlist, stranger } = await loadFixture(deployWithWishFixture);

      await expect(wishlist.connect(stranger).closeWish(1)).to.be.revertedWith(
        "Only the wish owner can do this."
      );
    });
  });

  describe("withdrawWish", function () {
    it("sends exactly the wish's funds to its owner", async function () {
      const { wishlist, owner, funder, stranger } = await loadFixture(deployFixture);
      await wishlist.connect(owner).createWish("Bike", "A new bike", GOAL);
      await wishlist.connect(stranger).createWish("Book", "A book", GOAL);
      const forBike = ethers.parseEther("0.3");
      const forBook = ethers.parseEther("0.2");
      await wishlist.connect(funder).fundWish(1, { value: forBike });
      await wishlist.connect(funder).fundWish(2, { value: forBook });

      const tx = wishlist.connect(owner).withdrawWish(1);
      await expect(tx).to.emit(wishlist, "FundsWithdrawn").withArgs(1, owner.address, forBike);
      await expect(tx).to.changeEtherBalances([owner, wishlist], [forBike, -forBike]);

      // The other wish's money stays in the contract
      expect(await ethers.provider.getBalance(wishlist.target)).to.equal(forBook);
      const wish = await wishlist.wishes(1);
      expect(wish.isWithdrawn).to.equal(true);
      expect(wish.isClosed).to.equal(true);
    });

    it("does not let a stranger withdraw", async function () {
      const { wishlist, funder, stranger } = await loadFixture(deployWithWishFixture);
      await wishlist.connect(funder).fundWish(1, { value: ethers.parseEther("0.3") });

      await expect(wishlist.connect(stranger).withdrawWish(1)).to.be.revertedWith(
        "Only the wish owner can do this."
      );
    });

    it("forbids a second withdrawal", async function () {
      const { wishlist, owner, funder } = await loadFixture(deployWithWishFixture);
      await wishlist.connect(funder).fundWish(1, { value: GOAL });
      await wishlist.connect(owner).withdrawWish(1);

      await expect(wishlist.connect(owner).withdrawWish(1)).to.be.revertedWith(
        "Funds already withdrawn."
      );
    });

    it("rejects withdrawing when nothing was raised", async function () {
      const { wishlist, owner } = await loadFixture(deployWithWishFixture);

      await expect(wishlist.connect(owner).withdrawWish(1)).to.be.revertedWith("Nothing to withdraw.");
    });
  });

  describe("getWishes", function () {
    it("returns pages of wishes and handles out-of-range offsets", async function () {
      const { wishlist } = await loadFixture(deployFixture);
      for (const title of ["A", "B", "C"]) {
        await wishlist.createWish(title, "", GOAL);
      }

      const page = await wishlist.getWishes(1, 5);
      expect(page.map((w) => w.title)).to.deep.equal(["B", "C"]);
      expect(page[0].id).to.equal(2);
      expect(await wishlist.getWishes(3, 5)).to.have.length(0);
      expect(await wishlist.getWishes(0, ethers.MaxUint256)).to.have.length(3);
      expect(await wishlist.getAllWishes()).to.have.length(3);
    });
  });
});

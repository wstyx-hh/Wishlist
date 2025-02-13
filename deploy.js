async function main() {
    const deployer = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Deploying WishToken...");
    const Token = await hre.ethers.getContractFactory("WishToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    console.log("Token deployed to:", token.target);

    console.log("Deploying Wishlist...");
    const Wishlist = await hre.ethers.getContractFactory("Wishlist");
    const wishlist = await Wishlist.deploy(token.target);
    await wishlist.waitForDeployment();
    console.log("Wishlist deployed to:", wishlist.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
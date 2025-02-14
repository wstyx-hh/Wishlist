async function main() {
    const deployer = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Deploying Wishlist...");
    const Wishlist = await hre.ethers.getContractFactory("Wishlist");
    const wishlist = await Wishlist.deploy();
    await wishlist.waitForDeployment();
    console.log("Wishlist deployed to:", wishlist.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
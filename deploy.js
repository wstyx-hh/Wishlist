async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Wishlist = await hre.ethers.getContractFactory("Wishlist");
    const wishlist = await Wishlist.deploy();
    await wishlist.waitForDeployment(); // Используем этот метод вместо deployed()
    console.log("Wishlist contract deployed to:", await wishlist.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

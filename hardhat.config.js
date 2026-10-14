require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Private keys live in .env (see .env.example), never in the repo
const ganacheKeys = (process.env.GANACHE_PRIVATE_KEYS || "")
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // `npx hardhat node` — accounts are provided by the node itself
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    ganache: {
      url: process.env.GANACHE_URL || "http://127.0.0.1:7545",
      accounts: ganacheKeys,
      ens: { enabled: false },
    },
  },
};

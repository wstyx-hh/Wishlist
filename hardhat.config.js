require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", 
      accounts: [
        "0xe1f011c326335068ea9f990f90a4ec0b75f7fb3d9355baa1e8d63a52dcda5f51",
        "0xe9a6f541aeb78c4d317ed38fb4a2db2f1d4e603d142aa9f526f6dd5cde2dbbd5"
      ],
      ens: { enabled: false },
    },
  },
};

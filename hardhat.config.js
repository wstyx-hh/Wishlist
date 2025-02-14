require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", 
      accounts: [
        "0x87a952b9cd544b5852550bfef742a40435e241710edd8f7872a12ae98a542551",
        "0xe8116f078ef76b43b08c7cf6547ea4f4d750403fa978f2b4d4f9f1b4af27e716"
      ],
      ens: { enabled: false },
    },
  },
};

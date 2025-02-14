require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", 
      accounts: [
        "0x2c4cb6999c58da38197d0fc73bc7b1fe201c45f01c5661284b9a747595ee7f3b",
        "0x86b1d4ad1af34664bb13f17a618e3f3b565533f7c0493b23c87aac1b58db9690"
      ],
      ens: { enabled: false },
    },
  },
};

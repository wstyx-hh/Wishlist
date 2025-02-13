require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", 
      accounts: [
        "0x89f97f1f5f5c24d233154be24611eed23954d4800df47c18ee532ea12541de0c",
        "0x7e038203cb1de53fae6ae72a1e138cb1c4387a9e1c190bcbe8fc0c34065ab515"
      ],
      ens: { enabled: false },
    },
  },
};

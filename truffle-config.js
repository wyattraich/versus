module.exports = {
  networks: {
    development: {
      host: "ganache-cli", 
      port: 8545,
      network_id: "1337", 
    },
  },
  mocha: {
    // timeout: 100000
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  db: {
    enabled: false
  }
};
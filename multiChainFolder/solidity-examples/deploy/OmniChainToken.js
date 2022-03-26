const LZ_ENDPOINTS = require('../constants/layerzeroEndpoints.json')

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}` )

    // get the Endpoint address
    const endpointAddr = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint address: ${endpointAddr}`)

  const market = await deploy("NFTMarket",{
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
  });
  const nft = await deploy("NFT", {
        from: deployer,
        args: ["OmniChainToken", "MCT", endpointAddr, market.address],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["NFT","NFTMarket"]

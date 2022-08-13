import { constants, utils, Contract  } from "ethers"

import networkMappings from "../config/deployments.json"
import networksConfig from "../config/networks.json"
import abis from "../config/abis.json"
import explorerMappings from "../config/explorers.json"
import { PoolInfo } from "./pools"

export const PoolAddress = (chainId: number, poolId: string) => {

    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const isIndex = poolId.startsWith("index")
    const deployments = networkMappings as any
    return isIndex ? deployments[networkName]["indexes"][poolId]["pool"] :
                     deployments[networkName][poolId]["pool"]
}


export const PoolLPTokenAddress = (chainId: number, poolId: string) => {
    const isIndex = poolId.startsWith("index")

    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

    const deployments = networkMappings as any
    return isIndex ? deployments[networkName]["indexes"][poolId]["pool_lp"] :
                     deployments[networkName][poolId]["pool_lp"]
}


export const StrategyAddress = (chainId: number, poolId: string) => {
    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

    const deployments = networkMappings as any
    return deployments[networkName][poolId]["strategy"]
}


export const FeedAddress = (chainId: number, poolId: string) => {
    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

    const deployments = networkMappings as any
    return deployments[networkName][poolId]["price_feed"]
}


export const FarmAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const deployments = networkMappings as any

    return deployments[networkName]["hst_farm"]
}   

export const UsdcTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["usdc"]
}

export const DaiTokenAddress = (chainId: number) => {
     if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["dai"]
}


export const WbtcTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["wbtc"]
}

export const WethTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["weth"]
}

export const HSTTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
   const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]

   return networkMappings[networkName as keyof typeof networkMappings]["dai"]
}



export const NetworkExplorerHost = (chainId: number) => {
    if (!chainId) return ""
   const networkName = NetworkName(chainId)

   const explorers = explorerMappings as any
   return explorers[networkName]["host"]
}

export const NetworkExplorerName = (chainId: number) => {
    if (!chainId) return ""
   const networkName = NetworkName(chainId)

   const explorers = explorerMappings as any
   return explorers[networkName]["name"]
}

export const NetworkName = (chainId: number) => {
    if (!chainId) return ""
    return networksConfig[chainId.toString() as keyof typeof networksConfig]
}


// Contracts

export const PoolContract = (chainId: number, poolId: string) => {
    const isIndex = poolId.startsWith("index")
    const abi = isIndex ? abis[ "multipool" as keyof typeof abis ] as any :
                          abis[ "pool" as keyof typeof abis ] as any
    return new Contract( PoolAddress(chainId, poolId), new utils.Interface(abi))
}

export const PoolLPContract = (chainId: number, poolId: string) => {
    const abi = abis[ "pool_lp" as keyof typeof abis ] as any
    return new Contract(PoolLPTokenAddress(chainId, poolId), new utils.Interface(abi))
}

export const StrategyContract = (chainId: number, poolId: string) => {
    const strategies = abis[ "strategy" as keyof typeof abis ] as any
    const { strategy } = PoolInfo(chainId, poolId)
    const abi = strategies[strategy]
    return new Contract(StrategyAddress(chainId, poolId) , new utils.Interface(abi))
}

export const FeedContract = (chainId: number, poolId: string) => {
    const abi = abis[ "price_feed" as keyof typeof abis ] as any
    return new Contract(FeedAddress(chainId, poolId) , new utils.Interface(abi))
}

export const FarmContract = (chainId: number) => {
    const abi = abis[ "hst_farm" as keyof typeof abis ] as any
    return new Contract(FarmAddress(chainId) , new utils.Interface(abi))
}


// returns a map of { token_symbol => price_feed_contract }
export const FeedContractsForTokens = (chainId: number) : { [x: string]: Contract } => {

    if (!chainId) return {}

    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const abi = abis[ "price_feed" as keyof typeof abis ] as any
    const deployments = networkMappings as any
    const tokens = deployments[networkName as keyof typeof networkMappings]["tokens"]

    let contracts = {} as { [x: string]: Contract };
    Object.keys(tokens).forEach( symbol => {
        const feedAddress = tokens[symbol]["feed"]
        contracts[symbol.toLowerCase()] = new Contract(feedAddress , new utils.Interface(abi))
    })

    return contracts
}



export const UsdcContract = (chainId: number) => {
    const abi = abis[ "erc20" as keyof typeof abis ] as any
    return new Contract(UsdcTokenAddress(chainId) , new utils.Interface(abi))
}

export const DaiContract = (chainId: number) => {
    const abi = abis[ "erc20" as keyof typeof abis ] as any
    return new Contract(DaiTokenAddress(chainId), new utils.Interface(abi))
}

export const WethContract = (chainId: number) => {
    const abi = abis[ "erc20" as keyof typeof abis ] as any
    return new Contract(WethTokenAddress(chainId), new utils.Interface(abi))
}

export const WbtcContract = (chainId: number) => {
    const abi = abis[ "erc20" as keyof typeof abis ] as any
    return new Contract(WbtcTokenAddress(chainId), new utils.Interface(abi))
}

export const ERC20Contract = (chainId: number, poolId: string, symbol: string) => {

    switch (symbol.toLowerCase()) {
        case "usdc" : {
            return UsdcContract(chainId)
        }
        case "dai" : {
            return DaiContract(chainId)
        }
        case "weth": {
            return WethContract(chainId)
        }
        case "wbtc": {
            return WbtcContract(chainId)
        }
        case "pool-lp": {
            return PoolLPContract(chainId, poolId)
        }
    } 

    throw Error(`ERC20Contract not supported: ${symbol}`)
}


import { constants, utils, Contract  } from "ethers"

import networkMappings from "../chain-info/deployments.json"
import helperConfig from "../helper-config.json"
import abis from "../chain-info/abis.json"
import explorerMappings from "../chain-info/explorers.json"


export const PoolAddress = (chainId: number, poolId: string) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    const deployments = networkMappings as any
    return deployments[networkName][poolId]["pool"]
}

export const PoolLPTokenAddress = (chainId: number, poolId: string) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    const deployments = networkMappings as any
    return deployments[networkName][poolId]["pool_lp"]
}

export const StrategyAddress = (chainId: number, poolId: string) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    const deployments = networkMappings as any
    return deployments[networkName][poolId]["strategy"]
}

export const FeedAddress = (chainId: number, poolId: string) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    const deployments = networkMappings as any
    return deployments[networkName][poolId]["price_feed"]
}


export const UsdcTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["usdc"]

}

export const DaiTokenAddress = (chainId: number) => {
     if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["dai"]
}

export const WbtcTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["wbtc"]
}

export const WethTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["weth"]
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
    return helperConfig[chainId.toString() as keyof typeof helperConfig]
}


// Contracts

export const PoolContract = (chainId: number, poolId: string) => {
    const abi = abis[ "pool" as keyof typeof abis ]
    return new Contract( PoolAddress(chainId, poolId), new utils.Interface(abi))
}

export const PoolLPContract = (chainId: number, poolId: string) => {
    const abi = abis[ "pool_lp" as keyof typeof abis ]
    return new Contract(PoolLPTokenAddress(chainId, poolId) , new utils.Interface(abi))
}

export const StrategyContract = (chainId: number, poolId: string) => {
    const abi = abis[ "strategy" as keyof typeof abis ]
    return new Contract(StrategyAddress(chainId, poolId) , new utils.Interface(abi))
}

export const FeedContract = (chainId: number, poolId: string) => {
    const abi = abis[ "price_feed" as keyof typeof abis ]
    return new Contract(FeedAddress(chainId, poolId) , new utils.Interface(abi))
}

export const UsdcContract = (chainId: number) => {
    const abi = abis[ "usdc" as keyof typeof abis ]
    return new Contract(UsdcTokenAddress(chainId) , new utils.Interface(abi))
}

export const DaiContract = (chainId: number) => {
    const abi = abis[ "dai" as keyof typeof abis ]
    return new Contract(DaiTokenAddress(chainId), new utils.Interface(abi))
}

export const WethContract = (chainId: number) => {
    const abi = abis[ "weth" as keyof typeof abis ]
    return new Contract(WethTokenAddress(chainId), new utils.Interface(abi))
}

export const WbtcContract = (chainId: number) => {
    const abi = abis[ "wbtc" as keyof typeof abis ]
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

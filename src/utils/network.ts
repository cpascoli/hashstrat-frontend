import { constants, utils, Contract  } from "ethers"

import networkMappings from "../chain-info/deployments.json"
import helperConfig from "../helper-config.json"
import abis from "../chain-info/abis.json"
import explorerMappings from "../chain-info/explorers.json"

// Contracts Addresses

export const PoolAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["pool"]
}


export const PoolLPTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["pool_lp"]
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

export const WethTokenAddress = (chainId: number) => {
    if (!chainId) return constants.AddressZero
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]

    return networkMappings[networkName as keyof typeof networkMappings]["weth"]
}

export const NetworkExplorerHost = (chainId: number) => {
    if (!chainId) return ""
   const networkName = NetworkName(chainId)

   return explorerMappings[networkName as keyof typeof networkMappings]
}

export const NetworkName = (chainId: number) => {
    if (!chainId) return ""
    return helperConfig[chainId.toString() as keyof typeof helperConfig]
}


// Contracts

export const PoolContract = (chainId: number) => {
    const abi = abis[ "pool" as keyof typeof abis ]
    return new Contract( PoolAddress(chainId), new utils.Interface(abi))
}

export const PoolLPContract = (chainId: number) => {
    const abi = abis[ "pool_lp" as keyof typeof abis ]
    return new Contract(PoolLPTokenAddress(chainId) , new utils.Interface(abi))
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

export const ERC20Contract = (chainId: number, symbol: string) => {
    console.log("ERC20Contract symbol: ", symbol, "chainId", chainId)

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
        case "pool-lp": {
            return PoolLPContract(chainId)
        }
    } 

    throw Error(`ERC20Contract not supported: ${symbol}`)
}

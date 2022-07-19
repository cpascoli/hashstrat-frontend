

import poolsInfo from "../chain-info/pools.json"
import helperConfig from "../helper-config.json"

import { UsdcTokenAddress, DaiTokenAddress, WethTokenAddress, WbtcTokenAddress, PoolLPTokenAddress } from "./network"

import weth from "../components/img/weth.png"
import wbtc from "../components/img/wbtc.png"
import usdc from "../components/img/usdc.png"
import dai from "../components/img/dai.png"


export const PoolInfo = (chainId: number, poolId: string) => {
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]
 
    const infos = pools.filter( (pool: { poolId: string }) =>  { return (pool.poolId === poolId) })
    if (infos.length == 0) throw Error(`Pool ${poolId} not found on ${networkName} nework`)
    
    return infos[0]
}


export const TokensForPool = (chainId: number, poolId: string) => {
    const { depositToken : depositTokenSymbol, investToken : investTokenSymbol} = PoolInfo(chainId, poolId)

    return {
        depositToken: Tokens(chainId, poolId)[depositTokenSymbol.toLowerCase()],
        investToken : Tokens(chainId, poolId)[investTokenSymbol.toLowerCase()],
        lpToken : Tokens(chainId, poolId)["pool-lp"],
    }
}


export const Tokens = (chainId: number, poolId: string) => {
    return {
        "dai":  { address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18, image: dai},
        "usdc": { address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6, image: usdc},
        "wbtc": { address: WbtcTokenAddress(chainId), symbol: "WBTC", decimals: 8, image: wbtc},
        "weth": { address: WethTokenAddress(chainId), symbol: "WETH", decimals: 18, image: weth },
        "pool-lp": { address: PoolLPTokenAddress(chainId, poolId), symbol: "POOL-LP", decimals: 18 },
    } as any
}

export const DepositToken = (chainId: number) => {
    return  (chainId == 42) ?  { image: dai, address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18 } : 
            (chainId == 137) ? { image: usdc, address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6 } : undefined

}

export const PoolIds = (chainId: number) => {
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo] as any
    const poolIds = pools.map( (pool: { [x: string]: any }) => {
        return pool["poolId"]
    })


    console.log("poolIds", poolIds)
    return poolIds
}

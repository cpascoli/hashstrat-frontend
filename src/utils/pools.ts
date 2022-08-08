import poolsInfo from "../config/pools.json"
import indexesInfo from "../config/indexes.json"
import networksConfig from "../config/networks.json"

import { PoolAddress, PoolLPTokenAddress, UsdcTokenAddress, DaiTokenAddress, WethTokenAddress, WbtcTokenAddress } from "./network"

import weth from "../components/img/weth.png"
import wbtc from "../components/img/wbtc.png"
import usdc from "../components/img/usdc.png"
import dai from "../components/img/dai.png"
import poollp from "../components/img/pool_lp.png"

import { Token } from "../types/Token"

export const PoolInfo = (chainId: number, poolId: string) => {
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]
 
    const infos = pools.filter( (pool: { poolId: string }) =>  { return (pool.poolId === poolId) })
    if (infos.length === 0) throw Error(`Pool ${poolId} not found on ${networkName} nework`)
    
    return infos[0]
}

export const PoolsInfo = (chainId: number, poolIds: string[]) => {
   
    const poolsInfo = poolIds.map( poolId => {
        return {
            poolId,
            pool: PoolAddress(chainId, poolId),
            lptoken: PoolLPTokenAddress(chainId, poolId),
            depositToken: DepositToken(chainId)
        } 
    })

    return poolsInfo
}


export const IndexInfo = (chainId: number, poolId: string) => {
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const indexes = indexesInfo[networkName as keyof typeof indexesInfo]
 
    const infos = indexes.filter( (pool: { poolId: string }) =>  { return (pool.poolId === poolId) })
    if (infos.length === 0) throw Error(`Index ${poolId} not found on ${networkName} nework`)

    return infos[0]
}

export const IndexesInfo = (chainId: number, poolIds: string[]) => {
    const indexesInfo = poolIds.map( poolId => {
        return {
            poolId,
            pool: PoolAddress(chainId, poolId),
            lptoken: PoolLPTokenAddress(chainId, poolId),
            depositToken: DepositToken(chainId)
        } 
    })

    return indexesInfo
}


 



export const TokensForPool = (chainId: number, poolId: string) => {
    const { depositToken : depositTokenSymbol, investToken : investTokenSymbol} = PoolInfo(chainId, poolId)
    const tokens = Tokens(chainId, poolId)
    //console.log("TokensForPool", tokens, ">> ", typeof tokens)

    const depositToken : Token = tokens[depositTokenSymbol.toLowerCase() as keyof typeof tokens] as any 
    const investToken : Token = tokens[investTokenSymbol.toLowerCase() as keyof typeof tokens]! as any
    const lptoken : Token = tokens["pool-lp" as keyof typeof tokens]! as any
    return {
        depositToken: depositToken,
        investToken :investToken,
        lpToken :lptoken,
    }
}

export const TokensForIndex = (chainId: number, indexId: string) => {

    const { depositToken : depositTokenSymbol, investTokens : investTokenSymbols } = IndexInfo(chainId, indexId)
    const tokens = Tokens(chainId, indexId)
    const depositToken : Token =  tokens[depositTokenSymbol.toLowerCase() as keyof typeof tokens]! as any 
    const lptoken : Token = tokens["pool-lp" as keyof typeof tokens]! as any
    return {
        depositToken: depositToken,
        investTokens: investTokenSymbols.map( symbol => {
            const investToken : Token = tokens[symbol.toLowerCase() as keyof typeof tokens]! as any
            return investToken
        }),
        lpToken: lptoken,
    }
}


export const Tokens = (chainId: number, poolId: string) : Map<String, Token> => {
    const isIndex = poolId.startsWith("index")
    const { depositToken } = isIndex ? IndexInfo(chainId, poolId) : PoolInfo(chainId, poolId)

    const depositTokenDecimals = depositToken.toLowerCase() === 'dai' ? 18 :
                                 depositToken.toLowerCase() === 'usdc' ? 6 : 18
   
    return {
        "dai":  { address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18, image: dai},
        "usdc": { address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6, image: usdc},
        "wbtc": { address: WbtcTokenAddress(chainId), symbol: "WBTC", decimals: 8, image: wbtc},
        "weth": { address: WethTokenAddress(chainId), symbol: "WETH", decimals: 18, image: weth },
        "pool-lp": { address: PoolLPTokenAddress(chainId, poolId), symbol: "POOL-LP", decimals: depositTokenDecimals, image: poollp },
    } as any
}

export const DepositToken = (chainId: number) : (Token | undefined) => {
    return  (chainId === 42) ?  { image: dai, address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18 } : 
            (chainId === 137) ? { image: usdc, address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6 } : undefined

}

export const PoolIds = (chainId: number) : Array<string> => {
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo] as any
    const poolIds = pools.map( (pool: { [x: string]: any }) => {
        return pool["poolId"]
    })

    return poolIds
}

export const IndexesIds = (chainId: number) : string[] => {
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const indexes = indexesInfo[networkName as keyof typeof poolsInfo] as any
    const indexesIds = indexes.map( (index: { [x: string]: any }) => {
        return index["poolId"]
    })

    return indexesIds
}




//// TOKENS HELPERS
export const InvestTokens = (chainId: number) : Array<Token> =>  {

    const poolids = PoolIds(chainId) 
    let tokenSet = new Set<Token>();
    let tokenSymbols = new Set<string>();
    poolids.forEach(poolId => {
        const { investToken } = TokensForPool(chainId, poolId)
        if (investToken && !tokenSymbols.has(investToken["symbol"])) {
            tokenSymbols.add(investToken["symbol"])
            tokenSet.add(investToken)
        }
    });

    return Array.from(tokenSet.values())
}






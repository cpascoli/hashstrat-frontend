
import { useContractFunction, useCall, useCalls } from "@usedapp/core"
import { PoolContract } from "../utils/network"
import { PoolInfo } from "../utils/pools"
import { useLastPriceForTokens } from "./useFeed"
import { InvestTokens } from "../utils/pools"

// Actions

export const useDeposit = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { send: depositSend, state: depositState } = useContractFunction(indexContract, "deposit", { 
        transactionName: "Deposit Tokens"
    })

    const deposit = (amount: string | number) => {
        return depositSend(amount)
    }

    return { deposit, depositState }
}


export const useWithdraw = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { send: withdrawSend, state: withdrawState } = useContractFunction(indexContract, "withdrawLP", { 
        transactionName: "Withdraw Tokens"
    })

    const withdraw = (amount: string | number) => {
        return withdrawSend(amount)
    }

    return { withdraw, withdrawState }
}



// Account Stats
export const useGetDeposits = (chainId: number, poolId: string, account: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'deposits',
            args: [account],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}


export const useGetWithdrawals = (chainId: number, poolId: string, account: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'withdrawals',
            args: [account],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}



// Index Info

export const useMultiPoolValue = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: /v3.?$/.test(poolId) ? 'totalValue' : 'multiPoolValue',
            args: [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}



export const useTotalDeposited = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'totalDeposited',
            args: [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}

export const useTotalWithdrawn = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'totalWithdrawn',
            args: [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}


type PoolData = {
    name: string | undefined,
    poolAddress: string | undefined,
    lpTokenAddress: string | undefined,
    weight: number | undefined,
}

export const usePoolInfo = (chainId: number, poolId: string, index: number) : PoolData => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'pools',
            args: [index],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)

    return { 
        name:  value?.['name'],
        poolAddress:  value?.['poolAddress'],
        lpTokenAddress:  value?.['lpTokenAddress'],
        weight:  value?.['weight']
    }
}



export const usePoolInfoArray = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)

    const { value } = useCall({
        contract: poolContract,
        method: 'getPoolsInfo',
        args: [],
    }) ?? {}

    const info : PoolData[] | undefined = value?.[0].map( (data: any, idx: number) => {
        return {
            name:  data?.['name'],
            poolAddress:  data?.['poolAddress'],
            lpTokenAddress:  data?.['lpTokenAddress'],
            weight:  data?.['weight']
          }
    })
    return info
}




export type SwapInfo = {
    timestamp: string,
    side: string,
    feedPrice: string,
    bought:string,
    sold: string,
    depositTokenBalance: string,
    investTokenBalance: string,
}

export type PoolSwapInfo = {
    poolId: string, 
    weight: number, 
    swaps: SwapInfo[]
}


export const useSwapInfoForIndex = (chainId: number, indexId: string) : PoolSwapInfo[] | undefined => {

    const poolsInfo = usePoolInfoArray(chainId, indexId) ?? []

    // if (!poolsInfo || poolsInfo.length == 0) return 
    
    const pools = (poolsInfo.map( info => { 
        return {
            poolId: info.name?.toLowerCase(),
            poolAddress: info.poolAddress,
        }
    })?? [] ).filter( (item ) => item.poolId !== undefined && item.poolAddress !== undefined) as { poolId: string, poolAddress: string }[] 


    // Pools calls
    const calls = pools.map(req => ({
        contract: PoolContract(chainId, req.poolId ),
        method: 'getSwapsInfo',
        args: [],
    })) ?? []
    

    const results = useCalls(calls) ?? []

    // process the token balances results
    const swapsArray = poolsInfo?.map( (req, idx) => {
        const data = results.at(idx)?.value[0]
        if (!data ) return undefined

        const swaps = data.map( (item : any) => {
            return {
                timestamp: item['timestamp'].toString(),
                side: item['side'],
                feedPrice: item['feedPrice'].toString(),
                bought: item['bought'].toString(),
                sold: item['sold'].toString(),
                depositTokenBalance: item['depositTokenBalance'].toString(),
                investTokenBalance: item['investTokenBalance'].toString(),
            }
        }) as SwapInfo[]

        return {
            poolId: req.name?.toLowerCase(),
            weight: req.weight,
            swaps: swaps
        }

    }).filter( (item : any) => item !== undefined) as PoolSwapInfo[] ;


    return swapsArray
}


export const usePoolSwapsInfoForIndex = (chainId: number, indexId: string) => {

    // get swaps for all pools in the index
    const swapsInfo = useSwapInfoForIndex(chainId, indexId)

    // get latest token prices for all tokens
    const alltokens = InvestTokens(chainId).map( t => t.symbol.toLowerCase() )
    const tokenPrices = useLastPriceForTokens(chainId, alltokens)

    const swapsWithTokens = swapsInfo?.map( pool => {
        const { investTokens } = PoolInfo(chainId, pool.poolId)

        // filter prices only for tokens in the index
        const poolTokens = (investTokens as string[]).map( it => it.toLowerCase() )
        const priceInfo = tokenPrices.filter( item => poolTokens.includes(item.symbol.toLowerCase()) && item.price && item.price !== undefined)
        
       // console.log("usePoolSwapsInfoForIndex. pool: ", pool.poolId, "tokenPrices: ", tokenPrices, "filtered: ", prices, "indexTokens:",indexTokens)

        return {
            poolId: pool.poolId,
            weight: pool.weight,
            priceInfo: priceInfo && priceInfo.length > 0 ? priceInfo[0] : undefined ,
            swaps: pool.swaps
        }
    
    })

  
    return swapsWithTokens
}

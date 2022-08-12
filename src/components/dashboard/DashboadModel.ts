

import { useTokensInfoForPools, useTokensInfoForIndexes } from "../../hooks/usePoolInfo"
import { PoolIds, PoolInfo, IndexesIds } from "../../utils/pools"
import { Token } from "../../types/Token"
import { BigNumber } from "ethers"
import { fromDecimals } from "../../utils/formatter"

import { PieChartsData, ChartData } from "../shared/PieChartWithLabels"


type TokenBalances = {[ x: string] : { symbol: string, decimals: number, value: BigNumber, balance: BigNumber }}

type TokenInfo = {
    value: BigNumber,
    balance: BigNumber,
    accountValue: BigNumber,
    accountBalance: BigNumber
    decimals: number,
    symbol: string,
}
type PoolData =  { 
    poolId: string, 
    tokenInfoArray: TokenInfo[], 
    totalValue: BigNumber 
}

type PortfolioInfo = {
    totalValue: BigNumber,
    tokenBalances: TokenBalances
}

export type DashboadModel = {

    // poolsBalances: {[x: string] : any};
    // indexBalances: {[x: string] : any};
    portfolioInfo: PortfolioInfo,
    chartValueByAsset: ChartData,
    chartValueByPool: ChartData,
    poolsInfo: PoolData[],
    indexesInfo: PoolData[],
}



export const useDashboardModel = (chainId: number, tokens: Token[], depositToken: Token, account?: string) : DashboadModel => {

    //   combine pools and indexes stats and return aggeragated token amount & value totals 
    const poolsBalances = useTokensInfoForPools(chainId, PoolIds(chainId), tokens, account)
    const indexesBalances = useTokensInfoForIndexes(chainId, IndexesIds(chainId), tokens, account)


    //// Portfolio Info  =>  Balance and Value Total across all pools & indexes

    // Sum up balance and value across all pools 
    // if an account is connected use his balance and value, otherwise show the totals
    let initValues = tokens.reduce( (acc, val) => {
        acc[val.symbol] = { symbol: val.symbol, decimals: val.decimals, value: BigNumber.from(0), balance: BigNumber.from(0) }
        return acc
    }, {} as TokenBalances )

    // const allPools = [...Object.values(indexesBalances), ...Object.values(poolsBalances)]

    // If no account is provided, only return balances/values for Pools (not Indexes) 
    // because Indexes will hold their values in Pools
    const allPools = account? [...Object.values(indexesBalances), ...Object.values(poolsBalances)] :
                              [...Object.values(poolsBalances)]

    // Map of aggreagate balance and values, by token, in eveery pool
    const tokenBalances : TokenBalances = allPools.reduce( (totals, pool ) : TokenBalances => {

        Object.keys(pool).forEach( symbol => {
            const tokenInfo = pool[symbol] 
            if (tokenInfo.value) {
                totals[symbol].value = (account && tokenInfo.accountValue) ? totals[symbol].value.add(tokenInfo.accountValue) : 
                                       tokenInfo.value ? totals[symbol].value.add(tokenInfo.value) : totals[symbol].value
            }
            if (tokenInfo.balance) {
                totals[symbol].balance = (account && tokenInfo.accountBalance) ? totals[symbol].balance.add(tokenInfo.accountBalance) : 
                                         tokenInfo.balance ? totals[symbol].balance.add(tokenInfo.balance) : totals[symbol].balance
            }
        })
        return totals

    }, initValues )

    const totalValue: BigNumber = Object.values(tokenBalances).reduce( (total, token ) : BigNumber => {
        return total.add(token.value)
    }, BigNumber.from(0))


    //// Indexes & Pools Info ////
    const poolsInfo = poolsInfoFromBalances(chainId, poolsBalances)
    const indexesInfo = poolsInfoFromBalances(chainId, indexesBalances)


    //// Chart1: Asset value % Chart Data  ////
    const valueByAsset : PieChartsData[] = Object.values(tokenBalances).map( (item ) => {
        return {
            name: item.symbol,
            value: Number( fromDecimals( item.value, depositToken.decimals, 2) ),
       } 
    }).filter( it => it.value > 0)

    //// Chart 2: Value by Pools/Indexes////
    const valueByPool : PieChartsData[] = valueByPoolChartData(chainId, poolsBalances, indexesBalances, depositToken, account)

    return  {
        portfolioInfo: { tokenBalances: tokenBalances, totalValue: totalValue },
        chartValueByAsset: { title: "Asset Allocation", data: valueByAsset, width: 250, height: 250, includePercent: true},
        chartValueByPool: { title: "Pool Allocation", data: valueByPool, width: 250, height: 250, includePercent: false},
        poolsInfo,
        indexesInfo,
    }

}




const poolsInfoFromBalances = (chainId : number, poolsBalances: { [ x: string ] : any } ) : PoolData[] => {

    return Object.keys(poolsBalances).map( (poolId : string) : PoolData => {

        const { depositToken : depositTokenSymbol, investTokens : investTokenSymbols } = PoolInfo(chainId, poolId)
        const poolTokenSymbols = [depositTokenSymbol, ...investTokenSymbols] as string[]

        const tokenInfoArray = Object.values(poolsBalances[poolId]) as TokenInfo[]
        const tokensArrayFiltered = tokenInfoArray.filter( it => poolTokenSymbols.includes(it.symbol) )

        const totalValue : BigNumber = tokensArrayFiltered.reduce( (acc, val)  => {
            if (val.accountValue) acc = acc.add(val.accountValue)
            return acc
        }, BigNumber.from(0))

        return  { poolId, tokenInfoArray: tokensArrayFiltered, totalValue }
    })
}


const valueByPoolChartData = (chainId: number, 
        poolsBalances:  { [ x: string ] : any }, 
        indexesBalances:  { [ x: string ] : any }, 
        depositToken: Token, 
        account? : string) : PieChartsData[] => {

    const chart2Values = [...Object.keys(indexesBalances), ...Object.keys(poolsBalances)].reduce( (acc, poolId) => {
        acc[poolId] = {
            name: poolId,
            value: BigNumber.from(0)
        }
        return acc
   
    }, {} as {[ x : string ] : { name: string, value: BigNumber } })

    const aa = [...Object.values(poolsBalances)].forEach( pool => {
        Object.values(pool).reduce( ( acc : any, val : any) => {
            acc[val.poolId].value = (account && val.accountValue) ? acc[val.poolId].value.add(val.accountValue) : 
                                                      (val.value) ? acc[val.poolId].value.add(val.value) : acc[val.poolId].value
            return acc

        }, chart2Values )
        return chart2Values
    })
   
    const bb = [...Object.values(indexesBalances)].forEach( pool => {
        return Object.values(pool).reduce( ( acc : any, val : any) => {
             acc[val.indexId].value = (account && val.accountValue) ? acc[val.indexId].value.add(val.accountValue) : 
                                                        (val.value) ? acc[val.indexId].value.add(val.value) : acc[val.indexId].value
            
            return acc
 
         }, chart2Values )
    })
 

    const valueByPool = Object.values(chart2Values).map( it => {
        const { name } = PoolInfo(chainId, it.name)

        return {
            name: name,
            value: Number( fromDecimals(it.value, depositToken.decimals, 2) )
        }
     }).filter( it => it.value > 0)

     return valueByPool
}
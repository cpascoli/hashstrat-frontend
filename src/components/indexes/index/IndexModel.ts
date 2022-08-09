

import { useTokensInfoForPools, useTokensInfoForIndexes } from "../../../hooks/usePoolInfo"
import { PoolIds, PoolInfo, IndexesIds } from "../../../utils/pools"
import { Token } from "../../../types/Token"
import { BigNumber } from "ethers"
import { fromDecimals, round} from "../../../utils/formatter"

import { PieChartsData, ChartData } from "../../shared/PieChartWithLabels"


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

export type IndexModel = {
    portfolioInfo: PortfolioInfo;
    chartData: ChartData
    indexInfo: PoolData,
}


export const useIndexModel = (chainId: number, indexId: string, tokens: Token[], depositToken: Token, account?: string) : IndexModel => {

    const indexesBalances = useTokensInfoForIndexes(chainId, [indexId], tokens, account)


    // Sum up balance and value across all pools 
    // if an account is connected use his balance and value, otherwise show the totals
    let initValues = tokens.reduce( (acc, val) => {
        acc[val.symbol] = { symbol: val.symbol, decimals: val.decimals, value: BigNumber.from(0), balance: BigNumber.from(0) }
        return acc
    }, {} as TokenBalances )

    // const allPools = [...Object.values(indexesBalances)].filter( el => el !== undefined)

    const tokenBalances : TokenBalances = Object.values(indexesBalances).reduce( (totals, pool ) : TokenBalances => {

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

    const totalValue: BigNumber = tokenBalances && Object.values(tokenBalances).reduce( (total, token ) : BigNumber => {
        return total.add(token.value)
    }, BigNumber.from(0))


    //// Indexes Info ////
    const indexInfo = poolInfoFromBalances(chainId, indexesBalances)

    //// Chart Data  ////

    const chartValues : PieChartsData[] = Object.values(tokenBalances).map( (item ) => {
        return {
            name: item.symbol,
            value: Number( fromDecimals( item.value, depositToken.decimals, 2) ),
       } 

    }).filter( it => it.value > 0)

    return  {
        portfolioInfo: { tokenBalances: tokenBalances, totalValue: totalValue },
        chartData: { title: "Token Value Chart", data: chartValues },
        indexInfo
    }

}


const poolInfoFromBalances = (chainId : number, poolsBalances: { [ x: string ] : any } ) : PoolData => {

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
    })[0]
}

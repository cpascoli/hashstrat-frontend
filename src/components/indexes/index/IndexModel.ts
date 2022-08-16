

import { useTokensInfoForIndexes, useTokensInfoForPools } from "../../../hooks/usePoolInfo"
import { usePoolInfoArray } from '../../../hooks/useIndex'

import { PoolInfo } from "../../../utils/pools"
import { Token } from "../../../types/Token"
import { BigNumber } from "ethers"
import { fromDecimals } from "../../../utils/formatter"

import { PieChartsData, ChartData } from "../../shared/PieChartWithLabels"


type TokenBalances = { [x: string]: { symbol: string, decimals: number, value: BigNumber, balance: BigNumber } }

type TokenInfo = {
    value: BigNumber,
    balance: BigNumber,
    accountValue: BigNumber,
    accountBalance: BigNumber
    decimals: number,
    symbol: string,
}
type PoolData = {
    poolId: string,
    tokenInfoArray: TokenInfo[],
    totalValue: BigNumber
}

type PortfolioInfo = {
    totalValue: BigNumber,
    tokenBalances: TokenBalances
}

export type PoolSummary = {
    poolId: string,
    name: string,
    weight: number
}

export type IndexModel = {
    portfolioInfo: PortfolioInfo;
    chartValueByAsset: ChartData,
    chartValueByPool: ChartData,
    indexInfo: PoolData,
    poolsInfo: PoolSummary[]
}


export const useIndexModel = (chainId: number, indexId: string, tokens: Token[], depositToken: Token, account?: string): IndexModel => {

    const indexesBalances = useTokensInfoForIndexes(chainId, [indexId], tokens, account)
    const polInfoArray = usePoolInfoArray(chainId, indexId)
    const poolIds = polInfoArray?.map( ( el : { [x  : string] : string } ) => el.name.toLowerCase() )
    const weights = polInfoArray?.map( ( el : { [x  : string] : string } ) => el.weight )

    const poolsInfo = poolIds?.map ( (poolId : string, idx: number) => {
       const info =  PoolInfo(chainId, poolId)
       return {
            poolId: poolId,
            name: info["name"],
            weight: weights[idx],
       }
    })

    // Sum up balance and value across all pools 
    // if an account is connected use his balance and value, otherwise show the totals
    let initValues = tokens.reduce((acc, val) => {
        acc[val.symbol] = { symbol: val.symbol, decimals: val.decimals, value: BigNumber.from(0), balance: BigNumber.from(0) }
        return acc
    }, {} as TokenBalances)

    // const allPools = [...Object.values(indexesBalances)].filter( el => el !== undefined)

    const tokenBalances: TokenBalances = Object.values(indexesBalances).reduce((totals, pool): TokenBalances => {

        Object.keys(pool).forEach(symbol => {
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

    }, initValues)

    const totalValue: BigNumber = tokenBalances && Object.values(tokenBalances).reduce((total, token): BigNumber => {
        return total.add(token.value)
    }, BigNumber.from(0))


    //// Indexes Info ////
    const indexInfo = poolInfoFromBalances(chainId, indexesBalances)

  


    //// Charts   ////

    //  Chart 1: valueByAsset chart
    const chartValues: PieChartsData[] = Object.values(tokenBalances).map((item) => {
        return {
            name: item.symbol,
            value: Number(fromDecimals(item.value, depositToken.decimals, 2)),
        }

    }).filter(it => it.value > 0)


    //// Chart 2: Value by Pools/Indexes////
    const poolsBalances = useTokensInfoForPools(chainId, poolIds??[], tokens, account)

    const valueByPool: PieChartsData[] = valueByPoolChartData(chainId, poolsBalances, [], depositToken, account)



    return {
        portfolioInfo: { tokenBalances: tokenBalances, totalValue: totalValue },
        chartValueByAsset: { title: "Asset Allocation", data: chartValues, width: 250, height: 250, includePercent: true },
        chartValueByPool: { title: "Pool Allocation", data: valueByPool, width: 250, height: 250, includePercent: false},
        indexInfo,
        poolsInfo,
    }

}


const poolInfoFromBalances = (chainId: number, poolsBalances: { [x: string]: any }): PoolData => {

    return Object.keys(poolsBalances).map((poolId: string): PoolData => {

        const { depositToken: depositTokenSymbol, investTokens: investTokenSymbols } = PoolInfo(chainId, poolId)
        const poolTokenSymbols = [depositTokenSymbol, ...investTokenSymbols] as string[]

        const tokenInfoArray = Object.values(poolsBalances[poolId]) as TokenInfo[]
        const tokensArrayFiltered = tokenInfoArray.filter(it => poolTokenSymbols.includes(it.symbol))

        const totalValue: BigNumber = tokensArrayFiltered.reduce((acc, val) => {
            if (val.accountValue) acc = acc.add(val.accountValue)
            return acc
        }, BigNumber.from(0))

        return { poolId, tokenInfoArray: tokensArrayFiltered, totalValue }
    })[0]
}




const valueByPoolChartData = (chainId: number,
    poolsBalances: { [x: string]: any },
    indexesBalances: { [x: string]: any },
    depositToken: Token,
    account?: string): PieChartsData[] => {

    const chart2Values = [...Object.keys(indexesBalances), ...Object.keys(poolsBalances)].reduce((acc, poolId) => {
        acc[poolId] = {
            name: poolId,
            value: BigNumber.from(0)
        }
        return acc

    }, {} as { [x: string]: { name: string, value: BigNumber } })

    const aa = [...Object.values(poolsBalances)].forEach(pool => {
        Object.values(pool).reduce((acc: any, val: any) => {
            acc[val.poolId].value = (account && val.accountValue) ? acc[val.poolId].value.add(val.accountValue) :
                (val.value) ? acc[val.poolId].value.add(val.value) : acc[val.poolId].value
            return acc

        }, chart2Values)
        return chart2Values
    })

    const bb = [...Object.values(indexesBalances)].forEach(pool => {
        return Object.values(pool).reduce((acc: any, val: any) => {
            acc[val.indexId].value = (account && val.accountValue) ? acc[val.indexId].value.add(val.accountValue) :
                (val.value) ? acc[val.indexId].value.add(val.value) : acc[val.indexId].value

            return acc

        }, chart2Values)
    })


    const valueByPool = Object.values(chart2Values).map(it => {
        const { name } = PoolInfo(chainId, it.name)

        return {
            name: name,
            value: Number(fromDecimals(it.value, depositToken.decimals, 2))
        }
    }).filter(it => it.value > 0)

    return valueByPool
}
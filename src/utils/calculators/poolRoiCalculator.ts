

import { BigNumber } from 'ethers'
import { fromDecimals, round } from "../formatter"
import { Token } from "../../types/Token"
import { SwapInfo } from "../../types/SwapInfo"
import { RoiInfo } from "../../types/RoiInfo"

import btc_feed  from "./feeds/BTC_weekly.json"
import eth_feed  from "./feeds/ETH_weekly.json"


export const roiDataForPrices = (
    swaps: SwapInfo[], 
    priceRaw: string , 
    priceTimestamp: number, 
    depositToken: Token, 
    investToken: Token

) : RoiInfo[] => {

    const feed = investToken.symbol === 'WETH' ? eth_feed :  investToken.symbol === 'WBTC'?  btc_feed : undefined
    if (swaps.length == 0 || !feed) return []

    let swapsForFeed : SwapInfo[] = []
    swaps.forEach( (it, idx) => {
        
        if (feed && idx > 0) {
            // add SwapInfo items between current and previous SwapInfo
            const from = swaps[idx-1]
            const swapsResp = findRoiItems(feed, 8, from, it)
            swapsForFeed.push(...swapsResp)
        }

        swapsForFeed.push(it)

        if (feed && idx === swaps.length-1) {
            // add SwapInfo items after last swap
            const swapsResp = findRoiItems(feed, 8, it)
            swapsForFeed.push(...swapsResp)
        }
    })

    return roiDataForSwaps(swapsForFeed, priceRaw, priceTimestamp, depositToken, investToken)
}

// Returns the array of RoiInfo items from the datafeed 
const findRoiItems = (feed: { [x : string] : any } [], feedDecimals: number, from: SwapInfo, to?: SwapInfo) : SwapInfo[] => {


        // [ts0, ..., ts1] the time interval to use to filter the pricefeed
        // use the last feed price if to SwapInfo is not provided
        const ts0 =  Number(from.timestamp)
        const ts1 = to ? Number(to.timestamp) : Date.parse( feed[feed.length-1].date ) / 1000

        let response : SwapInfo[] = []

        for (const item of feed) {
            const date = Date.parse(item.date) / 1000;

            if (date > ts0 && date < ts1) {
                const priceInt = BigNumber.from( round( item.open * 100 ) )
                const price = BigNumber.from(10).pow(feedDecimals - 2).mul( priceInt )

                response.push(
                    {
                        timestamp: `${date}`,
                        side: from.side,
                        feedPrice: price.toString(),
                        bought: "0",
                        sold: "0",
                        depositTokenBalance: from.depositTokenBalance,
                        investTokenBalance: from.investTokenBalance
                    }
                )
            }
        }

        return response
}




export const roiDataForSwaps = (
        swaps: SwapInfo[], 
        priceRaw: string , 
        priceTimestamp: number, 
        depositToken: Token, 
        investToken: Token

    ) : RoiInfo[] => {


    const lastPrice = parseFloat(fromDecimals(BigNumber.from(priceRaw), 8, 2))

    // A model investment of $100
    const initialInvestment = 100 
    let riskAssetAmount = 0;
    let stableAssetAmount = initialInvestment

    // calculate buy & hold amount at time 0
    const firstPrice = swaps.length > 0 ? parseFloat(fromDecimals(BigNumber.from(swaps[0].feedPrice), 8, 2)) : 0
    const buyAndHoldAmount = firstPrice ? (initialInvestment / firstPrice) : 0

    // calculate ROI and value for 
    const roidData = swaps.map((data, idx) => {

        const date = Number(data.timestamp)
        const price = parseFloat(fromDecimals(BigNumber.from(data.feedPrice), 8, 2))
        const investTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.investTokenBalance), investToken.decimals, 6))
        const depositTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.depositTokenBalance), depositToken.decimals, 2))

        const deltaInvestTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.bought), investToken.decimals, 6)) :
            parseFloat(fromDecimals(BigNumber.from(data.sold), investToken.decimals, 6))

        const deltaDepositTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.sold), depositToken.decimals, 2)) :
            parseFloat(fromDecimals(BigNumber.from(data.bought), depositToken.decimals, 2))

        // percent of the risk asset traded
        const investTokens = investTokenBalance + (data.side === 'BUY' ? 0 : deltaInvestTokens)
        const riskAssetPercTraded = investTokens === 0 ? 0 : deltaInvestTokens / investTokens

        // percent of the stable asset traded
        const depositTokens =  depositTokenBalance + (data.side === 'BUY' ? deltaDepositTokens : 0)
        const stableAssetPercTraded = depositTokens === 0 ? 0 : deltaDepositTokens / depositTokens

     
        if (data.side === 'BUY') {
            const tradedAmount = stableAssetAmount * stableAssetPercTraded
            stableAssetAmount -= tradedAmount
            riskAssetAmount += (tradedAmount / price)
        }
        if (data.side === 'SELL') {
            const tradedAmount = riskAssetAmount * riskAssetPercTraded
            stableAssetAmount += (tradedAmount * price)
            riskAssetAmount -= tradedAmount
        }

        // Strategy value and ROI at current price
        const strategyValue = riskAssetAmount * price + stableAssetAmount
        const strategyROI = 100 * (strategyValue - initialInvestment) / initialInvestment

        // Buy & Hold value and ROI at current price
        const buyAndHoldValue = buyAndHoldAmount * price
        const buyAndHoldROI = 100 * (buyAndHoldValue - initialInvestment) / initialInvestment

        return {
            date: date,
            strategyROI: round(strategyROI),
            strategyValue: round(strategyValue),
            buyAndHoldROI: round(buyAndHoldROI),
            buyAndHoldValue: round(buyAndHoldValue),
        }
    })


    const strategyValue = riskAssetAmount * lastPrice + stableAssetAmount
    const strategyROI = 100 * (strategyValue - initialInvestment) / initialInvestment
    const buyAndHoldValue = buyAndHoldAmount * lastPrice
    const buyAndHoldROI = 100 * (buyAndHoldValue - initialInvestment) / initialInvestment

    const latest = {
        date: priceTimestamp,
        strategyROI: round(strategyROI),
        strategyValue: round(strategyValue),
        buyAndHoldROI: round(buyAndHoldROI),
        buyAndHoldValue: round(buyAndHoldValue),
    }

    return [ ...roidData, latest ]
}



import { BigNumber } from 'ethers'
import { fromDecimals, round } from "../formatter"
import { Token } from "../../types/Token"
import { SwapInfo } from "../../types/SwapInfo"
import { RoiInfo } from "../../types/RoiInfo"

import btc_feed from "../../services/pricefeed/feeds/BTC_weekly.json"
import eth_feed  from "../../services/pricefeed/feeds/ETH_weekly.json"
import { time } from 'console'


/** 
 * Calculates the RoiInfo data for a chronologically ordered array of timestamps.
 * 
 * These timestamps include those in the SwapInfo[] provided and the 'priceTimestamp' of the latest priceRaw
 * as well as the timestamp of the opening prices of the weekly price feed assocaited to the 'investToken' provided.
 *  
 */ 

//TODO
// use PriceService

export const roiDataForPrices = (
    swaps: SwapInfo[], 
    priceRaw: string , 
    priceTimestamp: number, 
    depositToken: Token, 
    investToken: Token,
    initialInvestment: number = 100
) : RoiInfo[] => {

    const feed = investToken.symbol === 'WETH' ? eth_feed :  investToken.symbol === 'WBTC'?  btc_feed : undefined
    if (swaps.length == 0 || !feed) return []

    let swapsForFeed : SwapInfo[] = []
    swaps.forEach( (it, idx) => {
        
        if (feed && idx > 0) {
            // add SwapInfo items between current and previous SwapInfo
            const from = swaps[idx-1]
            const swapsResp = findSwapInfoItems(feed, 8, from, Number(it.timestamp)) // priceFeed dacimals is 8
            swapsForFeed.push(...swapsResp)
        }

        swapsForFeed.push(it)

        if (feed && idx === swaps.length-1) {
            // add SwapInfo items after last swap
            const swapsResp = findSwapInfoItems(feed, 8, it, priceTimestamp)
            swapsForFeed.push(...swapsResp)
        }
    })

    return roiInfoForSwaps(swapsForFeed, priceRaw, priceTimestamp, depositToken, investToken, initialInvestment)
}


// Returns the array of SwapInfo items between the 'from' SwapInfo and 'lastTimestamp', 
// including prices from the datafeed 
const findSwapInfoItems = (feed: { [x : string] : any } [], feedDecimals: number, from: SwapInfo, lastTimestamp? : number) : SwapInfo[] => {

        // [ts0, ..., ts1] the time interval to use to filter the pricefeed
        // use the last feed price if to SwapInfo is not provided
        const ts0 =  Number(from.timestamp)
        const ts1 = lastTimestamp ? lastTimestamp : Date.parse( feed[feed.length-1].date ) / 1000

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




const roiInfoForSwaps = (
        swaps: SwapInfo[], 
        tokepPrice: string , 
        priceTimestamp: number, 
        depositToken: Token, 
        investToken: Token,
        initialInvestment: number = 100
    ) : RoiInfo[] => {
    
    console.log(">>> roiInfoForSwaps - tokepPrice:", tokepPrice)

    const lastPrice = parseFloat(fromDecimals(BigNumber.from(tokepPrice), 8, 2))

    // A model investment of $100
    let riskAssetAmount = 0;
    let stableAssetAmount = initialInvestment

    // calculate buy & hold amount at time 0
    const firstPrice = swaps.length > 0 ? parseFloat(fromDecimals(BigNumber.from(swaps[0].feedPrice), 8, 2)) : 0
    const buyAndHoldAmount = firstPrice ? (initialInvestment / firstPrice) : 0

    // calculate ROI data
    const roidData : RoiInfo[] = []

    swaps.forEach((data, idx) => {

        const timestamp = Number(data.timestamp)
        const price = parseFloat(fromDecimals(BigNumber.from(data.feedPrice), 8, 2))
        const investTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.investTokenBalance), investToken.decimals, 6))
        const depositTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.depositTokenBalance), depositToken.decimals, 2))

        const deltaInvestTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.bought), investToken.decimals, 6)) :
                                  data.side === 'SELL' ? parseFloat(fromDecimals(BigNumber.from(data.sold), investToken.decimals, 6)) : 0

        const deltaDepositTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.sold), depositToken.decimals, 2)) :
                                   data.side === 'SELL' ? parseFloat(fromDecimals(BigNumber.from(data.bought), depositToken.decimals, 2)) : 0


        // percent of the risk asset traded
        const investTokens = investTokenBalance + (data.side === 'SELL' ? deltaInvestTokens : 0)
        const riskAssetPercTraded = investTokens === 0 ? 0 : deltaInvestTokens / investTokens

        // percent of the stable asset traded
        const depositTokens =  depositTokenBalance + (data.side === 'BUY' ? deltaDepositTokens : 0)
        const stableAssetPercTraded = depositTokens === 0 ? 0 : deltaDepositTokens / depositTokens

        // if there was a swap record ROI info before 
        if (deltaInvestTokens > 0 && deltaDepositTokens > 0) {
            const strategyValueBefore = riskAssetAmount * price + stableAssetAmount
            const strategyROIBefore = 100 * (strategyValueBefore - initialInvestment) / initialInvestment
    
            const buyAndHoldValueBefore = buyAndHoldAmount * price
            const buyAndHoldROIBefore = 100 * (buyAndHoldValueBefore - initialInvestment) / initialInvestment
    
            const investTokenPercBefore = 100 * riskAssetAmount * price / strategyValueBefore
            const depositTokenPercBefore = 100 * stableAssetAmount / strategyValueBefore
    
            roidData.push(
                {
                    date: timestamp - 1,
                    strategyROI: round(strategyROIBefore),
                    strategyValue: round(strategyValueBefore),
                    buyAndHoldROI: round(buyAndHoldROIBefore),
                    buyAndHoldValue: round(buyAndHoldValueBefore),
                    investTokenPerc: round(investTokenPercBefore),
                    depositTokenPerc: round(depositTokenPercBefore),
                }
            )

            console.log("Rebalancing - ROI before ", idx, new Date(timestamp * 1000).toISOString().split('T')[0],
            "price:", price,
            " investTokenPerc: ", round(investTokenPercBefore), 
            " depositTokenPerc:",  round(depositTokenPercBefore), "data: ", data)
   
        }
     
        //// update token balances according to the swap performed 
        if (data.side === 'BUY') {
            const stableAssetSold = stableAssetAmount * stableAssetPercTraded
            stableAssetAmount -= stableAssetSold
            riskAssetAmount += (stableAssetSold / price)
        }
        if (data.side === 'SELL') {
            const riskAssetSold = riskAssetAmount * riskAssetPercTraded
            stableAssetAmount += (riskAssetSold * price)
            riskAssetAmount -= riskAssetSold
        }

        // Strategy value and ROI at current price
        const strategyValue = riskAssetAmount * price + stableAssetAmount
        const strategyROI = 100 * (strategyValue - initialInvestment) / initialInvestment

        // Buy & Hold value and ROI at current price
        const buyAndHoldValue = buyAndHoldAmount * price
        const buyAndHoldROI = 100 * (buyAndHoldValue - initialInvestment) / initialInvestment

        const investTokenPerc = 100 * riskAssetAmount * price / strategyValue
        const depositTokenPerc = 100 * stableAssetAmount / strategyValue

        console.log("Rebalancing - ROI after ", idx, new Date(timestamp * 1000).toISOString().split('T')[0],
         "price:", price,
         " investTokenPerc: ", round(investTokenPerc), 
         " depositTokenPerc:", round(depositTokenPerc), "data: ", data)

        roidData.push(
            {
                date: timestamp,
                strategyROI: round(strategyROI),
                strategyValue: round(strategyValue),
                buyAndHoldROI: round(buyAndHoldROI),
                buyAndHoldValue: round(buyAndHoldValue),
                investTokenPerc: round(investTokenPerc),
                depositTokenPerc: round(depositTokenPerc),
            }
        )
    })


    const strategyValue = riskAssetAmount * lastPrice + stableAssetAmount
    const strategyROI = 100 * (strategyValue - initialInvestment) / initialInvestment
    const buyAndHoldValue = buyAndHoldAmount * lastPrice
    const buyAndHoldROI = 100 * (buyAndHoldValue - initialInvestment) / initialInvestment

    const investTokenPerc = 100 * riskAssetAmount * lastPrice / strategyValue
    const depositTokenPerc = 100 * stableAssetAmount / strategyValue

    const latest = {
        date: priceTimestamp,
        strategyROI: round(strategyROI),
        strategyValue: round(strategyValue),
        buyAndHoldROI: round(buyAndHoldROI),
        buyAndHoldValue: round(buyAndHoldValue),
        investTokenPerc: round(investTokenPerc),
        depositTokenPerc: round(depositTokenPerc),
    }

    return [ ...roidData, latest ]
}

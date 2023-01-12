

import { BigNumber } from 'ethers'
import { fromDecimals, round } from "../formatter"
import { Token } from "../../types/Token"
import { SwapInfo } from "../../types/SwapInfo"
import { RoiInfo } from "../../types/RoiInfo"

import { FeedInastance, Feed } from "../../services/pricefeed/PricefeedService"


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
    priceRaw: BigNumber , 
    priceTimestamp: number, 
    depositToken: Token, 
    investToken: Token,
    initialInvestment: number = 100
) : RoiInfo[] => {

    // const feed = investToken.symbol === 'WETH' ? eth_feed : investToken.symbol === 'WBTC'?  btc_feed : undefined

    const feed = FeedInastance(investToken.symbol, "daily")

    if (swaps.length == 0 || !feed) return []

    let swapsForFeed : SwapInfo[] = []
    swaps.forEach( (it, idx) => {
        
        if (idx > 0) {
            // add SwapInfo items between current and previous SwapInfo
            const from = swaps[idx-1]
            const swapsResp = findSwapInfoItems(feed, 8, from, Number(it.timestamp)) // priceFeed dacimals is 8
            swapsForFeed.push(...swapsResp)
        }

        swapsForFeed.push(it)

        if (idx === swaps.length-1) {
            // add SwapInfo items after last swap
            const swapsResp = findSwapInfoItems(feed, 8, it, priceTimestamp)
            swapsForFeed.push(...swapsResp)
        }
    })

    return roiInfoForSwaps(swapsForFeed, priceRaw, priceTimestamp, depositToken, investToken, initialInvestment)
}


// Returns the array of SwapInfo items between the 'from' SwapInfo and 'lastTimestamp', 
// including prices from the datafeed 
const findSwapInfoItems = (feed : Feed, feedDecimals: number, from: SwapInfo, lastTimestamp? : number) : SwapInfo[] => {

        // [ts0, ..., ts1] the time interval to use to filter the pricefeed
        // use the last feed price if to SwapInfo is not provided
        const fromDate =  new Date( Number(from.timestamp) * 1000)
        const toDate = lastTimestamp ? new Date(lastTimestamp * 1000) : new Date()

        let response : SwapInfo[] = []

        for (const priceData of feed.getPrices(fromDate, toDate)) {

            const dateTs = round(priceData.date.getTime() / 1000)
            const priceInt = BigNumber.from( round( priceData.price * 100 ) )
            const price = BigNumber.from(10).pow(feedDecimals - 2).mul( priceInt )

            response.push(
                {
                    timestamp: `${dateTs}`,
                    side: from.side,
                    feedPrice: price.toString(),
                    bought: "0",
                    sold: "0",
                    depositTokenBalance: from.depositTokenBalance,
                    investTokenBalance: from.investTokenBalance
                }
            )
        }

        return response
}




const roiInfoForSwaps = (
        swaps: SwapInfo[], 
        tokenPrice: BigNumber, 
        priceTimestamp: number, 
        depositToken: Token, 
        investToken: Token,
        initialInvestment: number = 100
    ) : RoiInfo[] => {
    

    const lastPrice = parseFloat(fromDecimals(tokenPrice, 8, 2))

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

        // if there was a swap also record roi info (e.g token percentages) before the swap happened
        if (stableAssetPercTraded > 0 || riskAssetPercTraded > 0) {
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

        if (stableAssetPercTraded > 0 || riskAssetPercTraded > 0) {
            console.log("ROI calc - ", idx, new Date(timestamp * 1000).toISOString().split('T')[0],
            "price:", price,
            " investTokenPerc: ", round(investTokenPerc), 
            " depositTokenPerc:", round(depositTokenPerc), "data: ", data)
        }

        // console.log("Rebalancing - ROI before ", idx, new Date(timestamp * 1000).toISOString().split('T')[0],
        // "price:", price,
        // " investTokenPerc: ", round(investTokenPercBefore), 
        // " depositTokenPerc:",  round(depositTokenPercBefore), "data: ", data)

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

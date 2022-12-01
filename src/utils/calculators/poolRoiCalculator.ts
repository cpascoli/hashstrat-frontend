

import { BigNumber, ethers } from 'ethers'
import { fromDecimals, round } from "../formatter"
import { Token } from "../../types/Token"
import { SwapInfo } from "../../types/SwapInfo"


export const roiDataForSwaps = (swaps: SwapInfo[], price: number, priceTimestamp: number, depositToken: Token, investToken: Token) => {

    // console.log("PoolRoiDataForSwaps - swaps:", swaps)

    // A model investment of $100
    const initialInvestment = 100 
    let riskAssetAmount = 0;
    let stableAssetAmount = initialInvestment

    // calculate buy & hold amount at time 0
    const firstPrice = swaps.length > 0 ? parseFloat(fromDecimals(BigNumber.from(swaps[0].feedPrice), 8, 2)) : 0
    const buyAndHoldAmount = firstPrice ? (initialInvestment / firstPrice) : 0


    const roidData = swaps.map((data, idx) => {

        const date = Number(data.timestamp)

        const price = parseFloat(fromDecimals(BigNumber.from(data.feedPrice), 8, 2))
        const investTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.investTokenBalance), investToken.decimals, 6))
        const depositTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.depositTokenBalance), depositToken.decimals, 2))

        const deltaInvestTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.bought), investToken.decimals, 6)) :
            parseFloat(fromDecimals(BigNumber.from(data.sold), investToken.decimals, 6))

        const deltaDepositTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.sold), depositToken.decimals, 2)) :
            parseFloat(fromDecimals(BigNumber.from(data.bought), depositToken.decimals, 2))

        // perc risk asset traded
        const riskAssetPercTraded = deltaInvestTokens / (investTokenBalance + (data.side === 'BUY' ? 0 : deltaInvestTokens))

        // perc stable asset traded
        const stableAssetPercTraded = deltaDepositTokens / (depositTokenBalance + (data.side === 'BUY' ? deltaDepositTokens : 0))

        let tradedAmount = 0
        if (data.side === 'BUY') {
            tradedAmount = stableAssetAmount * stableAssetPercTraded
            stableAssetAmount -= tradedAmount
            riskAssetAmount += (tradedAmount / price)
        }
        if (data.side === 'SELL') {
            tradedAmount = riskAssetAmount * riskAssetPercTraded
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


    const strategyValue = riskAssetAmount * price + stableAssetAmount
    const strategyROI = 100 * (strategyValue - initialInvestment) / initialInvestment
    const buyAndHoldValue = buyAndHoldAmount * price
    const buyAndHoldROI = 100 * (buyAndHoldValue - initialInvestment) / initialInvestment

    const latest = {
        date: priceTimestamp,
        strategyROI: round(strategyROI),
        strategyValue: round(strategyValue),
        buyAndHoldROI: round(buyAndHoldROI),
        buyAndHoldValue: round(buyAndHoldValue),
    }

    return  [ ...roidData, latest ]
}

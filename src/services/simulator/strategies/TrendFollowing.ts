
import { BigNumber } from 'ethers'

import { Feed, FeedInastance } from "../../pricefeed/PricefeedService"
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo";
import { SwapInfo } from '../../../types/SwapInfo'
import { round } from '../../../utils/formatter'
import { Strategy } from "./Strategy"
import { Token } from "../../../types/Token"


export class TrendFollowing implements Strategy {

    feed: Feed;
    depositToken: Token
    investToken: Token

    readonly minAllocationPerc = 0.1     // 10% min allocation to both assets
    readonly tokensToSwapPerc = 1        // 100% of the value of the asset sold
    readonly targetPricePercDown = 0
    readonly targetPricePercUp = 0
    readonly movingAveragePeriod = 40   // 40 day Moving Average
    readonly dcaInterval = 5 * 86400  // buy/sell every 5 days
    
    readonly priceFeedDecimals = 8

    private movingAverage = 0 // the price of the MA
    private latestPrice = 0   // the latest price of the risk asset
    private lastEvalTime = 0  // lhe last time the strategy was evalued


    // asset balances
    private investTokenBalance = 0
    private depositTokenBalance = 0


    constructor(depositToken : Token, investToken : Token) {
        this.depositToken = depositToken
        this.investToken = investToken

        this.feed = FeedInastance(investToken.symbol)
    }


    simulate(from: Date, to: Date, amount: number): PoolTokensSwapsInfo | undefined {

        const price = this.feed.getPrice(to)
        const swaps : SwapInfo[] | undefined = this.getSwaps(from, to, amount)

        if (price && swaps) {
            const timestamp = round( to.getTime() / 1000, 0);
            const priceFormatted = `${price * 10**this.priceFeedDecimals}`

            const response = {
                poolId: "0",
                weight: 1,
                priceInfo: {
                    symbol: this.investToken.symbol,
                    price: priceFormatted,
                    timestamp: timestamp,
                },
                swaps: swaps
            }
            return response
        }
    }




    getSwaps(from: Date, to: Date, initialDepositTokenBalance: number) : SwapInfo[] | undefined {

        this.depositTokenBalance = initialDepositTokenBalance

        // filter for price range
        const prices = this.feed.getPrices(from, to)

        let response : SwapInfo[] = []

        prices.forEach( it => {

            // update current price, moving average and lastEvalTimestamp
            this.updateMovingAverage(it.price, it.date)
         
            // evaluate strategy
            const { action, amountIn } = this.evaluateTrade()

            // ensure min token percentage 
            // const depositTokensToSell = this.rebalanceDepositTokensAmount()
            // const investTokensToSell = this.rebalanceInvestTokensAmount();

            // deposit tokens to sell
            // const amount = ( action === "BUY" ) ? Math.max(depositTokensToSell, amountIn) :    // amount of deposit tokens
            //                 ( action === "SELL" ) ? Math.max(investTokensToSell, amountIn) : 0  // amount of invest tokens
        
            const shouldSell = action === "SELL" && amountIn > 0
            const shouldBuy = action === "BUY" && amountIn > 0
            
            const bought = shouldSell ? this.formatAmount(amountIn * this.latestPrice, this.depositToken.decimals) :
                            shouldBuy ? this.formatAmount(amountIn / this.latestPrice, this.investToken.decimals) : ''


            const sold = shouldSell ? this.formatAmount(amountIn, this.investToken.decimals) : 
                            shouldBuy ? this.formatAmount(amountIn, this.depositToken.decimals) : ''
                        

            if (shouldSell || shouldBuy) {

                const depositTokenDelta = shouldSell ? amountIn * this.latestPrice : shouldBuy ? -amountIn : 0
                const investTokenDelta = shouldSell ? -amountIn  : shouldBuy ? amountIn / this.latestPrice : 0

                this.depositTokenBalance += depositTokenDelta
                this.investTokenBalance += investTokenDelta

                response.push({
                    timestamp: `${this.lastEvalTime}`,
                    side: action,
                    feedPrice: this.formatAmount(this.latestPrice, this.priceFeedDecimals),
                    bought: bought,
                    sold: sold,
                    depositTokenBalance: this.formatAmount(this.depositTokenBalance, this.depositToken.decimals),
                    investTokenBalance: this.formatAmount(this.investTokenBalance, this.investToken.decimals),
                    portfolioValue: this.formatAmount(this.portfolioValue(), this.depositToken.decimals),
                })
            }
           
        })

        return response
    }



    evaluateTrade() : { action: string | undefined, amountIn: number} {
        
        let action : string | undefined = undefined
        let amountIn: number = 0

        const poolValue = this.portfolioValue()
        const deltaPrice = this.latestPrice - this.movingAverage  
        const deltaPricePerc = deltaPrice / this.movingAverage    // the % of price above/below the moving average

        const investPerc = this.investPercent()
        const depositPerc = poolValue > 0 ? 1 - investPerc : 0

        const shouldSell = deltaPricePerc < this.targetPricePercDown &&
                          investPerc > this.minAllocationPerc

        if (shouldSell) {
            // need to SELL invest tokens buying deposit tokens
            action = "SELL";
            amountIn = this.investTokenBalance * this.tokensToSwapPerc
        }

        const shouldBuy = deltaPricePerc > this.targetPricePercUp &&
                        depositPerc > this.minAllocationPerc

        if (shouldBuy) {
            // need to BUY invest tokens spending depositTokens
            action = "BUY"
            amountIn = this.depositTokenBalance * this.tokensToSwapPerc
        }

        console.log("evaluateTrade() - " , new Date(this.lastEvalTime * 1000).toISOString().split('T')[0], action,
         " - price: ", round(this.latestPrice), "", round(this.movingAverage), 
         "  delta %:", round(deltaPricePerc * 100)+"%")

        return { action, amountIn };
    }


    rebalanceDepositTokensAmount() {
        const investPerc = this.investPercent()
        let amountIn = 0;

        if (investPerc < this.minAllocationPerc) {
            // calculate amount of deposit tokens to sell (to BUY invest tokens)
            const maxPerc = 1 - this.minAllocationPerc  //  1 - this.minAllocationPerc)
            const poolValue = this.portfolioValue()
            const maxDepositValue = poolValue * maxPerc
            const depositTokenValue = this.depositTokenBalance

            amountIn = (depositTokenValue > maxDepositValue) ? depositTokenValue - maxDepositValue : 0
        }

        return amountIn;
    }


    rebalanceInvestTokensAmount() {

        const investPerc = this.investPercent()
        const depositPerc = 1 - investPerc

        const targetDepositPerc = this.minAllocationPerc
        let amountIn = 0;

        if (depositPerc < targetDepositPerc) {
            const price = this.latestPrice
            // calculate amount of invest tokens to sell (to BUY deposit tokens)

            // need to SELL some investment tokens
            const poolValue = this.portfolioValue();
            const investTokenValue = this.riskAssetValue();

            const targetInvestPerc = 1 - targetDepositPerc;  //  (e.g. 80%)
            const targetInvestTokenValue = poolValue * targetInvestPerc
           
            // calcualte amount of investment tokens to SELL
            amountIn = (investTokenValue - targetInvestTokenValue) / price;
        }

        return amountIn;
    }


    updateMovingAverage(price: number, date: Date) {

        const dateTImeSecs = round(date.getTime() / 1000, 0) 
        const secondSinceLastUpdate: number = dateTImeSecs - this.lastEvalTime
        const daysSinceLasUpdate = round(secondSinceLastUpdate / 86400, 0)

        if (daysSinceLasUpdate == 0) return;

        if (daysSinceLasUpdate >= this.movingAveragePeriod) {
            this.movingAverage = price
        } else {
            // update the moving average, using the average price for 'movingAveragePeriod' - 'daysSinceLasUpdate' days 
            // and the current price for the last 'daysSinceLasUpdate' days
            const oldPricesWeight = this.movingAverage * ( this.movingAveragePeriod - daysSinceLasUpdate);
            const newPriceWeight = daysSinceLasUpdate * price;
            this.movingAverage = (oldPricesWeight + newPriceWeight ) / this.movingAveragePeriod;
        }

        // remember when the moving average was updated
        this.latestPrice = price
        this.lastEvalTime = dateTImeSecs
    }


    investPercent() : number {
        const investTokenValue = this.investTokenBalance * this.latestPrice
        const portfolioValue = this.portfolioValue()
        const investPerc = investTokenValue / portfolioValue

        return investPerc
    }

    portfolioValue() : number {
        const investTokenValue = this.investTokenBalance * this.latestPrice
        const depositTokenValue = this.depositTokenBalance
        const portfolioValue = depositTokenValue + investTokenValue

        return portfolioValue
    }

    riskAssetValue() : number {
        return this.investTokenBalance * this.latestPrice
    }


    // Format the numeric amount into a BigNumber with the required decimals and return its string representation
    formatAmount(amount: number, decimals: number) : string {

        if (decimals < 8) {
            const amountInt = round(amount * 10 ** decimals, 0)
            return `${amountInt}`
        }

        const priceInt = BigNumber.from( round( amount * 10 ** 8, 0) )
        const price = BigNumber.from(10).pow(decimals - 8).mul( priceInt )
        return price.toString()
    }

}
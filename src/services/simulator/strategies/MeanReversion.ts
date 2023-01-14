
import { BigNumber } from 'ethers'

import { Feed, PriceData } from "../../pricefeed/PricefeedService"
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo";
import { SwapInfo } from '../../../types/SwapInfo'
import { round } from '../../../utils/formatter'
import { Strategy } from "./Strategy"
import { Token } from "../../../types/Token"


export class MeanReversion implements Strategy {

    feed: Feed;
    depositToken: Token
    investToken: Token

    readonly minAllocationPerc = 0.2     // 20% min allocation to both assets
    readonly tokensToSwapPerc = 0.05        // 5% of the value of the asset sold
    readonly targetPricePercDown = -0.33 // 33% below long term trend
    readonly targetPricePercUp = 0.66 // 66% above long term trend
    readonly movingAveragePeriod = 350   // 350 day Moving Average
    readonly executionInterval = 5 * 86400  // buy/sell every 5 days
    
    readonly priceFeedDecimals = 8

    private movingAverage = 0 // the price of the MA
    private latestPrice = 0   // the latest price of the risk asset
    private lastEvalTime = 0  // lhe last time the strategy was evalued


    // asset balances
    private investTokenBalance = 0
    private depositTokenBalance = 0


    constructor(feed: Feed, depositToken : Token, investToken : Token) {
        this.depositToken = depositToken
        this.investToken = investToken
        this.feed = feed
    }



    simulate(from: Date, to: Date, amount: number): PoolTokensSwapsInfo | undefined {

        // set moving average
        this.movingAverage = this.averagePrice(from, this.movingAveragePeriod)
        this.lastEvalTime = ( from.getTime() / 1000 )

        // console.log("movingAverage: ", this.movingAverage , this.feed.getPrice(from))


        const lastPrice = this.feed.getPrice(to)
        const swaps : SwapInfo[] | undefined = this.getSwaps(from, to, amount)

        if (lastPrice && swaps) {
            const timestamp = round( to.getTime() / 1000, 0);
            const priceFormatted = BigNumber.from(`${ round(lastPrice * 10**this.priceFeedDecimals, 0) }`)

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

        prices.forEach( (it, idx) => {

            if ((it.date.getTime() / 1000) < this.lastEvalTime + this.executionInterval) {
                return
            }

            // update current price, moving average and lastEvalTimestamp
            this.updateMovingAverage(it.price, it.date)
         
            // first swap to enfornce min allocation
            if (idx === 0) {
                const timestamp = round( it.date.getTime() / 1000, 0);
                const soldAmount = this.depositTokenBalance * this.minAllocationPerc
                const boughtAmount = soldAmount / it.price

                // update balances
                this.depositTokenBalance -= soldAmount 
                this.investTokenBalance += boughtAmount
                
                const investTokenValue = this.investTokenBalance * it.price
                const depositTokenValue = this.depositTokenBalance
                const portfolioValue = depositTokenValue + investTokenValue

                response.push({
                    timestamp: `${timestamp}`,
                    side: "BUY",
                    feedPrice: this.formatAmount(it.price, this.priceFeedDecimals),
                    bought: this.formatAmount(boughtAmount, this.investToken.decimals),
                    sold: this.formatAmount(soldAmount, this.depositToken.decimals),
                    depositTokenBalance: this.formatAmount(this.depositTokenBalance, this.depositToken.decimals),
                    investTokenBalance: this.formatAmount(this.investTokenBalance, this.investToken.decimals),
                    portfolioValue: this.formatAmount(portfolioValue, this.depositToken.decimals),
                })
            
            } else {

                // evaluate strategy
                const { action, amountIn } = this.evaluateTrade()

                // ensure min token percentage 
                const depositTokensToSell = this.rebalanceDepositTokensAmount()
                const investTokensToSell = this.rebalanceInvestTokensAmount();

                // deposit tokens to sell
                const amount = ( action === "BUY" ) ? Math.max(depositTokensToSell, amountIn) :    // amount of deposit tokens
                               ( action === "SELL" ) ? Math.max(investTokensToSell, amountIn) : 0  // amount of invest tokens
           
                const shouldSell = action === "SELL" && amount > 0
                const shouldBuy = action === "BUY" && amount > 0
                
                const bought = shouldSell ? this.formatAmount(amount * this.latestPrice, this.depositToken.decimals) :
                               shouldBuy ? this.formatAmount(amount / this.latestPrice, this.investToken.decimals) : ''


                const sold = shouldSell ? this.formatAmount(amount, this.investToken.decimals) : 
                             shouldBuy ? this.formatAmount(amount, this.depositToken.decimals) : ''
                           

                if (shouldSell || shouldBuy) {

                    // console.log("eval: ", it.date.toISOString().split('T')[0], it.price, action )

                    const depositTokenDelta = shouldSell ? amount * this.latestPrice : shouldBuy ? -amount : 0
                    const investTokenDelta = shouldSell ? -amount  : shouldBuy ? amount / this.latestPrice : 0

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
            }
           
        })


      

        return response
    }


    


    evaluateTrade() : { action: string | undefined, amountIn: number} {
        
        let action : string | undefined = undefined
        let amountIn: number = 0

        const poolValue = this.portfolioValue()
        const deltaPricePerc = (this.latestPrice - this.movingAverage) / this.movingAverage    // the % of price above/below the moving average

        const investPerc = this.investPercent()
        const depositPerc = poolValue > 0 ? 1 - investPerc : 0
   
        const shouldSell = deltaPricePerc >=  this.targetPricePercUp && investPerc > this.minAllocationPerc

        if (shouldSell) {
            // need to SELL invest tokens buying deposit tokens
            action = "SELL";
            amountIn = this.investTokenBalance * this.tokensToSwapPerc
        }

        const shouldBuy = deltaPricePerc <= this.targetPricePercDown && depositPerc > this.minAllocationPerc

        if (shouldBuy) {
            // need to BUY invest tokens spending depositTokens
            action = "BUY"
            amountIn = this.depositTokenBalance * this.tokensToSwapPerc
        }


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


    // Returns the simple moving average up to the date 'to' and for the number of days 'period'
    averagePrice(to: Date, period: number) : number {

        const from = new Date( ( (to.getTime() / 1000) - (period * 86400)) * 1000 )
        const prices = this.feed.getPrices(from, to)

        const sum = prices.reduce( (acc: number, val: PriceData) => {
            return acc + val.price
        }, 0)

        return round(sum / prices.length)
    }


    updateMovingAverage(price: number, date: Date) {

        const dateTImeSecs = round(date.getTime() / 1000, 0) 
        const secondSinceLastUpdate: number = dateTImeSecs - this.lastEvalTime
        const daysSinceLasUpdate = round(secondSinceLastUpdate / 86400, 0)

        if (daysSinceLasUpdate === 0) return;

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
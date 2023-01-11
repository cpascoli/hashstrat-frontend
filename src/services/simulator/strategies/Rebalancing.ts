
import { BigNumber } from 'ethers'

import { Feed, FeedInastance } from "../../pricefeed/PricefeedService"
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo";
import { SwapInfo } from '../../../types/SwapInfo'
import { round } from '../../../utils/formatter'
import { Strategy } from "./Strategy"
import { Token } from "../../../types/Token"


export class Rebalancing implements Strategy {

    feed: Feed;
    depositToken: Token
    investToken: Token

    // strategy parameters
    readonly rebalancingTarget = 0.6
    readonly rebalancingThreshold = 0.1

    priceFeedDecimals = 8

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
                poolId: "pool01",
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


    investTokenBalance = 0
    depositTokenBalance = 0


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

    getSwaps(from: Date, to: Date, amount: number) : SwapInfo[] | undefined {

        this.depositTokenBalance = amount

        // filter for price range
        const prices = this.feed.getPrices(from, to)

        let response : SwapInfo[] = []

        prices.forEach( (it, idx) => {

            // first swap
            if (idx === 0) {
                const timestamp = round( it.date.getTime() / 1000, 0);
                const soldAmount = this.depositTokenBalance * this.rebalancingTarget // $1000 * 0.6 = $600
                const boughtAmount = soldAmount / it.price //  $400 / $20000 = 0.02

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
                
                const investTokenValue = this.investTokenBalance * it.price
                const depositTokenValue = this.depositTokenBalance
                const portfolioValue = depositTokenValue + investTokenValue
               
                const investPerc = investTokenValue / portfolioValue
           

                const shouldSell = investPerc >= (this.rebalancingTarget + this.rebalancingThreshold)
                const shouldBuy = investPerc <=  (this.rebalancingTarget - this.rebalancingThreshold)
                
                if (shouldSell) {

                    const timestamp = round( it.date.getTime() / 1000, 0);

                    const valueToSell = investTokenValue - (this.rebalancingTarget * portfolioValue) // sell some of the invest tokens
                    const sellAmount = valueToSell / it.price

                    this.depositTokenBalance += valueToSell
                    this.investTokenBalance -= sellAmount

                    console.log("Rebalancing SELL BTC", it.date.toISOString().split('T')[0], "investPerc: ", round(investPerc), ">", this.rebalancingTarget + this.rebalancingThreshold)

                    response.push({
                        timestamp: `${timestamp}`,
                        side: "SELL",
                        feedPrice: this.formatAmount(it.price, this.priceFeedDecimals),
                        bought: this.formatAmount(valueToSell, this.depositToken.decimals),
                        sold: this.formatAmount(sellAmount, this.investToken.decimals),
                        depositTokenBalance: this.formatAmount(this.depositTokenBalance, this.depositToken.decimals),
                        investTokenBalance: this.formatAmount(this.investTokenBalance, this.investToken.decimals),
                        portfolioValue: this.formatAmount(portfolioValue, this.depositToken.decimals),
                    })
                }

              
                if (shouldBuy) {

                    const timestamp = round( it.date.getTime() / 1000, 0);

                    const valueToBuy = this.depositTokenBalance - ( (1 - this.rebalancingTarget) * portfolioValue)
                    const buyAmount = valueToBuy / it.price

                    this.depositTokenBalance -= valueToBuy
                    this.investTokenBalance += buyAmount

                    console.log("Rebalancing BUY BTC", it.date.toISOString().split('T')[0], "investPerc: ", round(investPerc), "<", this.rebalancingTarget - this.rebalancingThreshold)

                    response.push({
                        timestamp: `${timestamp}`,
                        side: "BUY",
                        feedPrice: this.formatAmount(it.price, this.priceFeedDecimals),
                        bought: this.formatAmount(buyAmount, this.investToken.decimals),
                        sold: this.formatAmount(valueToBuy, this.depositToken.decimals),
                        depositTokenBalance: this.formatAmount(this.depositTokenBalance, this.depositToken.decimals),
                        investTokenBalance: this.formatAmount(this.investTokenBalance, this.investToken.decimals),
                        portfolioValue: this.formatAmount(portfolioValue, this.depositToken.decimals),
                    })
                }


            }
        })

        console.log("Rebalancing; swaps: ", response)
        return response
    }


}
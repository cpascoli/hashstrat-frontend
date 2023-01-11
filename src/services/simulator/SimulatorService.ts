
import { FeedInastance, Feed } from "../pricefeed/PricefeedService"
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { Token } from "../../types/Token"

import { Strategy } from "./strategies/Strategy"
import { Rebalancing } from "./strategies/Rebalancing"
import { MeanReversion } from "./strategies/MeanReversion"
import { TrendFollowing } from "./strategies/TrendFollowing"


export enum StrategyName  {
    Rebalancing, MeanReversion, TrendFollowing
}

/**
 * A simulator for HashStrat Strategies. 
 * Uses a datafeed for the risk assets to produce a list of trades and strategy performance.
 * returns PoolTokensSwapsInfo, a data strcutre compatible with 
 * 
 */
class Simulator {

    feed: Feed
    amount: number
    depositToken : Token
    investtTokens : [Token]

    //TODO support an Index over multiple stategies
    strategy: Strategy | undefined

    constructor(feed: Feed, strategyName: StrategyName, amount: number, depositToken : Token, investTokens : [Token]) {

        this.feed = feed
        this.amount = amount
        this.depositToken = depositToken
        this.investtTokens = investTokens

        //TODO resolve strategy (or strategies) from constructor parameter 
        this.strategy = ( strategyName === StrategyName.Rebalancing ) ? new Rebalancing(depositToken, investTokens[0]) :
                        ( strategyName === StrategyName.MeanReversion ) ? new MeanReversion(depositToken, investTokens[0]) : 
                        ( strategyName === StrategyName.TrendFollowing ) ? new TrendFollowing(depositToken, investTokens[0]) : undefined
    }

    getSwapsInfo (from: Date, to: Date = new Date()) : PoolTokensSwapsInfo[] | undefined {
        const trades = this.strategy?.simulate(from, to, this.amount)
        
        return  trades ? [trades] : undefined
    }
}


export const SimulatorInastance = (symbol: string, strategy: StrategyName, amount: number, depositToken : Token, investTokens : [Token] ) => {
    return new Simulator(FeedInastance(symbol), strategy, amount, depositToken, investTokens)
}

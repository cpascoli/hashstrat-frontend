import btc_dayly  from "./feeds/BTC_daily.json"
import eth_dayly  from "./feeds/ETH_daily.json"

import btc_weekly  from "./feeds/BTC_weekly.json"
import eth_weekly  from "./feeds/ETH_weekly.json"

export type PriceData = {
    date: Date,
    price: number
}

type FeedPeriod = "daily" | "weekly"

export class Feed {

    prices: PriceData[];

    constructor( symbol: string, period : FeedPeriod = "daily" ) {

        const priceMap = ( it : {date: string, open: number} ) => {
            return {
                date: new Date( Date.parse(it.date) ),
                price: it.open
            }
        }

        switch(symbol) {
            case "WBTC": 
                this.prices = period === "daily" ? btc_dayly.map( it => priceMap(it) ) : btc_weekly.map( it => priceMap(it) ) 
                break;
            case "WETH":
                this.prices = period === "daily" ? eth_dayly.map( it => priceMap(it) ) : eth_weekly.map( it => priceMap(it) ) 
                break;
            default:
                this.prices = []
        }
    }

    getPrice (date: Date) : number | undefined  {
        const priceData = this.prices.find( (it, idx) => {
            return  it.date.getTime() <= date.getTime() && 
                    (idx === (this.prices.length-1) || this.prices[idx+1].date.getTime() > date.getTime())
        })

        return priceData?.price
    }


    getPrices(from: Date, to: Date) : PriceData[] {
        return this.prices.filter( it => it.date.getTime() >= from.getTime() && it.date.getTime() <= to.getTime() )
    }

}


export const FeedInastance = (symbol: string, period : FeedPeriod = "daily") : Feed => {
    const feed = new Feed(symbol, period)
    return feed
}

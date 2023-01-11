import btc_feed  from "./feeds/BTC_weekly.json"
import eth_feed  from "./feeds/ETH_weekly.json"

type PriceData = {
    date: Date,
    price: number
}

export class Feed {

    prices: PriceData[];

    constructor( symbol: string ) {

        const priceMap = ( it : {date: string, open: number} ) => {
            return {
                date: new Date( Date.parse(it.date) ),
                price: it.open
            }
        }

        switch(symbol) {
            case "WBTC": 
                this.prices = btc_feed.map( it => priceMap(it) )
                break;
            case "WETH":
                this.prices = eth_feed.map( it => priceMap(it) )
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


export const FeedInastance = (symbol: string) : Feed => {
    const feed = new Feed(symbol)
    return feed
}

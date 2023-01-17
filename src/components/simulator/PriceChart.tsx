import { useEffect, useState } from 'react'
import { makeStyles, Box } from  "@material-ui/core"
import { MultipleLineChart, TimeSeriesData } from "../shared/MultipleLineChart"
// import { TimeSeriesLineChart, TimeSeriesData } from "../shared/TimeSeriesLineChart"
import { round } from "../../utils/formatter"

import { StrategyPrices } from "../../services/simulator/strategies/Strategy"

import moment from "moment"


const useStyle = makeStyles( theme => ({
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}))


export interface PriceChartProps {
    symbol: string,
    prices: StrategyPrices[]
}


export const PriceChart = ({ symbol, prices } : PriceChartProps ) => {

    const classes = useStyle()
    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)
    
    const hasMa = prices.find( it => it.ma !== undefined) !== undefined
    const hasUpperMa = prices.find( it => it.upper !== undefined) !== undefined
    const hasLowerMa = prices.find( it => it.lower !== undefined) !== undefined

    const from = prices.length > 0 ? moment(prices[0].date) : undefined
    const to = prices.length > 1 ? moment(prices[prices.length-1].date) : undefined

    const days = to?.diff(from, 'days')

    useEffect(() => {
        if (prices) {
            const data = prices.map( (data ) => {
                let record : any = {}
                record['time'] = data.date.getTime()
                record[`${symbol} Price`] = round(data.price, 2)
                if (hasMa) {
                    record["Moving Average"] = round(data.ma ?? 0)
                }
                if (hasUpperMa) {
                    record["Upper Band"] = round(data.upper ?? 0)
                }
                if (hasLowerMa) {
                    record["Lower Band"] = round(data.lower ?? 0)
                }
                return record
            })
            setChartData(data)
        }

	}, [prices])


    return (
        <Box className={classes.chart} >
            <MultipleLineChart 
                title="Price Chart"  
                label1={`${symbol} Price`}
                label2={hasMa ? 'Moving Average' : undefined}
                label3={hasUpperMa ? 'Upper Band' : undefined}
                label4={hasLowerMa ? 'Lower Band' : undefined}
                yAxisRange={ days && days > 2*365 ? ['auto', 'auto'] : [0, 'auto'] }
                scale={ days && days > 2*365 ? 'log' : 'linear' }
        // scale={scaleLog().base(Math.E)}
        // domain={ chartData.yAxisRange ? chartData.yAxisRange  : ['auto', 'auto'] } 
         
                data={chartData!}
            /> 
        </Box>
    )
}

import { BigNumber } from 'ethers'

import { Box, makeStyles } from "@material-ui/core"
import { Token } from "../../../types/Token"
import { useSwapInfoArray } from "../../../hooks/usePool"
import { useFeedLatestPrice, useFeedLatestTimestamp } from "../../../hooks/useFeed"
import { roiDataForSwaps as poolRoiDataForSwaps } from "../../../utils/calculators/poolRoiCalculator"
import { round } from "../../../utils/formatter"
import { TimeSeriesLineChart } from "./TimeSeriesLineChart"

const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    }
}))


interface RoiChartProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}


export const RoiChart = ( { chainId, poolId, depositToken, investToken } : RoiChartProps ) => {

    const classes = useStyle()

    const swaps = useSwapInfoArray(chainId, poolId)
   
    const price = useFeedLatestPrice(chainId, poolId)
    const latestTimestamp = useFeedLatestTimestamp(chainId, poolId)
    const priceTimestamp = latestTimestamp && BigNumber.from(latestTimestamp).toNumber()
    const roiData = swaps && price && priceTimestamp && poolRoiDataForSwaps(swaps, price, priceTimestamp, depositToken, investToken)

    console.log(">>>> RoiChart: ", swaps, price, priceTimestamp, depositToken, investToken)

    // chart labels & data
    const label1 = `Strategy ROI`
    const label2 = `Buy & Hold ROI`

    // cumulative % of tokens traded

    const chartData = roiData?.map( (data: any) => {
        let record : any = {}
        record['time'] = data.date * 1000
 
        record[label1] = round(data.strategyROI)
        record[label2] = round(data.buyAndHoldROI)
        return record
    })


    return (
        <Box className={classes.container}>

            <Box className={classes.chart} >
                <TimeSeriesLineChart title="Strategy ROI vs Benchmark" 
                    label1={label1} 
                    label2={label2} 
                    data={chartData}  
                /> 
            </Box>

        </Box>
    )
}

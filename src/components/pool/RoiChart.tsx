import { BigNumber, ethers } from 'ethers'

import { Box, Typography, makeStyles } from "@material-ui/core"
import { Token } from "../../types/Token"
import { useSwapInfoArray } from "../../hooks/usePool"
import { usePoolSwapsInfoForIndex } from "../../hooks/useIndex"

import { useFeedLatestPrice, useFeedLatestTimestamp } from "../../hooks/useFeed"
import { roiDataForSwaps as poolRoiDataForSwaps } from "../../utils/calculators/poolRoiCalculator"
import { roiDataForSwaps as indexRoiDataForSwaps } from "../../utils/calculators/indexRoiCalculator"

import { fromDecimals, round } from "../../utils/formatter"
import { TimeSeriesLineChart } from "./TimeSeriesLineChart"
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { InvestTokens } from "../../utils/pools"


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

interface IndexRoiChartProps {
    chainId: number,
    indexId: string,
    depositToken: Token,
}


export const IndexRoiChart = ( { chainId, indexId, depositToken } : IndexRoiChartProps ) => {

    const classes = useStyle()


    const swapsInfo = usePoolSwapsInfoForIndex(chainId, indexId)
    const investTokens = InvestTokens(chainId)

    const roiData = swapsInfo && indexRoiDataForSwaps(swapsInfo as PoolTokensSwapsInfo[], depositToken, investTokens)

    console.log("IndexRoiChart", roiData )

    // chart labels & data
    const label1 = `Index ROI`
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
                {
                    chartData && 
                    <TimeSeriesLineChart title="Index ROI vs Benchmark" 
                        label1={label1} 
                        label2={label2} 
                        data={chartData}  
                    /> 
                }
  
            </Box>

        </Box>
    )

}

export const RoiChart = ( { chainId, poolId, depositToken, investToken } : RoiChartProps ) => {

    const classes = useStyle()

    const swaps = useSwapInfoArray(chainId, poolId)
   
    const price = useFeedLatestPrice(chainId, poolId)
    const latestTimestamp = useFeedLatestTimestamp(chainId, poolId)
    const priceFormatted = price && parseFloat(fromDecimals(BigNumber.from(price), 8, 2))
    const priceTimestamp = latestTimestamp && BigNumber.from(latestTimestamp).toNumber()
    const roiData = swaps && priceFormatted && latestTimestamp && poolRoiDataForSwaps(swaps, priceFormatted, priceTimestamp, depositToken, investToken)

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

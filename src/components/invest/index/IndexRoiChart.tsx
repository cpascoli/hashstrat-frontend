import { Box, makeStyles } from "@material-ui/core"
import { Token } from "../../../types/Token"
import { usePoolSwapsInfoForIndex } from "../../../hooks/useIndex"

import { roiDataForSwaps as indexRoiDataForSwaps } from "../../../utils/calculators/indexRoiCalculator"

import { round } from "../../../utils/formatter"
import { TimeSeriesLineChart } from "../pool/TimeSeriesLineChart"
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo"
import { InvestTokens } from "../../../utils/pools"


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

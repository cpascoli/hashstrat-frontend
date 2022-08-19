import { Box, Typography, makeStyles } from "@material-ui/core"
import { BigNumber } from "ethers"

import { usePoolModel } from "./PoolModel"

import { TitleValueBox } from "../TitleValueBox"
import { Token } from "../../types/Token"
import { fromDecimals, round } from "../../utils/formatter"
import { PoolAddress } from "../../utils/network"
import { useSwapInfoArray } from "../../hooks"
import { TimeSeriesAreaChart } from "./TimeSeriesAreaChart"

import { PoolInfo } from "../../utils/pools"

import { PieChartWithLabels } from "../shared/PieChartWithLabels"
import { Horizontal } from "../Layout"

import { useTotalPortfolioValue, useTotalDeposited, useTotalWithdrawn, 
         useTokenBalance, useInvestedTokenValue } from "../../hooks"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    portfolioInfo: {
        paddingTop: 20,
        minWidth: 340,
        margin: "auto",
        padding: theme.spacing(1)
    },
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    }
}))


interface PoolStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}



export const PoolStatsView = ( { chainId, poolId, depositToken, investToken } : PoolStatsViewProps ) => {

    const classes = useStyle()

    const { name, description, upkeep } = PoolInfo(chainId, poolId)
    const tokens =  [depositToken, investToken]
    const { poolInfo, portfolioInfo, chartData : assetAllocationChartData } = usePoolModel(chainId, poolId, tokens, depositToken)

    const totalDeposited = useTotalDeposited(chainId, poolId)
    const totalWithdrawn = useTotalWithdrawn(chainId, poolId)

    const formattedPortfolioValue = portfolioInfo.totalValue ? fromDecimals(portfolioInfo.totalValue, depositToken.decimals, 2) : undefined
    const formattedDeposited = (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn = (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""

    const swaps = useSwapInfoArray(chainId, poolId)
    const label1 = `${depositToken.symbol} Value %`
    const label2 = `${investToken.symbol} Value %`
  
    const assetValuePercChartData = swaps?.map( (data: any) => {
        const date = data.timestamp * 1000
        const price = parseFloat(fromDecimals(data.feedPrice, 8, 2))
        const asset1 = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const asset2 = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))

        let record : any = {}
        record['time'] = date
        record[label1] = round( 100 * asset1 / (asset1 + asset2 * price ))          // stable asset % 
        record[label2] = round( 100 * asset2 * price / (asset1 + asset2 * price ))  // risk asset % 
        return record
    })


    const assetViews = poolInfo.tokenInfoArray.map( token => {
        const balance = token.balance ?? BigNumber.from(0)
        const value = token.value ?? BigNumber.from(0)
        const decimals = token.decimals //    tokens.find( t => t.symbol === symbol)?.decimals ?? 2
        const accountBalanceFormatted = fromDecimals(balance, decimals, 4 ) as any
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any
        const valueFormatted = `${accountBalanceFormatted} (${accountValueFormatted} ${ depositToken.symbol }) `

        return { symbol: token.symbol, valueFormatted, balance, value }
    }).map( it => <TitleValueBox key={it.symbol} title={it.symbol} value={it.valueFormatted} /> )


    return (
        <Box className={classes.container}>
            <Box mb={2}>
                <Typography variant="h6" align="center"> {name}</Typography> 
                <Typography variant="body2" align="center"> {description}</Typography> 
            </Box>

            <Horizontal align="center" >
                <PieChartWithLabels { ...assetAllocationChartData } /> 
                <Box className={classes.portfolioInfo} >
                    { assetViews }
                    <TitleValueBox title="Total Asset Value" value={formattedPortfolioValue??""} suffix={depositToken.symbol} />
    
                    <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                    <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>
                    <TitleValueBox title="Chainlink Keeper" value={upkeep} />
                </Box>
            </Horizontal>
           

            <Typography align="center" style={{textTransform: "uppercase", marginTop: 20}}>
                Asset value %
            </Typography>

            <TimeSeriesAreaChart title="Asset Value %" 
                label1={label1} 
                label2={label2} 
                data={assetValuePercChartData}  
            /> 
        </Box>
    )
}

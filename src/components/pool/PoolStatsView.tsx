import { Box, Typography, makeStyles } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from "../../types/Token"
import { fromDecimals, round } from "../../utils/formatter"
import { PoolAddress } from "../../utils/network"
import { useSwapInfoArray } from "../../hooks"
import { TimeSeriesAreaChart } from "./TimeSeriesAreaChart"

import helperConfig from "../../helper-config.json"
import poolsInfo from "../../chain-info/pools.json"
import { PoolInfo } from "../../types/PoolInfo"

import { useTotalPortfolioValue, useTotalDeposited, useTotalWithdrawn, 
         useTokenBalance, useInvestedTokenValue } from "../../hooks"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


interface PoolStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}



export const PoolStatsView = ( { chainId, poolId, depositToken, investToken } : PoolStatsViewProps ) => {

    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]

    const infos = pools.filter( pool =>  { return (pool.poolId === poolId) })
    const { name, description } = infos[0]

    const poolAddress = PoolAddress(chainId, poolId)
    const totalPortfolioValue = useTotalPortfolioValue(chainId, poolId)
    const totalDeposited = useTotalDeposited(chainId, poolId)
    const totalWithdrawn = useTotalWithdrawn(chainId, poolId)
    const depositTokenBalance = useTokenBalance(chainId, poolId, depositToken.symbol, poolAddress)
    const investTokenBalance = useTokenBalance(chainId, poolId, investToken.symbol, poolAddress)
    const investedTokenValue = useInvestedTokenValue(chainId, poolId)

    const formattedPortfolioValue =  (totalPortfolioValue) ? fromDecimals(totalPortfolioValue, depositToken.decimals, 2) : ""
    const formattedDeposited =  (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn =  (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""
    const formattedDepositTokenBalance = (depositTokenBalance) ? fromDecimals(depositTokenBalance, depositToken.decimals, 2) : ""
    const formattedIinvestTokenBalance = (investTokenBalance) ? fromDecimals(investTokenBalance, investToken.decimals, 8) : ""
    const formattedInvestedTokenValue = (investedTokenValue) ? fromDecimals(investedTokenValue, depositToken.decimals, 2) : ""
    const investTokenValue = (formattedInvestedTokenValue)? parseFloat(formattedInvestedTokenValue) : undefined
    const totalPortfoliovalue = (formattedPortfolioValue)? parseFloat(formattedPortfolioValue) : undefined
    const investTokenWeight = (!investTokenValue || !totalPortfoliovalue) ? 0 : (totalPortfoliovalue > 0) ? Math.round(10000 * investTokenValue / totalPortfoliovalue) / 100 : undefined
    const depositTokenWeight = (investTokenWeight !== undefined) ? Math.round( 100 * (100 - investTokenWeight)) / 100 : undefined
  
    const asset1Formatted = (formattedIinvestTokenBalance) ? `${formattedIinvestTokenBalance} ${investToken.symbol}  (${investTokenWeight}%)` : `n/a ${investToken.symbol}`
    const asset2Formatted = (formattedDepositTokenBalance) ? `${formattedDepositTokenBalance} ${depositToken.symbol} (${depositTokenWeight}%)` : `n/a  ${depositToken.symbol}`

    const classes = useStyle()
    console.log(">>> investTokenBalance", investTokenBalance, investToken.symbol, formattedIinvestTokenBalance, asset1Formatted)

    const swaps = useSwapInfoArray(chainId, poolId)
    const label1 = `${depositToken.symbol} Value (USD)`
    const label2 = `${investToken.symbol} Value (USD)`
  
    const chartData = swaps?.map( (data: any) => {
        const date = data.timestamp * 1000
        const price = parseFloat(fromDecimals(data.feedPrice, 8, 2))
        const asset1 = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const asset2 = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))

        let record : any = {}
        record['time'] = date
        record[label1] = round(asset1)
        record[label2] = round(asset2 * price)
        return record
    })



    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="Pool Name" value={name} />
            
                <TitleValueBox title="Pool Value" value={formattedPortfolioValue} suffix={depositToken.symbol} />
                <TitleValueBox title="Asset 1" value={asset1Formatted} />
                <TitleValueBox title="Asset 2" value={asset2Formatted} />

                <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>
            </Box>

            <Typography align="center">
                Assets held in the pool over time
            </Typography>

            <TimeSeriesAreaChart title="Assets held in the pool over time" 
                label1={label1} 
                label2={label2} 
                data={chartData}  
            /> 

        </Box>
    )
}

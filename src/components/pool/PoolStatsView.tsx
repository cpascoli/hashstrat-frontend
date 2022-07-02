import { Box, Typography, makeStyles } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from  "../Main"
import { fromDecimals } from "../../utils/formatter"
import { PoolAddress } from "../../utils/network"
import { useSwapInfoArray } from "../../hooks"
import { TimeSeriesChart } from "./TimeSeriesChart"


import { useTotalPortfolioValue, useTotalDeposited, useTotalWithdrawn, 
         useTokenBalance, useInvestedTokenValue,
         useSwapCount } from "../../hooks"


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
    account: string,
    depositToken: Token,
    investToken: Token
}



export const PoolStatsView = ( { chainId, account, depositToken, investToken } : PoolStatsViewProps ) => {

    const poolAddress = PoolAddress(chainId)
    const totalPortfolioValue = useTotalPortfolioValue(chainId)
    const totalDeposited = useTotalDeposited(chainId)
    const totalWithdrawn = useTotalWithdrawn(chainId)
    const depositTokenBalance = useTokenBalance(chainId, depositToken.symbol, poolAddress)
    const investTokenBalance = useTokenBalance(chainId, investToken.symbol, poolAddress)
    const investedTokenValue = useInvestedTokenValue(chainId)
    const swapCount = useSwapCount(chainId)

    const formattedPortfolioValue =  (totalPortfolioValue) ? fromDecimals(totalPortfolioValue, depositToken.decimals, 2) : ""
    const formattedDeposited =  (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn =  (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""
    const formattedDepositTokenBalance = (depositTokenBalance) ? fromDecimals(depositTokenBalance, depositToken.decimals, 2) : ""
    const formattedIinvestTokenBalance = (investTokenBalance) ? fromDecimals(investTokenBalance, investToken.decimals, 6) : ""
    const formattedInvestedTokenValue = (investedTokenValue) ? fromDecimals(investedTokenValue, depositToken.decimals, 2) : ""
    const investTokenValue = (formattedInvestedTokenValue)? parseFloat(formattedInvestedTokenValue) : undefined
    const totalPortfoliovalue = (formattedPortfolioValue)? parseFloat(formattedPortfolioValue) : undefined
    const investTokenWeight = (investTokenValue && totalPortfoliovalue && totalPortfoliovalue > 0) ? Math.round(10000 * investTokenValue / totalPortfoliovalue) / 100 : undefined
    const depositTokenWeight = (investTokenWeight) ? Math.round( 100 * (100 - investTokenWeight)) / 100 : undefined
  
    const asset1Formatted = (formattedIinvestTokenBalance && investTokenWeight) ? `${formattedIinvestTokenBalance} ${investToken.symbol}  (${investTokenWeight}%)` : `0 ${investToken.symbol}`
    const asset2Formatted = (formattedDepositTokenBalance && depositTokenWeight) ? `${formattedDepositTokenBalance} ${depositToken.symbol} (${depositTokenWeight}%)` : `0  ${depositToken.symbol}`

    const classes = useStyle()


    const swaps = useSwapInfoArray(chainId)
    const label1 = `${depositToken.symbol}`
    const label2 = `${investToken.symbol}`
  
    const chartData = swaps?.map( (data: any) => {
        const date = data.timestamp * 1000
        const price = parseFloat(fromDecimals(data.feedPrice, 8, 2))
        const asset1 = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const asset2 = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))

        console.log("info >>>: ", price, asset1, asset2)

        let record : any = {}
        record['time'] = date
        record[label1] = asset1
        record[label2] = asset2 * price
        return record
    })



    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="Pool Value" value={formattedPortfolioValue} suffix={depositToken.symbol} />
                <TitleValueBox title="Asset 1" value={asset1Formatted} />
                <TitleValueBox title="Asset 2" value={asset2Formatted} />

                <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>

                <TitleValueBox title="Swap Count" value={swapCount} suffix={''}/>
            </Box>



            <Typography align="center">
                Assets held in the pool over time
            </Typography>

            <TimeSeriesChart title="Assets held in the pool over time" 
                label1={label1} 
                label2={label2} 
                data={chartData}  
            /> 

        </Box>
    )
}

import { Box, makeStyles } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from  "../Main"
import { fromDecimals } from "../../utils/formatter"
import { useTotalPortfolioValue, useTotalDeposited, useTotalWithdrawn,
         useDepositTokenBalance, useInvestTokenBalance, useInvestedTokenValue  } from "../../hooks"




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

    const totalPortfolioValue = useTotalPortfolioValue(chainId)
    const totalDeposited = useTotalDeposited(chainId)
    const totalWithdrawn = useTotalWithdrawn(chainId)
    const depositTokenBalance = useDepositTokenBalance(chainId)
    const investTokenBalance = useInvestTokenBalance(chainId)
    const investedTokenValue = useInvestedTokenValue(chainId)
    
    const formattedPortfolioValue =  (totalPortfolioValue) ? fromDecimals(totalPortfolioValue, depositToken.decimals, 2) : ""
    const formattedDeposited =  (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn =  (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""
    const formattedDepositTokenBalance = (depositTokenBalance) ? fromDecimals(depositTokenBalance, depositToken.decimals, 2) : ""
    const formattedIinvestTokenBalance = (investTokenBalance) ? fromDecimals(investTokenBalance, investToken.decimals, 6) : ""
    const formattedInvestedTokenValue = (investedTokenValue) ? fromDecimals(investedTokenValue, depositToken.decimals, 2) : ""
    const investTokenValue = (formattedInvestedTokenValue)? parseFloat(formattedInvestedTokenValue) : undefined
    const totalPortfoliovalue = (formattedPortfolioValue)? parseFloat(formattedPortfolioValue) : undefined
    const investTokenWeight = (investTokenValue && totalPortfoliovalue && totalPortfoliovalue > 0) ? Math.round(10000 * investTokenValue / totalPortfoliovalue) / 100 : undefined
    const depositTokenWeight = (investTokenWeight) ? 100 - investTokenWeight : undefined
  
    const asset1Formatted = (formattedIinvestTokenBalance && investTokenWeight) ? `${formattedIinvestTokenBalance} ${investToken.symbol}  (${investTokenWeight}%)` : ''
    const asset2Formatted = (formattedDepositTokenBalance && depositTokenWeight) ? `${formattedDepositTokenBalance} ${depositToken.symbol} (${depositTokenWeight}%)` : ''

    const classes = useStyle()

    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="Pool Value" value={formattedPortfolioValue} suffix={depositToken.symbol} />
                <TitleValueBox title="Asset 1" value={asset1Formatted} />
                <TitleValueBox title="Asset 2" value={asset2Formatted} />

                <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>
            </Box>
        </Box>
    )
}

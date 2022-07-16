import { Box, makeStyles } from "@material-ui/core"

import { TitleValueBox } from "../TitleValueBox"
import { Token } from  "../../types/Token"
import { usePortfolioValue, useGetDeposits, useGetWithdrawals } from "../../hooks"
import { fromDecimals } from "../../utils/formatter"


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


interface MyStatsViewProps {
    chainId: number,
    poolId: string,
    account: string,
    depositToken: Token
}


export const MyStatsView = ( { chainId, poolId, account, depositToken } : MyStatsViewProps ) => {

    const portfolioValue = usePortfolioValue(chainId, poolId, account) // BigNumber.from("123000000" )

    const deposits = useGetDeposits(chainId, poolId, account)
    const withdrawals = useGetWithdrawals(chainId, poolId, account)
    
    const formattedPortfolioValue =  (portfolioValue) ? fromDecimals(portfolioValue, depositToken.decimals, 2) : ""
    const formattedDeposits =  (deposits) ? fromDecimals(deposits, depositToken.decimals, 2) : ""
    const formattedWithdrawals =  (withdrawals) ? fromDecimals(withdrawals, depositToken.decimals, 2) : ""
    const roiFormatted = (portfolioValue && deposits && withdrawals && parseFloat(formattedDeposits) > 0) ? String(Math.round( 10000 * (parseFloat(formattedWithdrawals) + parseFloat(formattedPortfolioValue) - parseFloat(formattedDeposits)) / parseFloat(formattedDeposits)) / 100 ) : "0"

    const classes = useStyle()

    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="My Portfolio Value" value={formattedPortfolioValue} suffix={depositToken.symbol} />
                <TitleValueBox title="My Deposits" value={formattedDeposits} suffix={depositToken.symbol} />
                <TitleValueBox title="My Withdrawals" value={formattedWithdrawals} suffix={depositToken.symbol} />
                <TitleValueBox title="ROI" value={roiFormatted} suffix="%" />
            </Box>
        </Box>
    )
}


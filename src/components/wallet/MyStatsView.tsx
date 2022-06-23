import { Box, makeStyles } from "@material-ui/core"

import { TitleValueBox } from "../TitleValueBox"
import { Token } from  "../Main"
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
    account: string,
    depositToken: Token
}


export const MyStatsView = ( { chainId, account, depositToken } : MyStatsViewProps ) => {

    const portfolioValue = usePortfolioValue(chainId, account) // BigNumber.from("123000000" )

    const deposits = useGetDeposits(chainId, account)
    const withdrawals = useGetWithdrawals(chainId, account)
    
    const formattedPortfolioValue =  (portfolioValue) ? fromDecimals(portfolioValue, depositToken.decimals, 2) : ""
    const formattedDeposits =  (deposits) ? fromDecimals(deposits, depositToken.decimals, 2) : ""
    const formattedPWithdrawals =  (withdrawals) ? fromDecimals(withdrawals, depositToken.decimals, 2) : ""

    const classes = useStyle()

    const roi =  Math.round( 10000 * (parseFloat(formattedPWithdrawals) + parseFloat(formattedPortfolioValue) - parseFloat(formattedDeposits)) / parseFloat(formattedDeposits)) / 100;

    const roiFormatted = String(roi)

    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="My Portfolio Value" value={formattedPortfolioValue} suffix={depositToken.symbol} />
                <TitleValueBox title="My Deposits Value" value={formattedDeposits} suffix={depositToken.symbol} />
                <TitleValueBox title="My Withdrawals" value={formattedPWithdrawals} suffix={depositToken.symbol} />
                <TitleValueBox title="My ROI" value={roiFormatted} suffix="%" />
            </Box>
        </Box>
    )
}


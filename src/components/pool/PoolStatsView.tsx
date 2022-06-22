import { Box, makeStyles } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from  "../Main"
import { useTotalPortfolioValue, useTotalDeposited, useTotalWithdrawn } from "../../hooks"
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


interface PoolStatsViewProps {
    chainId: number,
    account: string,
    depositToken: Token
}


export const PoolStatsView = ( { chainId, account, depositToken } : PoolStatsViewProps ) => {

    const ttalPortfolioValue = useTotalPortfolioValue(chainId, account)
    const totalDeposited = useTotalDeposited(chainId, account)
    const totalWithdrawn = useTotalWithdrawn(chainId, account)


    const formattedPortfolioValue =  (ttalPortfolioValue) ? fromDecimals(ttalPortfolioValue, depositToken.decimals, 2) : ""
    const formattedDeposited =  (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn =  (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""
    
    const classes = useStyle()

    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="Pool Value" value={formattedPortfolioValue} tokenSymbol={depositToken.symbol} border={false} />
                <TitleValueBox title="Total Deposited" value={formattedDeposited} tokenSymbol={depositToken.symbol} border={false} />
                <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} tokenSymbol={depositToken.symbol} border={false} />
            </Box>
        </Box>
    )
}

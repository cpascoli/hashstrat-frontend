import { makeStyles, Box, Divider, Typography, Button, Link } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { fromDecimals, round } from "../../utils/formatter"

import networksConfig from "../../config/networks.json"
import { PoolInfo } from "../../utils/pools"

import { useTotalPortfolioValue, useTokenBalance, useTokenTotalSupply } from "../../hooks"
import { Token } from "../../types/Token"


interface PoolSummaryViewProps {
    chainId: number,
    poolId: string,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },

    pool: {
        // padding: theme.spacing(2),
        // border: `1px solid ${theme.palette.secondary.main}`,
        // borderRadius: 12,
        width: 320,
        color: theme.palette.text.secondary,
        textTransform: "none"
    }
}))


export const PoolSummaryView = ({ chainId, account, poolId, depositToken } : PoolSummaryViewProps) => {
    const classes = useStyles()

    const { name, description } = PoolInfo(chainId, poolId)
 
    const totalPortfolioValue = useTotalPortfolioValue(chainId, poolId)
    const formattedPortfolioValue =  (totalPortfolioValue) ? fromDecimals(totalPortfolioValue, depositToken.decimals, 2) : ""

    const balance = useTokenBalance(chainId, poolId, "pool-lp", account)
    const totalSupply = useTokenTotalSupply(chainId, poolId, "pool-lp")

    const lpPerc =  (balance && totalSupply > 0) ? balance * 10000 / totalSupply : 0
    const lpPercFormatted = `${round( lpPerc / 100)}`

    return (
        <div className={classes.container} >
                <Link href={`/pools/${poolId}`} style={{ textDecoration: 'none' }} > 
                    <Button variant="outlined" color="primary" >
                        <Box className={classes.pool}>
                            <Typography variant="h5" align="center"> {name} </Typography>
                            <Typography variant="body2"> {description} </Typography>

                            <Divider variant="fullWidth"  style={{marginTop: 20, marginBottom: 20}} />

                            <TitleValueBox title="Total Value" value={formattedPortfolioValue} suffix={depositToken.symbol} mode="small" />
                            <TitleValueBox title="My Share" value={lpPercFormatted} suffix="%" mode="small" />

                        </Box>
                    </Button>
                </Link>
        </div>
    )
}



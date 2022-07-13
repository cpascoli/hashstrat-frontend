import { makeStyles, Box, Divider, Typography, Button, Link } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { fromDecimals, round } from "../../utils/formatter"

import helperConfig from "../../helper-config.json"
import { PoolInfo } from "../../types/PoolInfo"
import poolsInfo from "../../chain-info/pools.json"
import { useTotalPortfolioValue, useTokenBalance, useTokenTotalSupply } from "../../hooks"
import { Token } from "../../types/Token"


interface PoolSummaryViewProps {
    chainId: number,
    poolId: string,
    account: string,
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
        // maxWidth: 300,
        color: theme.palette.text.secondary,
        textTransform: "none"
    }
}))


export const PoolSummaryView = ({ chainId, account, poolId, depositToken } : PoolSummaryViewProps) => {
    const classes = useStyles()

    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]
    const pools : Array<PoolInfo> = poolsInfo[networkName as keyof typeof poolsInfo]
    const infos = pools.filter( pool =>  { return (pool.poolId === poolId) })
    const { name, description } = infos[0]
 
    const totalPortfolioValue = useTotalPortfolioValue(chainId, poolId)
    const formattedPortfolioValue =  (totalPortfolioValue) ? fromDecimals(totalPortfolioValue, depositToken.decimals, 2) : ""

    const balance = useTokenBalance(chainId, poolId, "pool-lp", account)
    const totalSupply = useTokenTotalSupply(chainId, poolId, "pool-lp")

    const lpPerc =  (balance && totalSupply > 0) ? balance * 10000 / totalSupply : 0
    const lpPercFormatted = `${round( lpPerc / 100)}`

    console.log("PoolSummaryView poolId >>> ", poolId, "balance: ", balance)

    return (
        <div className={classes.container} >
                <Link href={`/pools/${poolId}`} style={{ textDecoration: 'none' }} > 
                    <Button variant="outlined" color="primary" >
                        <Box className={classes.pool}>
                            <Typography variant="h5" align="center"> {name} </Typography>
                            <Typography variant="body2"> {description} </Typography>

                            <Divider style={{marginTop: 20, marginBottom: 20}} />

                            <TitleValueBox title="Pool Value" value={formattedPortfolioValue} suffix={depositToken.symbol} mode="small" />
                            <TitleValueBox title="My Value" value={lpPercFormatted} suffix="%" mode="small" />

                        </Box>
                    </Button>
                </Link>
        </div>
    )
}



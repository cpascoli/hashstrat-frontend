import { makeStyles, Box, Divider, Typography, Button, Link } from "@material-ui/core"
import { utils } from "ethers"

import { TitleValueBox } from "../TitleValueBox"
import { fromDecimals, round } from "../../utils/formatter"
import { PoolInfo } from "../../utils/pools"
import { useTokenBalance, useTokenTotalSupply } from "../../hooks"
import { useMultiPoolValue } from "../../hooks/useIndex"
import { Token } from "../../types/Token"


interface IndexSummaryViewProps {
    chainId: number,
    poolId: string,
    account?: string,
    depositToken: Token,
}

const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },

    pool: {
        width: 320,
        color: theme.palette.text.secondary,
        textTransform: "none"
    }
}))


export const IndexSummaryView = ({ chainId, account, poolId, depositToken } : IndexSummaryViewProps) => {
    const classes = useStyles()
    
    const { name, description } = PoolInfo(chainId, poolId)
 
    const multiPoolValue = useMultiPoolValue(chainId, poolId)

    const balance = useTokenBalance(chainId, poolId, "pool-lp", account)
    const totalSupply = useTokenTotalSupply(chainId, poolId, "pool-lp")

    const lpPerc =  (balance && totalSupply > 0) ? balance * 10000 / totalSupply : 0
    const lpPercFormatted = `${round( lpPerc / 100)}`

    const multiPoolValueFormatted =  (multiPoolValue !== undefined) ? fromDecimals(multiPoolValue, depositToken.decimals, 2) : ""


    return (
        <div className={classes.container} >
                <Link href={`/indexes/${poolId}`} style={{ textDecoration: 'none' }} > 
                    <Button variant="outlined" color="primary" >
                        <Box className={classes.pool}>
                            <Typography variant="h5" align="center"> {name} </Typography>
                            <Typography variant="body2"> {description} </Typography>

                            <Divider variant="fullWidth"  style={{marginTop: 20, marginBottom: 20}} />

                            <TitleValueBox title="Total Value" value={ utils.commify(multiPoolValueFormatted) } suffix={depositToken.symbol} mode="small" />
                            <TitleValueBox title="My Share" value={lpPercFormatted} suffix="%" mode="small" />
                        </Box>
                    </Button>
                </Link>
        </div>
    )
}



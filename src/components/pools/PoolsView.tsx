import { Link as RouterLink } from "react-router-dom"
import { Box, Divider, makeStyles, Typography, Link } from "@material-ui/core"

import { usePoolsInfo } from "../dashboard/DashboadModel"
import { InvestTokens } from "../../utils/pools"
import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"
import { PoolIds } from "../../utils/pools";
import { PoolSummary } from "../shared/PoolSummary"


interface PoolsViewProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))


export const PoolsView = ({ chainId, account, depositToken } : PoolsViewProps) => {

    const classes = useStyles()

    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]
    const poolsInfo = usePoolsInfo(chainId, PoolIds(chainId), tokens, account)

    const poolsView = poolsInfo.map( pool => {
        return (
            <div key={pool.poolId}>
                <PoolSummary chainId={chainId} poolId={pool.poolId} account={account} depositToken={depositToken} tokens={pool.tokenInfoArray} />
            </div>
        )
    })


    return (
        <Box mt={2}>
      
            <Divider variant="middle"  style={{marginTop: 20, marginBottom: 0}}/>
            <div className={classes.container}> 
                <Typography>
                   HashStrat Pools are autonomous crypto-funds running on the blockchain. <br/>
                   Each Pool holds 2 assets, a stable asset ({depositToken.symbol}) and a risk asset (BTC or ETH) and 
                   it's configured with a <Link component={RouterLink} to="/strategies" >Strategy</Link> to trade between them.
                   <br/>
                   You can deposit {depositToken.symbol} tokens into any pool with the goal to see your capital grow over time.
                </Typography>   
            </div>

            <Horizontal align="center"> 
                  { poolsView }
            </Horizontal>
        </Box>
    )
}



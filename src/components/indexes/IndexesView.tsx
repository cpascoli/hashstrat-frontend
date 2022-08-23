import { Box, Divider, makeStyles, Typography, Link } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"
import { useIndexesInfo } from "../dashboard/DashboadModel"
import { InvestTokens } from "../../utils/pools"
import { IndexesIds } from "../../utils/pools";
import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"

import { PoolSummary } from "../shared/PoolSummary"


interface IndexesViewProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))


export const IndexesView = ({ chainId, account, depositToken } : IndexesViewProps) => {

    const classes = useStyles()
    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]
    const indexes = useIndexesInfo(chainId, IndexesIds(chainId), tokens, account)

    const indexexView = indexes.map( index => {
        return (
            <div key={index.poolId}>
                <PoolSummary chainId={chainId} poolId={index.poolId} account={account} depositToken={depositToken} tokens={index.tokenInfoArray} />
            </div>
        )
    })

    return (
        <Box mt={2}>

            <Divider variant="middle"  style={{marginTop: 20, marginBottom: 0}}/>
            <div className={classes.container}> 
                <Typography >
                    HashStrat Indexes represent a weighted basket of <Link component={RouterLink} to="/pools" style={{ textDecoration: 'none' }} >HashSttap Pools </Link> and 
                    their associated <Link component={RouterLink} to="/strategies" >Strategies</Link>. <br/>
                    Indexes allow to easily invest into a combination of strategies and assets for improved risk/return profiles.
                </Typography>
            </div>

            <Horizontal align="center"> 
                  { indexexView }
            </Horizontal>
        </Box>
    )
}



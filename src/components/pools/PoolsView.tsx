import { useState } from "react";

import { Box, Divider, makeStyles, Typography, Link } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import { PoolSummaryView } from "./PoolSummaryView"
import { Horizontal } from "../Layout"

import networksConfig from "../../config/networks.json"
import { PoolInfo } from "../../types/PoolInfo"
import poolsInfo from "../../config/pools.json"
import { Token } from "../../types/Token"

import { ExpandMore } from "@material-ui/icons"

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

    const [expanded, setExpanded] = useState<boolean>(false);

    const classes = useStyles()
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const pools : Array<PoolInfo> = poolsInfo[networkName as keyof typeof poolsInfo] as any

    const poolsView = pools.map( pool => {
        return (
            <div key={pool.poolId}>
                <PoolSummaryView chainId={chainId} poolId={pool.poolId} account={account} depositToken={depositToken} />
            </div>
        )
    })


    return (
        <Box mt={2}>
      
            <Divider variant="middle"  style={{marginTop: 20, marginBottom: 0}}/>
            <div className={classes.container}> 
                <Typography>
                   HashStrat Pools are automated crypto-funds running on the blockchain. <br/>
                   Each Pool holds 2 assets, one stable asset ({depositToken.symbol}) and one risk asset (BTC or ETH) and 
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



import { useState } from "react";

import { Box, Divider, makeStyles, Typography, Link } from "@material-ui/core"
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

    console.log("PoolsView chainId >>> ", chainId)
    const [expanded, setExpanded] = useState<boolean>(false);

    const handleChange = () => {
        console.log("handleChange", expanded)
        setExpanded(!expanded);
    };


    const classes = useStyles()
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const pools : Array<PoolInfo> = poolsInfo[networkName as keyof typeof poolsInfo]

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
                <Typography >
                   Pools are crypto-funds where you deposit {depositToken.symbol} tokens and let the pool's strategy invest into a risk asset (BTC or ETH).
                </Typography>
            </div>

            <Horizontal align="center"> 
                  { poolsView }
            </Horizontal>
        </Box>
    )
}



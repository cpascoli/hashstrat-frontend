import { useState } from "react";

import { Box, Divider, makeStyles, Typography, Link } from "@material-ui/core"
import { PoolSummaryView } from "./PoolSummaryView"

import { Horizontal } from "../Layout"

import helperConfig from "../../helper-config.json"
import { PoolInfo } from "../../types/PoolInfo"
import poolsInfo from "../../chain-info/pools.json"
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
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]
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

                { (chainId == 137) && 
                    <Typography variant="body1" style={{marginTop:10}}>
                        You can get {depositToken.symbol} tokens directly on Polygon using <Link href="https://quickswap.exchange/#/swap" target="_blank"> QuickSwap &gt; Buy </Link>,
                        or transfer {depositToken.symbol} from Ethereum to Polygon via the <Link href="https://wallet.polygon.technology/bridge" target="_blank">Polygon Bridge</Link>
                    </Typography> 
                }
            </div>

            <Horizontal align="center"> 
                  { poolsView }
            </Horizontal>
        </Box>
    )
}



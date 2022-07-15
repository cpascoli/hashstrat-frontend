import { useState } from "react";

import { Box, Divider, makeStyles, Typography, Accordion, AccordionDetails, AccordionSummary, Paper } from "@material-ui/core"
import { PoolSummaryView } from "./PoolSummaryView"

import { Horizontal } from "../Layout"

import helperConfig from "../../helper-config.json"
import { PoolInfo } from "../../types/PoolInfo"
import poolsInfo from "../../chain-info/pools.json"
import { Token } from "../../types/Token"

import { ExpandMore } from "@material-ui/icons"

interface PoolsViewProps {
    chainId: number,
    account: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        flexFlow: "row wrap",
        columnGap: "1rem",
        rowGap: "1rem",
    }
}))


export const PoolsView = ({ chainId, account, depositToken } : PoolsViewProps) => {

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
            <Accordion expanded={expanded} onChange={handleChange}>
                
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} >
                     What are HashStrat Pools?
                    </Typography>
                    
                </AccordionSummary>

                <AccordionDetails >
                    <Typography variant="body2" >
                        HashStrat Pools are crypto-funds automated on-chain.
                        <br/> <br/>
                        Users deposit capital into a Pool in the form of stable crypto-assets (e.g. USDC) to be invested by an on-chain Strategy.
                        <br/>
                        Strategies can allocate capital to risk assets (e.g. BTC or ETH) and can manage risk trading back into stable assets.
                        <br/>
                        Different Strategies offer different risk/reward characteristics but all aim to grow their Pool value over time.
                        <br/><br/>
                        When users deposit funds into a Pool, they receive "LP Tokens" that represent ownership of their share of the Pool.
                        Users can withdraw their funds at any time by returning their "LP Tokens".
                    
                    </Typography>
                </AccordionDetails>
            </Accordion>
      
            <Divider variant="middle"  style={{marginTop: 20, marginBottom: 0}}/>

            <Typography className={classes.container}>
                Choose a pool and deposit {depositToken.symbol} tokens to grow your capital over time.
            </Typography>

            <Horizontal align="center"> 
                  { poolsView }
            </Horizontal>
        </Box>
    )
}



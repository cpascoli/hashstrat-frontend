import React, { useState } from "react";

import { Divider, makeStyles, Typography, Accordion, AccordionDetails, AccordionSummary, Paper } from "@material-ui/core"
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
        <div>
            <Accordion expanded={expanded} onChange={handleChange}>
                
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} >
                     Pools are unstoppable crypto-funds automated on-chain
                    </Typography>
                    
                </AccordionSummary>

                <AccordionDetails >
                    <Typography variant="body2" >
               
                        Pools receive capital in the form of a stable asset (e.g. USDC) and manage it through on-chain Strategies.
                        <br/>
                        Strategies can allocate capital to a risk asset  ad can perform trades between stable and risk assets.
                        <br/>
                        Different Strategies have different risk/reward characteristics but all aim to grow the Pool value over time.
                        <br/><br/>
                        When users deposit funds into a Pool, they receive "LP Tokens" that represent their share of the Pool value.
                        
                        Users can withdraw their funds from the pool at any time by returning their "LP Tokens".
                      
                    </Typography>
                </AccordionDetails>
            </Accordion>
      
            <Divider style={{marginTop: 10, marginBottom: 10}}/>

            <Typography className={classes.container}>
                Choose a pool and deposit {depositToken.symbol} tokens to grow your capital over time.
            </Typography>

            <Horizontal> 
                  { poolsView }
            </Horizontal>
        </div>
    )
}



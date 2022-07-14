import React, { useState } from "react";

import { Divider, makeStyles, Typography, Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core"
import { PoolSummaryView } from "./PoolSummaryView"

import { Horizontal } from "../Layout"

import helperConfig from "../../helper-config.json"
import { PoolInfo } from "../../types/PoolInfo"
import poolsInfo from "../../chain-info/pools.json"
import { Token } from "../../types/Token"

import { InfoRounded, ExpandMore} from "@material-ui/icons"

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
        <div className={classes.container}>
              
            <Accordion expanded={expanded} onChange={handleChange}>
                
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography variant="body1" >
                            <strong> HashStrat Pools  </strong> are automated, on-chain, crypto-funds 
                    </Typography>
                    
                </AccordionSummary>

                <AccordionDetails >
                    <Typography variant="body2" >
                        Pools receive capital from users in the form of stable asset (e.g. USDC) and manage it through dedicated Strategies.
                        <br/><br/>
                        <strong>Strategies</strong> are responsible to allocate capital to a risk asset (e.g. BTC, ETH) 
                        and can perform trades between stable and risk assets.
                        Different Strategies have different risk/reward characteristics but all aim to grow the Pool value over time.
                        <br/><br/>
                        Users that deposit funds into a Pool receive "LP Tokens" that represent their share of the value held in the Pool.
                        <br/>
                        Users can withdraw their funds from the pool at any time by returning their "LP Tokens".
                    </Typography>
                </AccordionDetails>
            </Accordion>
      
            { poolsView }

        </div>
    )
}



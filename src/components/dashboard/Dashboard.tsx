

import React, { useState, useEffect } from "react"

import {  Polygon } from '@usedapp/core';


import { Box, makeStyles, Tab, Link, Typography  } from "@material-ui/core"
import { TabContext, TabList, TabPanel, AlertTitle } from "@material-ui/lab"

import { Token } from "../../types/Token"

import { FundAssetsSummary } from "./FundAssetsSummary"
import { MyPortfolioAssetsSummary } from "./MyPortfolioAssetsSummary"
import { StyledAlert } from "../shared/StyledAlert"
import { ConnectButton } from "../../main/ConnectButton"
import { Horizontal } from '../Layout';

import { ConnectAccountHelper } from "./ConnectAccountHelper"


interface DashboardProps {
    chainId: number,
    connectedChainId: number | undefined,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: 2,
        marginBottom: 10,
    },
    tickers: {
        maxWidth: 800,
        margin: "auto"
    },
    tabList: { 
        maxWidth: 800,
        padding: 0,
        margin: "auto",
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    tab: { 
        maxWidth: 800,
        padding: 0,
        margin: "auto",
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    }
}))



export const Dashboard = ({ chainId, connectedChainId, depositToken, investTokens, account } : DashboardProps) => {
    
    const wrongNetwork = connectedChainId !== Polygon.chainId

    const selIdx =  0 //account === undefined ? 1 : 0
    const classes = useStyles()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(selIdx)
   
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleDidLoad = (didLoad: boolean ) => {
        console.log("Dashboad - portfolio did load", didLoad)
    }

    return (
        <div className={classes.container} >
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                    <Tab label="My Portfolio" value="0" key={0} />
                    <Tab label="HashStrat" value="1" key={1}  />
                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>

                { (account === undefined || wrongNetwork) &&
                    <ConnectAccountHelper connectedChainId={connectedChainId} />
                }

                { account && !wrongNetwork &&
                    <MyPortfolioAssetsSummary chainId={chainId} connectedChainId={connectedChainId} depositToken={depositToken} investTokens={investTokens} account={account} onPortfolioLoad={(handleDidLoad)} /> 
                }
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <FundAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} />
                </TabPanel>
            </TabContext>
        </div>
    )

}





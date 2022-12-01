

import React, { useState } from "react"

import { Box, makeStyles, Tab, Typography, } from "@material-ui/core"
import { TabContext, TabList, TabPanel, Skeleton } from "@material-ui/lab"

import { Token } from "../../types/Token"

import { FundAssetsSummary } from "./FundAssetsSummary"
import { MyPortfolioAssetsSummary } from "./MyPortfolioAssetsSummary"
import { Tickers } from "./Tickers"


interface DashboardProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: 2,
        marginBottom: 2,
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



export const Dashboard = ({ chainId, depositToken, investTokens, account } : DashboardProps) => {
    
    const selIdx =  0 //account === undefined ? 1 : 0
    const classes = useStyles()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(selIdx)
   
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }


    return (
        <div className={classes.container} >
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                      <Tab label="My Assets" value="0" key={0} />
                      <Tab label="HashStrat" value="1" key={1}  />
                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                 { account  &&  <MyPortfolioAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} account={account} /> }
                 { !account &&  <Box style={{paddingTop: 80, paddingBottom: 80}}>
                    <Typography align="center" > Connect an account to access your assets </Typography>
                </Box>  }
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <FundAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} />
                </TabPanel>
            </TabContext>
        </div>
    )

}







import React, { useState } from "react"

import { makeStyles, Tab, Typography, } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { Token } from "../../types/Token"

import { FundAssetsSummary } from "./FundAssetsSummary"
import { MyPortfolioAssetsSummary } from "./MyPortfolioAssetsSummary"


interface DashboardProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: 2,
    },
    tabList: { 
        padding: 0,
        margin: "auto",
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    tab: { 
          padding: 0,
          margin: "auto",
          paddingTop: 20,
          backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    }
}))



export const Dashboard = ({ chainId, depositToken, investTokens, account} : DashboardProps) => {
    
    const classes = useStyles()
    // const tokens = [depositToken, ...investTokens]

    console.log("Dashboard - account", account)


    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
   

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

 

    return (
        <div className={classes.container}>

        <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                      <Tab label="My Assets" value="0" key={0} />
                      <Tab label="HashStrat" value="1" key={1}  />

                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                    <MyPortfolioAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} account={account} />
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <FundAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} />
                </TabPanel>

                
            </TabContext>


        </div>
    )

}





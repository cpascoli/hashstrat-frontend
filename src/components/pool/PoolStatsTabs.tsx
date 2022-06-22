import React, { useState, useEffect } from "react"
import { Box, Tab, Paper, Link, makeStyles } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"
import { TabContext, TabList, TabPanel, Alert, AlertTitle, Color as Severity } from "@material-ui/lab"

import { Token } from  "../Main"
import { usePortfolioValue } from "../../hooks"
import { fromDecimals } from "../../utils/formatter"
import { MyStatsView } from "../wallet/MyStatsView"
import { PoolStatsView } from "./PoolStatsView"


interface StatsTabsProps {
    chainId: number,
    account: string,
    depositToken: Token
}

const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    tabList: { 
        padding: 0,
        margin: "auto",
        maxWidth: 640,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    tab: { 
          padding: 0,
          maxWidth: 640,
          margin: "auto",
          paddingTop: 20,
          backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


const TabContent = styled(Paper)(({ theme }) => ({
    // padding: theme.spacing(2),
    textAlign: 'center',
    width: "100%",
}));


interface TabPanelProps {
    formType?: string,
    chainId: number,
    token: Token;
}
  

export const PoolStatsTabs = ( { chainId, account, depositToken } : StatsTabsProps ) => {

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const portfolioValue = usePortfolioValue(chainId, account) // BigNumber.from("123000000" )
    const formattedPortfolioValue =  (portfolioValue) ? fromDecimals(portfolioValue, depositToken.decimals, 2) : ""
    const classes = useStyle()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <Box className={classes.container} my={4}>
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                    <Tab label="Pool Stats" value="0" key={0} />
                    <Tab label="My Stats" value="1" key={1} />
                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                        <PoolStatsView chainId={chainId} account={account} depositToken={depositToken} />
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                        <MyStatsView chainId={chainId} account={account} depositToken={depositToken} />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default PoolStatsTabs

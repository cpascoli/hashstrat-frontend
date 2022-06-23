import React, { useState } from "react"
import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { Token } from  "../Main"
import { MyStatsView } from "../wallet/MyStatsView"
import { PoolStatsView } from "./PoolStatsView"


interface StatsTabsProps {
    chainId: number,
    account: string,
    depositToken: Token,
    investToken: Token,
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
}))



export const PoolStatsTabs = ( { chainId, account, depositToken, investToken } : StatsTabsProps ) => {

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
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
                        <PoolStatsView chainId={chainId} account={account} depositToken={depositToken} investToken={investToken} />
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                        <MyStatsView chainId={chainId} account={account} depositToken={depositToken} />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default PoolStatsTabs

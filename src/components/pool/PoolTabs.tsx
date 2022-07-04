import React, { useState } from "react"
import { Box, Tab, makeStyles, Divider } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { Token } from  "../Main"
import { MyStatsView } from "../wallet/MyStatsView"
import { PoolStatsView } from "./PoolStatsView"
import { TradesView } from "./TradesView"
import { WalletTabs } from "../wallet/WalletTabs"
import { StrategyInfoView } from "./StrategyInfoView"
 
interface PoolTabsProps {
    chainId: number,
    account: string,
    tokens: Array<Token>,
    investToken: Token,
}

const useStyle = makeStyles( theme => ({
    container: {
        marginTop: 22,
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



export const PoolTabs = ( { chainId, account, tokens, investToken } : PoolTabsProps ) => {

    const depositToken = tokens[0]

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const classes = useStyle()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <Box className={classes.container}>
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                    <Tab label="My Assets" value="0" key={0} />
                    <Tab label="Pool Info" value="1" key={1} />
                    <Tab label="Pool Trades" value="2" key={2} />
                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                    <MyStatsView chainId={chainId} account={account} depositToken={depositToken} />
                    <WalletTabs chainId={chainId!} account={account!} tokens={tokens!} /> 
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <PoolStatsView chainId={chainId} depositToken={depositToken} investToken={investToken} />
                    <Divider style={{marginTop: 40, marginBottom: 40}} />
                    <StrategyInfoView chainId={chainId} depositToken={depositToken} investToken={investToken} />
                </TabPanel>
                <TabPanel className={classes.tab} value="2" key={2}>
                    <TradesView chainId={chainId} account={account} depositToken={depositToken} investToken={investToken} />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default PoolTabs

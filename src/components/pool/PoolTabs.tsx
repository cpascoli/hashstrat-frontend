import React, { useState } from "react"
import { Box, Tab, makeStyles, Divider } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { Token } from "../../types/Token"
import { MyStatsView } from "../wallet/MyStatsView"
import { PoolStatsView } from "./PoolStatsView"
import { TradesView } from "./TradesView"
import { WalletTabs } from "../wallet/WalletTabs"
import { RebalanceStrategyInfoView } from "./RebalanceStrategyInfoView"
import { MeanRevStrategyInfoView } from "./MeanRevStrategyInfoView"
import { PoolInfo } from "../../utils/pools"


interface PoolTabsProps {
    poolId: string,
    chainId: number,
    account?: string,
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



export const PoolTabs = ( { chainId, poolId, account, tokens, investToken } : PoolTabsProps ) => {

    console.log("PoolTabs >>> tokens", chainId, poolId, account, tokens)


    const depositToken = tokens[0]

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const classes = useStyle()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const { strategy } = PoolInfo(chainId, poolId)

    const isRebalanceStrategy = strategy === "rebalance_01"
    const isMeanRevStrategy = strategy === "meanrev_01"

    return (
        <Box className={classes.container}>
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                    {<Tab label="My Assets" value="0" key={0} /> }
                    <Tab label="Pool Info" value="1" key={1}  />
                    <Tab label="Pool Trades" value="2" key={2} />

                </TabList>
                { account &&
                    <TabPanel className={classes.tab} value="0" key={0}>
                        <MyStatsView chainId={chainId} poolId={poolId} account={account} depositToken={depositToken} />
                        <WalletTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens!} />
                    </TabPanel>
                }
                <TabPanel className={classes.tab} value="1" key={1}>
                    <PoolStatsView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    <Divider style={{marginTop: 20, marginBottom: 20}} />
                    {
                       isRebalanceStrategy && <RebalanceStrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    }
                    {
                       isMeanRevStrategy && <MeanRevStrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    }

                </TabPanel>
                <TabPanel className={classes.tab} value="2" key={2}>
                    <TradesView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default PoolTabs

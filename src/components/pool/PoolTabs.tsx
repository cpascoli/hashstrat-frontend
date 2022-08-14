import React, { useState } from "react"
import { Box, Tab, makeStyles, Typography } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { Token } from "../../types/Token"
import { MyStatsView } from "./MyStatsView"
import { PoolStatsView } from "./PoolStatsView"
import { TradesView } from "./TradesView"
import { WalletTabs } from "../wallet/WalletTabs"
import { RebalanceStrategyInfoView } from "./RebalanceStrategyInfoView"
import { MeanRevStrategyInfoView } from "./MeanRevStrategyInfoView"
import { TrendFollowtrategyInfoView } from "./TrendFollowtrategyInfoView"
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
        paddingBottom: 0,
        maxWidth: 800,
        margin: "auto"
    },
    tabList: { 
        padding: 0,
        margin: "auto",
        maxWidth: 960,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    tab: { 
          padding: 0,
          maxWidth: 800,
          margin: "auto",
          paddingTop: 20,
          backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
}))



export const PoolTabs = ( { chainId, poolId, account, tokens, investToken } : PoolTabsProps ) => {

    const depositToken = tokens[0]

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const classes = useStyle()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const { strategy } = PoolInfo(chainId, poolId)

    const isRebalanceStrategy = strategy === "rebalance_01"
    const isMeanRevStrategy = strategy === "meanrev_01"
    const isTrendFollowStrategy = strategy === "trendfollow_01"

    return (
        <Box className={classes.container}>

            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                    {<Tab label="My Assets" value="0" key={0} /> }
                    <Tab label="Pool" value="1" key={1}  />
                    <Tab label="Strategy" value="2" key={2}  />
                    <Tab label="Trades" value="3" key={3} />

                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                    { account &&
                        <>
                            <MyStatsView chainId={chainId} poolId={poolId} account={account} depositToken={depositToken} />
                            <WalletTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens!} />
                        </>
                    || 
                        <Box py={8}>
                            <Typography align="center"> Connect an acount to view your assets</Typography>
                        </Box>
                    }

                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <PoolStatsView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                </TabPanel>
                <TabPanel className={classes.tab} value="2" key={2}>
                    {
                       isRebalanceStrategy && <RebalanceStrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    }
                    {
                       isMeanRevStrategy && <MeanRevStrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    }
                    {
                        isTrendFollowStrategy && <TrendFollowtrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    }
                </TabPanel>
                <TabPanel className={classes.tab} value="3" key={3}>
                    <TradesView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default PoolTabs

import React, { useState } from "react"

import { Link as RouterLink } from "react-router-dom"
import { Box, Divider, makeStyles, Typography, Link, Tab } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { usePoolsInfo } from "../dashboard/DashboadModel"
import { InvestTokens, PoolInfo } from "../../utils/pools"
import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"
import { PoolIds } from "../../utils/pools";
import { PoolSummary } from "../shared/PoolSummary"


interface PoolsViewProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
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


export const PoolsView = ({ chainId, account, depositToken } : PoolsViewProps) => {

    const classes = useStyles()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]
    const poolsInfo = usePoolsInfo(chainId, PoolIds(chainId), tokens, account)

   
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const activePoolsViews = poolsInfo.filter( pool => PoolInfo(chainId, pool.poolId).disabled === 'false' ).map( pool => {
        return (
            <div key={pool.poolId}>
                <PoolSummary chainId={chainId} poolId={pool.poolId} account={account} depositToken={depositToken} tokens={pool.tokenInfoArray} />
            </div>
        )
    })

    const disabledPoolsViews = poolsInfo.filter( pool => PoolInfo(chainId, pool.poolId).disabled === 'true' ).map( pool => {
        return (
            <div key={pool.poolId}>
                <PoolSummary chainId={chainId} poolId={pool.poolId} account={account} depositToken={depositToken} tokens={pool.tokenInfoArray} />
            </div>
        )
    })


    return (
        <Box mt={2}>
      
            <Divider variant="middle"  style={{marginTop: 20, marginBottom: 0}}/>
            <div className={classes.container}> 
                <Typography>
                   HashStrat Pools are autonomous crypto-funds running on the blockchain. <br/>
                   Each Pool holds 2 assets, a stable asset ({depositToken.symbol}) and a risk asset (BTC or ETH) and 
                   it's configured with a <Link component={RouterLink} to="/strategies" >Strategy</Link> to trade between them.
                   <br/>
                   You can deposit {depositToken.symbol} tokens into any pool with the goal to see your capital grow over time.
                </Typography>   
            </div>

            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                      <Tab label="Active Pools" value="0" key={0} />
                      <Tab label="Disabled Pools" value="1" key={1}  />
                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                    <Horizontal align="center"> 
                        { activePoolsViews }
                    </Horizontal>
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <Box px={2} pb={2} >
                        <Alert severity="warning" style={{  marginBottom: 10 }} > 
                            <AlertTitle>Disabled Pools</AlertTitle>
                            Pools have been upgraded and old pools are now disabled.<br/>
                            Withdraw funds from disabled Pools and transfer them into active Pools.
                        </Alert>
                    </Box>
                   
                    <Horizontal align="center"> 
                        { disabledPoolsViews }
                    </Horizontal>
                </TabPanel>
            </TabContext>
  
        </Box>
    )
}



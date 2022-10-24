import React, { useState } from "react"
import { Box, Divider, makeStyles, Typography, Link, Tab } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Link as RouterLink } from "react-router-dom"
import { useIndexesInfo } from "../dashboard/DashboadModel"
import { InvestTokens, PoolInfo } from "../../utils/pools"
import { IndexesIds } from "../../utils/pools";
import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"

import { PoolSummary } from "../shared/PoolSummary"


interface IndexesViewProps {
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


export const IndexesView = ({ chainId, account, depositToken } : IndexesViewProps) => {

    const classes = useStyles()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    
    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]
    const indexes = useIndexesInfo(chainId, IndexesIds(chainId), tokens, account)

   
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const activeIndexViews = indexes.filter( index => PoolInfo(chainId, index.poolId).disabled === 'false').map( index => {
        return (
            <div key={index.poolId}>
                <PoolSummary chainId={chainId} poolId={index.poolId} account={account} depositToken={depositToken} tokens={index.tokenInfoArray} />
            </div>
        )
    })

    const disabledIndexViews = indexes.filter( index => PoolInfo(chainId, index.poolId).disabled === 'true').map( index => {
        return (
            <div key={index.poolId}>
                <PoolSummary chainId={chainId} poolId={index.poolId} account={account} depositToken={depositToken} tokens={index.tokenInfoArray} />
            </div>
        )
    })

    return (
        <Box mt={2}>

            <Divider variant="middle"  style={{marginTop: 20, marginBottom: 0}}/>
            <div className={classes.container}> 
                <Typography >
                    HashStrat Indexes represent a weighted basket of <Link component={RouterLink} to="/pools" style={{ textDecoration: 'none' }} >HashSttap Pools </Link> and 
                    their associated <Link component={RouterLink} to="/strategies" >Strategies</Link>. <br/>
                    Indexes allow to easily invest into a combination of strategies and assets for improved risk/return profiles.
                </Typography>
            </div>

            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                      <Tab label="Active Indexes" value="0" key={0} />
                      <Tab label="Disabled Indexes" value="1" key={1}  />
                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                    <Horizontal align="center"> 
                        { activeIndexViews }
                    </Horizontal>
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <Box px={2} pb={2} >
                        <Alert severity="warning" style={{  marginBottom: 10 }} > 
                            <AlertTitle>Disabled Indexes</AlertTitle>
                            Indexes have been upgraded and old indexes are now disabled.<br/>
                            Withdraw funds from disabled Indexes and transfer them into active Indexes.
                        </Alert>
                    </Box>
                   
                    <Horizontal align="center"> 
                        { disabledIndexViews }
                    </Horizontal>
                </TabPanel>
            </TabContext>
        </Box>
    )
}



import React, { useState } from "react"

import { Box, makeStyles, Typography, Link, Breadcrumbs, Divider, Tab, Button, Card, CardHeader, CardContent, CardActions } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { NetworkExplorerHost, HstTokenAddress } from "../../utils/network"
import { Link as RouterLink } from "react-router-dom"
import { Token } from "../../types/Token"
import { Contracts } from "../shared/Contracts"
import { DAOToken } from "./DAOToken"
import { DAORevenues } from "./DAORevenues"
import { DAOTreasury } from "./DAOTreasury"
import { Horizontal } from "../Layout"

interface DaoHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({

    container: {
        paddingTop: theme.spacing(2),
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
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    }

}))


export const DaoHome = ({ chainId, account, depositToken } : DaoHomeProps ) => {

    const classes = useStyles()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
        
    return (

        <Box className={classes.container}>

            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/home"> Home </Link>
                    <Typography>DAO</Typography>
                </Breadcrumbs>
            </Box>


            <Horizontal align="center">
            
                <Box my={3} style={{ maxWidth: 800 }} >
                    <Card variant="outlined">
                        <CardHeader title="HashStrat DAO"  />
                        <CardContent>
                            Here you can farm your DAO tokens (HST) and collect your share of the DAO dividends. Use the <Link href="https://www.tally.xyz/governance/eip155:137:0xEEE17dd25c6ac652c434977D291b016b9bA61a1A" target="_blank" >Tally</Link> app to create, vote and execute governance proposals.
                        </CardContent>
                        <CardActions style={{justifyContent: 'center', paddingBottom: 20}}>
                            <Link href="https://www.tally.xyz/governance/eip155:137:0xEEE17dd25c6ac652c434977D291b016b9bA61a1A" target="_blank" style={{ textDecoration: 'none' }} > 
                                <Button variant="outlined" color="primary" > Go to Governance </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Box>

            </Horizontal>

            <Divider variant="middle" style={{  marginBottom: 20 }}/>

            <Box>
                 <TabContext value={selectedTokenIndex.toString()} >
                    <TabList onChange={handleChange} className={classes.tabList}>
                        <Tab label="DAO Token HST" value="0" key={0} />
                        <Tab label="Divs Distribution" value="1" key={1}  />
                        <Tab label="Treasury" value="2" key={2}  />
                    </TabList>
                    <TabPanel className={classes.tab} value="0" key={0}>
                        <DAOToken chainId={chainId} account={account} depositToken={depositToken} />
                    </TabPanel>
                    <TabPanel className={classes.tab} value="1" key={1}>
                        <DAORevenues chainId={chainId} account={account} depositToken={depositToken} />
                    </TabPanel>
                    <TabPanel className={classes.tab} value="2"key={2}>
                        <DAOTreasury chainId={chainId} account={account} depositToken={depositToken} />
                    </TabPanel>
                </TabContext>
            </Box>
    

            <Box p={2}>
                <Contracts chainId={chainId} />
            </Box>
        </Box>
    )
}



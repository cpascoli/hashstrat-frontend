import React, { useState, useContext } from "react"

import { Box, makeStyles, Typography, Link, Breadcrumbs, Divider, Tab, Button, Card, CardHeader, CardContent, CardActions } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Link as RouterLink } from "react-router-dom"
import { Token } from "../../types/Token"
import { Contracts } from "../shared/Contracts"
import { DAOToken } from "./DAOToken"
import { DAORevenues } from "./DAORevenues"
import { DAOTreasury } from "./DAOTreasury"
import { Horizontal } from "../Layout"
import { ConnectAccountHelper } from "../dashboard/ConnectAccountHelper"
import { AppContext } from "../../context/AppContext"


interface DaoHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({

    container: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
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

    const { connectedChainId, wrongNetwork } = useContext(AppContext);

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

            <Divider variant="middle" style={{  marginTop: 20,  marginBottom: 20 }}/>

            { (connectedChainId && (!account || wrongNetwork(connectedChainId))) &&
                <ConnectAccountHelper connectedChainId={connectedChainId} userMessage="collect your farmed DAO tokens or dividends" />
            }

            <Box mx={2} mb={4}>
                <Typography>
                    The HashStrat DAO is the decentralized organization running the protocol. <br/>
                </Typography>
                <Typography style={{ marginTop: 10 }}>
                    Users of the protocol can farm their DAO tokens (HST), collect their share of the protocol dividends and partecipate to the governance process. 
                </Typography>
         
            </Box>

           
            <Box>
                 <TabContext value={selectedTokenIndex.toString()} >
                    <TabList onChange={handleChange} className={classes.tabList}>
                        <Tab label="HST Token" value="0" key={0} />
                        <Tab label="Dividends" value="1" key={1}  />
                        <Tab label="Treasury" value="2" key={2}  />
                        <Tab label="Governance" value="3" key={3}  />
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

                    <TabPanel className={classes.tab} value="3"key={3}>
                        <Horizontal align="center">
                            <Box mt={3} style={{ maxWidth: 800 }} >
                                <Card variant="outlined" >
                                    <Box my={3}>
                                        <CardHeader title="Governance"  />
                                        <CardContent>
                                            DAO governance allows HST holders to participate to improvements to the HashStrat protocol.
                                            HST holders can use the Tally app to create, vote and execute governance proposals.
                                        </CardContent>
                                        <CardActions style={{justifyContent: 'center', paddingBottom: 20}}>
                                            <Link href="https://www.tally.xyz/governance/eip155:137:0xEEE17dd25c6ac652c434977D291b016b9bA61a1A" target="_blank" style={{ textDecoration: 'none' }} > 
                                                <Button variant="outlined" color="primary" > Launch Tally </Button>
                                            </Link>
                                        </CardActions>
                                    </Box>
                                </Card>
                            </Box>
                        </Horizontal>
                    </TabPanel>

                </TabContext>
            </Box>
    
            <Box p={2}>
                <Contracts chainId={chainId} />
            </Box>
        </Box>
    )
}



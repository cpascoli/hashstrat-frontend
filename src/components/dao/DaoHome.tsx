import React, { useState } from "react"

import { Box, makeStyles, Typography, Link, Breadcrumbs, Divider, Tab } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { NetworkExplorerHost, HstTokenAddress } from "../../utils/network"
import { Link as RouterLink } from "react-router-dom"
import { Token } from "../../types/Token"
import { Contracts } from "../shared/Contracts"
import { DAOToken } from "./DAOToken"
import { DAORevenues } from "./DAORevenues"


interface DaoHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({

    container: {
        // textAlign: "center",
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),

        minHeight: 300
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

    const hstAddress = HstTokenAddress(chainId)
    const explorerHost = NetworkExplorerHost(chainId)
        
    return (

        <Box className={classes.container}>

            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/home"> Home </Link>
                    <Typography>DAO</Typography>
                </Breadcrumbs>
            </Box>

            <Divider variant="middle" style={{marginTop: 20 }}/>

            <Box  py={3}>
                <Typography align="center" >
                    HashStrat DAO is the Decentralized Autonomous Organization governing the HashStrat protocol
   
                </Typography>
            </Box>

            <Box>
                 <TabContext value={selectedTokenIndex.toString()} >
                    <TabList onChange={handleChange} className={classes.tabList}>
                        <Tab label="DAO Token (HST)" value="0" key={0} />
                        <Tab label="Divs Distribution" value="1" key={1}  />
                    </TabList>
                    <TabPanel className={classes.tab} value="0" key={0}>
                        <DAOToken chainId={chainId} account={account} depositToken={depositToken} />
                    </TabPanel>
                    <TabPanel className={classes.tab} value="1" key={1}>
                        <DAORevenues chainId={chainId} account={account} depositToken={depositToken} />
                    </TabPanel>
                </TabContext>
            </Box>
      
            <Box p={2}>
                <Contracts chainId={chainId} />
            </Box>
        </Box>
    )
}



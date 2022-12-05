

import React, { useState } from "react"

import { Box, makeStyles, Tab, Link, Typography  } from "@material-ui/core"
import { TabContext, TabList, TabPanel, AlertTitle } from "@material-ui/lab"

import { Token } from "../../types/Token"

import { FundAssetsSummary } from "./FundAssetsSummary"
import { MyPortfolioAssetsSummary } from "./MyPortfolioAssetsSummary"
import { StyledAlert } from "../shared/StyledAlert"
import { ConnectButton } from "../../main/ConnectButton"
import { Horizontal } from '../Layout';


interface DashboardProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: 2,
        marginBottom: 10,
    },
    tickers: {
        maxWidth: 800,
        margin: "auto"
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



export const Dashboard = ({ chainId, depositToken, investTokens, account } : DashboardProps) => {
    
    const [didLoad, setDidLoad]  = useState(false);



    const selIdx =  0 //account === undefined ? 1 : 0
    const classes = useStyles()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(selIdx)
   
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleDidLoad = (didLoad: boolean ) => {
        console.log("handleDidLoad", didLoad)
        setDidLoad(didLoad)
    }


    return (
        <div className={classes.container} >
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} className={classes.tabList}>
                    <Tab label="My Portfolio" value="0" key={0} />
                    <Tab label="HashStrat" value="1" key={1}  />
                </TabList>
                <TabPanel className={classes.tab} value="0" key={0}>
                 { account  &&  
                    <MyPortfolioAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} account={account} onPortfolioLoad={handleDidLoad} /> 
                }
                 { !account &&  
                    <Box style={{ paddingTop: 10, paddingBottom: 10 }}>
                        <div style={{ textAlign: "center", maxWidth: 600, margin: 'auto', padding: 10 }}>
                            <StyledAlert severity="info" >
                                <Horizontal align='center' valign='center'>
                                    <div>
                                        <AlertTitle>No account connected</AlertTitle>
                                        <Typography>
                                             Connect an account to the <Link href="https://academy.binance.com/en/articles/how-to-add-polygon-to-metamask" target="_blank">Polygon</Link> network to use this dapp. <br/>
                                        </Typography>
                                    </div>
                                    <div style={{ paddingLeft: 0, paddingRight: 0, marginTop: 10, marginBottom: 20 }} >
                                        <ConnectButton />
                                    </div>
                                </Horizontal>
                            </StyledAlert>
                        </div>

                </Box> }
                </TabPanel>
                <TabPanel className={classes.tab} value="1" key={1}>
                    <FundAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} />
                </TabPanel>
            </TabContext>
        </div>
    )

}





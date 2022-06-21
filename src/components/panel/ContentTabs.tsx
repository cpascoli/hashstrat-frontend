import React, { useState, useEffect } from "react"
import { Box, Tab, Paper, Snackbar, Link, makeStyles } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"
import { TabContext, TabList, TabPanel, Alert, AlertTitle, Color as Severity } from "@material-ui/lab"

import { TitleValueBox } from "../TitleValueBox"
import { Token } from  "../Main"
import { DepositWithdrawView } from "../DepositWithdrawView"
import { usePortfolioValue } from "../../hooks"
import { fromDecimals } from "../../utils/formatter"
import { BigNumber } from "ethers"

interface TabPanelProps {
    chainId: number,
    account: string,
    tokens: Array<Token>
}

const useStyle = makeStyles( theme => ({
    container: {
        margin: "auto",
        // paddingBottom: 20
    },
    tab: { 
          padding: 0,
          maxWidth: 640,
          margin: "auto",
          paddingTop: 20
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


const TabContent = styled(Paper)(({ theme }) => ({
    // padding: theme.spacing(2),
    textAlign: 'center',
    width: "100%",
}));

export type SnackInfo = {
    type: Severity,
    title: string;
    message: string;
    linkUrl?: string
    linkText?: string
    snackDuration?: number 
}


const ContentTabs = ( { chainId, account, tokens } : TabPanelProps ) => {

    const portfolioValue = usePortfolioValue(chainId, account) // BigNumber.from("123000000" )
    const formattedPortfolioValue =  (portfolioValue) ? fromDecimals(portfolioValue, tokens[0].decimals, 2) : ""
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const [showSnack, setShowSnack] = useState(false)
    const [snackContent, setSnackContent] = useState<SnackInfo>()

    const classes = useStyle()

    const handleCloseSnack = () => {
        setShowSnack(false)
    }


    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleSuccess = (info: SnackInfo) => {
        console.log("ContentTabs.handleSuccess() >>> ", info)
        setSnackContent(info)
        setShowSnack(true)
    }

    const handleError = (error: SnackInfo) => {
        console.log("ContentTabs.handleError() >>> ", error)
        setSnackContent(error)
        setShowSnack(true)
    }

    return (
        
        <Box className={classes.container}>
            
            <Box className={classes.portfolioInfo} >
               <TitleValueBox title="Your Portfolio Value" value={formattedPortfolioValue} tokenSymbol={tokens[0].symbol} />
            </Box>

            <Box my={4}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange}>
                        {
                            tokens.map((token, index ) => {
                                return (
                                    <Tab label={token.symbol} value={index.toString()} key={index}>

                                    </Tab>
                                )
                            }) 
                        }
                    </TabList>

                    {
                       
                        tokens.map((token, index ) => {
                            return (
                                <TabPanel className={classes.tab} value={index.toString()} key={index}>
                                    <TabContent>
                                        <DepositWithdrawView 
                                            formType={ token.symbol == 'POOL-LP' ? "withdraw" :  "deposit" }
                                            chainId={chainId}
                                            token={token}
                                            handleSuccess={handleSuccess}
                                            handleError={handleError}
                                        />
                                    </TabContent>
                                </TabPanel>
                            )
                        })
                    }
                </TabContext>
            </Box>


            <Snackbar
                    open={showSnack}
                    anchorOrigin={ { horizontal: 'right',  vertical: 'bottom' } }
                    autoHideDuration={snackContent?.snackDuration ?? 10000}
                    onClose={handleCloseSnack}
            >
                    <Alert onClose={handleCloseSnack} severity={snackContent?.type}>
                        <AlertTitle> {snackContent?.title} </AlertTitle>
                        {snackContent?.message}
                        <br/>
                        <Link href={snackContent?.linkUrl} target="_blank"> {snackContent?.linkText} </Link>
                    </Alert>
            </Snackbar>
        </Box>
    )
}

export default ContentTabs

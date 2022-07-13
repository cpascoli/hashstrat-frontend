import React, { useState, useEffect } from "react"
import { Box, Tab, Paper, Snackbar, Link, makeStyles, Divider } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"
import { TabContext, TabList, TabPanel, Alert, AlertTitle, Color as Severity } from "@material-ui/lab"

import { Token } from  "../../types/Token"
import { DepositWithdrawView } from "../DepositWithdrawView"
import { usePortfolioValue } from "../../hooks"
import { fromDecimals } from "../../utils/formatter"
import { SnackInfo } from "../SnackInfo"
import { Contracts } from "../pool/Contracts"


interface TabPanelProps {
    chainId: number,
    poolId: string,
    account: string,
    tokens: Array<Token>
}

const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
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


const TabContent = styled(Paper)(({ theme }) => ({
    // padding: theme.spacing(2),
    textAlign: 'center',
    width: "100%",
}));



export const WalletTabs = ( { chainId, poolId, account, tokens } : TabPanelProps ) => {

    const portfolioValue = usePortfolioValue(chainId, poolId, account) // BigNumber.from("123000000" )
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
        console.log("WalletTabs.handleSuccess() >>> ", info)
        setSnackContent(info)
        setShowSnack(true)
    }

    const handleError = (error: SnackInfo) => {
        console.log("WalletTabs.handleError() >>> ", error)
        setSnackContent(error)
        setShowSnack(true)
    }

    return (
        
        <Box className={classes.container}>
            <Box my={4}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} className={classes.tabList}>
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
                                    <DepositWithdrawView 
                                        formType={ token.symbol == 'POOL-LP' ? "withdraw" :  "deposit" }
                                        chainId={chainId}
                                        poolId={poolId}
                                        token={token}
                                        handleSuccess={handleSuccess}
                                        handleError={handleError}
                                    />
                                </TabPanel>
                            )
                        })
                    }
                </TabContext>
            </Box>

            <Divider style={{marginTop:30, marginBottom: 30}} />


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

export default WalletTabs

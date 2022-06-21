import React, { useState, useEffect } from "react"
import { Box, Tab, Paper, makeStyles } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

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
        padding: 20,
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto"
    }
}))


const TabContent = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    width: "100%",
}));

const ContentTabs = ( { chainId, account, tokens } : TabPanelProps ) => {

    const portfolioValue = usePortfolioValue(chainId, account) // BigNumber.from("123000000" )
    const formattedPortfolioValue =  (portfolioValue) ? fromDecimals(portfolioValue, tokens[0].decimals, 2) : ""
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const classes = useStyle()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleSuccess = (result: any) => {
        console.log("ContentTabs.handleSuccess()", typeof result, ">>>", result)
    }

    const handleError = (error: any, message: string) => {
        console.log("ContentTabs.handleError()", typeof error, ">>>", error)
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
                                <TabPanel value={index.toString()} key={index}>
                                    <TabContent>
                                        {
                                            token.symbol === 'DAI' &&  (
                                                <DepositWithdrawView 
                                                    formType="deposit"
                                                    chainId={chainId}
                                                    token={token}
                                                    handleSuccess={handleSuccess}
                                                    handleError={handleError}
                                                />
                                            ) ||
                                            token.symbol === 'USDC' &&  (
                                                <DepositWithdrawView 
                                                    formType="deposit"
                                                    chainId={chainId}
                                                    token={token}
                                                    handleSuccess={handleSuccess}
                                                    handleError={handleError}
                                                />
                                            ) || 
                                            token.symbol === 'POOL-LP' &&  (
                                                <DepositWithdrawView 
                                                    formType="withdraw"
                                                    chainId={chainId}
                                                    token={token}
                                                    handleSuccess={handleSuccess}
                                                    handleError={handleError}
                                                />
                                            )
                                            
                                        }
                                    </TabContent>
                                </TabPanel>
                            )
                        })
                    }
                </TabContext>
            </Box>
        </Box>
    )
}

export default ContentTabs

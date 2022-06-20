import { useState } from "react"
import { useEthers } from "@usedapp/core"
import { Box, Tab, Paper, makeStyles } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { TitleValueBox } from "../TitleValueBox"
import { Token } from  "../Main"
import { DepositWithdrawView } from "../DepositWithdrawView"
import { fromDecimals } from "../../utils/formatter"
import { usePortfolioValue } from "../../hooks"


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

export const ContentTabs = ( { chainId, account, tokens } : TabPanelProps ) => {

    console.log(">>> ContentTabs () = chainId: ", chainId, account, tokens)
    const classes = useStyle()
    //const prtfolioValue = usePortfolioValue(chainId, account)
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)


    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleSuccess = (result: any) => {
        console.log("ContentTabs.handleSuccess()", typeof result, ">>>", result)
    }

    const handleError = (error: any, message: string) => {
        console.log("ContentTabs.handleError()", typeof error, ">>>", error)
    }


    const formattedPortfolioValue =  "100" // (prtfolioValue) ? fromDecimals(prtfolioValue, 6, 2) : ""

    return (
        
        <Box className={classes.container}>
            
            <Box className={classes.portfolioInfo} >
              { tokens?.length > 0 &&  <TitleValueBox title="Your Portfolio Value" value={formattedPortfolioValue} tokenSymbol={tokens[0].symbol} /> }
            </Box>

            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange}>
                    {
                        tokens?.map((token, index ) => {
                            return (
                                <Tab label={token.symbol} value={index.toString()} key={index}>

                                </Tab>
                            )
                        }) 
                    }
                </TabList>

                {
                    tokens?.map((token, index ) => {
                        console.log("token", token.symbol)
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <TabContent>
                                    {
                                        token.symbol === 'USDC' &&  (
                                            <DepositWithdrawView 
                                                formType="deposit"
                                                chainId={chainId}
                                                token={token}
                                                portfolioValue={"1000"}
                                                handleSuccess={handleSuccess}
                                                handleError={handleError}
                                            />
                                        ) 
                                        || 
                                        token.symbol === 'POOL-LP' &&  (
                                            <DepositWithdrawView 
                                                formType="withdraw"
                                                chainId={chainId}
                                                token={token}
                                                portfolioValue={"1000"}
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
    )
}
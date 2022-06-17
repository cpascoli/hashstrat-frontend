import { Token } from  "../Main"
import { Box, makeStyles } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"

import { useState } from "react"

import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Tab, Grid, Paper, Button } from "@material-ui/core"
import { WalletBalance } from "./WalletBalance"
import { DepositWithdrawView } from "../DepositWithdrawView"


interface YourWalletProps {
    tokens: Array<Token>

}

export const YourWallet = ( { tokens } : YourWalletProps) => {

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleSuccess = (result: any) => {
        console.log("YourWallet.handleSuccess()", typeof result, ">>>", result)
    }

    const handleError = (error: any, message: string) => {
        console.log("YourWallet.handleError()", typeof error, ">>>", error)
    }

    const TabContent = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(2),
        textAlign: 'center',
        width: "100%",
      }));


    return (
        <Box>
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange}>
                    {
                        tokens.map((token, index ) => {
                            return (
                                <Tab label={token.name} value={index.toString()} key={index}>

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
                                        token.name === 'USDC' &&  (
                                        <DepositWithdrawView 
                                            formType="deposit"
                                            balanceUSDC={"100.20"}
                                            portfolioValue={"1000"}
                                            tokenSymbol={token.name}
                                            tokenImgSrc={token.image}
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
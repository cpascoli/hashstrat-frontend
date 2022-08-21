import { useState, useEffect } from "react"
import { BigNumber, utils , ethers } from "ethers"
import { useEthers, useNotifications } from "@usedapp/core";

import { Box, Accordion, AccordionDetails, AccordionSummary, makeStyles, 
        Typography, Link, Button, CircularProgress, Card, CardContent, CardActions
     } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import { ExpandMore, Info } from "@material-ui/icons"


import { useGetRewardPeriods, useStakedLP, useClaimableRewards, useClaimReward  } from "../../hooks/useFarm"
import { useTokenBalance, useTokenTotalSupply } from "../../hooks"
import { fromDecimals, round } from "../../utils/formatter"
import { TitleValueBox } from "../TitleValueBox"

import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"

import { SnackInfo } from "../SnackInfo"
import { NetworkExplorerHost, NetworkExplorerName, HstTokenAddress } from "../../utils/network"
import { StyledAlert } from "../shared/StyledAlert"

import { HstToken } from "../../utils/Tokens"



interface DAOTokenProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    tokenInfo: {
        maxWidth: 600,
        margin: "auto"
    },
    container: {
        // textAlign: "center",
        padding: theme.spacing(2),
        minHeight: 300
    },
    info:{
        margin: "auto",
        marginBottom: 30,
    },
    claimAction: {
        display: "flex",
        justifyContent: "space-around",
        paddingBottom: 20
    }
}))


export const DAOToken = ({ chainId, account, depositToken } : DAOTokenProps ) => {

    const classes = useStyles()
    
    const rewardPeriods = useGetRewardPeriods(chainId)
    const hstBalance = useTokenBalance(chainId, "", "HST", account)
    const hstSupply  = useTokenTotalSupply(chainId, "", "hst")

    const tokenStakedBalance = useStakedLP(chainId, account)
    const claimableRewards = useClaimableRewards(chainId, account)

    const [userMessage, setUserMessage] = useState<SnackInfo>()
    const { notifications } = useNotifications()

    // Claim HST tokens
    const { claimReward, claimRewardState } = useClaimReward(chainId)
    const isDepositMining = claimRewardState.status === "Mining"

    const handleClaimButtonPressed = () => {
        console.log("DaoHome - handleClaimButtonPressed ")
        setUserMessage(undefined)

        return claimReward()
    }

    const hstToken = HstToken(chainId)
    const ethereum = new ethers.providers.Web3Provider(window.ethereum);

    const handleAddTokenButtonPressed = () => {

            window.ethereum && window.ethereum.request({
                 method: 'wallet_watchAsset', 
                 params: {
                    type: 'ERC20',
                    options: {
                      address: hstToken.address,
                      symbol: hstToken.symbol,
                      decimals: hstToken.decimals,
                      image: 'https://hashstrat.com/logo.svg'
                    }
                  }
            })
            .then(() => console.log('Success, Token added!'))
            .catch((error: Error) => console.log(`Error: ${error.message}`))

    }


    
    const explorerHost = NetworkExplorerHost(chainId)
    const claimedLink =  (claimRewardState.status === 'Success' && 
                claimRewardState.receipt && 
                claimRewardState.receipt.transactionHash 
                ) ? `https://${explorerHost}/tx/${claimRewardState.receipt.transactionHash}` : ""

    useEffect(() => {
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Claim Rewards"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "HST tokens claimed",
                linkUrl: claimedLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 10000
            }
            setUserMessage({
                type: "info",
                title: "HST tokens claimed",
                message: "Thanks for participating in the HashStrat DAO",
            })
        }
    }, [notifications, chainId, claimedLink])

  
    const formattedTokenStakedBalance = tokenStakedBalance? fromDecimals(tokenStakedBalance, depositToken.decimals, 2) : ""
    const formattedClaimableRewards = claimableRewards? fromDecimals(claimableRewards, 18, 2) : ""
    const formattedHstBalance = hstBalance? fromDecimals(hstBalance, 18, 2) : ""
    const formattedHstSupply = hstSupply? fromDecimals(hstSupply, 18, 2) : ""

    const totalRewardPaid = rewardPeriods && rewardPeriods.reduce( (acc : BigNumber, val : { [ x:string ] : BigNumber } ) => {
        return acc.add(val.totalRewardsPaid)
    }, BigNumber.from(0))

    const formattedTotalRewardPaid = totalRewardPaid ? fromDecimals(totalRewardPaid, 18, 2) : ""

    const circulatingPerc = (formattedTotalRewardPaid && formattedHstSupply ) ? 
             round(Number(formattedTotalRewardPaid) /  Number(formattedHstSupply), 4) : ''

             
    return (

        <Box className={classes.container}>

            { userMessage &&
                <div className={classes.info}>
                    <StyledAlert severity={userMessage?.type}>
                        <AlertTitle> {userMessage?.title} </AlertTitle>
                        {userMessage?.message}
                    </StyledAlert>
                </div>
            }

            <Box className={classes.tokenInfo}>
                <Accordion >
                    <AccordionSummary expandIcon={<ExpandMore />} >
                        <Typography > The HashStrat DAO Token (HST) </Typography> &nbsp;&nbsp;&nbsp; <Info color="primary" />
                    </AccordionSummary>
                    <AccordionDetails style={{paddingLeft: 0, margin: 0}}>
                        <ul>
                            <li style={{marginBottom: 10}}>
                               <Typography> HST is a non mintable ERC20 token with a fixed supply of 1 million and no premine.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                            <Typography>HST has a fair distribution and can only be acquired by using of the HashStrat protocol.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                            <Typography>Users who deposit funds in any Pools &amp; Indexes, can stake their LP tokens and farm HST.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                            <Typography> HST gets distributed with a fixed schedule over a 10 years period.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                                <Typography>The rate of distributon of HST tokens decreases exponentially, halving every year, to incentivise early adopters and supporters of the protocol.</Typography>
                            </li>
                        </ul>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Box p={4}>

                <Horizontal align="center" > 

                    <Box mb={3} style={{minWidth: 320 }} >
                        <Card>
                            <CardContent>
                                <Typography variant="h5" style={{ marginBottom: 10 }} >HST Token Stats</Typography>
                                <TitleValueBox title="Total Supply" value={ utils.commify(formattedHstSupply )} mode="small" />
                                <TitleValueBox title="Circulating Supply" value={ utils.commify(formattedTotalRewardPaid) }  mode="small" />
                                <TitleValueBox title="Circulating %" value={`${circulatingPerc}`} suffix="%"  mode="small"/>
                            </CardContent>
                            <CardActions   >
                                <Button variant="contained" color="secondary" fullWidth onClick={handleAddTokenButtonPressed} style={{ margin: 20, height: 40 }} > 
                                    Add HST to MetaMask
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>

                    <Box  style={{minWidth: 320 }} >
                        
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" style={{ marginBottom: 10 }}>Your HST Token Farm</Typography>
                                <TitleValueBox title="LP tokens farming" value={ utils.commify(formattedTokenStakedBalance) } mode="small"/>
                                <TitleValueBox title="HST collected" value={ utils.commify(formattedHstBalance) } mode="small" />
                                <TitleValueBox title="HST available to collect" value={ utils.commify(formattedClaimableRewards) } mode="small" />
                            </CardContent>
                            <CardActions   >
                                <Button variant="contained" color="primary" fullWidth onClick={handleClaimButtonPressed} style={{ margin: 20, height: 40 }} > 
                                    Collect HST Tokens
                                    { isDepositMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                                </Button>
                            </CardActions>
                        </Card>
  
                    </Box>
                </Horizontal>

            </Box>

        </Box>
    )
}



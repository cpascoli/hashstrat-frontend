import React, { useState, useEffect } from "react"

import { Box, Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography, Link, Button, CircularProgress } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import { ExpandMore, Info } from "@material-ui/icons"

import { useNotifications } from "@usedapp/core"
import { BigNumber, utils } from "ethers"
import { Link as RouterLink } from "react-router-dom"


import { useGetRewardPeriods, useStakedLP, useClaimableRewards, useClaimReward  } from "../../hooks/useFarm"
import { useTokenBalance, useTokenTotalSupply } from "../../hooks"
import { fromDecimals, round } from "../../utils/formatter"
import { TitleValueBox } from "../TitleValueBox"

import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"
import { Contracts } from "../shared/Contracts"

import { SnackInfo } from "../SnackInfo"
import { NetworkExplorerHost, NetworkExplorerName, HstTokenAddress } from "../../utils/network"
import { StyledAlert } from "../shared/StyledAlert"


interface DaoHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        maxWidth: 780,
        margin: "auto"
    },
    info:{
        margin: "auto"
    }
}))


export const DaoHome = ({ chainId, account, depositToken } : DaoHomeProps ) => {

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

    const hstAddress = HstTokenAddress(chainId)

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
             round(Number(formattedTotalRewardPaid) /  Number(formattedHstSupply), 6) : ''

             
    return (
        <Box mt={2} pt={2}  className={classes.container}>

            { userMessage &&
                <div className={classes.info}>
                    <StyledAlert severity={userMessage?.type}>
                        <AlertTitle> {userMessage?.title} </AlertTitle>
                        {userMessage?.message}
                    </StyledAlert>
                </div>
            }

{/* style={{fontSize: 20, fontWeight: 400}}   */}

            <Typography align="center">
                HashStrat DAO is the Decentralized Autonomous Organization governing the HashStrat protocol. <br/>
                The HashStrat DAO Token <Link href={`https://${explorerHost}/address/${hstAddress}` } target="_black" >HST</Link> is used to participate in the DAO governance and revenue sharing.
            </Typography>
         

            <br/>

            <Accordion>

                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography > The HashStrat DAO Token </Typography> &nbsp;&nbsp;&nbsp; <Info color="primary" />
                </AccordionSummary>
                <AccordionDetails >
                        <Typography variant="body2" >
                            <ul>
                                <li>
                                    HST has a fair distribution and can only be acquired by using of the HashStrat protocol.
                                </li>
                                <li>
                                     Users who deposited in any of the HashStrat Pools &amp; Indexes, can stake their POOL-LP tokens and farm HST tokens. <br/>
                                </li>
                                <li>
                                    HST has a fixed supply of 1 million and is distributed with a fixed schedule over a 10 years period.<br/>
                                </li>
                                <li>
                                    The rate of distributon of HST tokens decreases exponentially, halving every year, to incentivise early adopters and supporters of the protocol.
                                </li>
                            </ul>
                        </Typography>
                </AccordionDetails>
            </Accordion>

            <Box p={4}>
                <Horizontal align="center" valign="center"> 
                    <Box  style={{minWidth: 320 }} >
                        <TitleValueBox title="HST Balance" value={formattedHstBalance} />
                        <TitleValueBox title="HST to claim" value={formattedClaimableRewards} />
                        <TitleValueBox title="Circulating Supply" value={formattedTotalRewardPaid} />
                        <TitleValueBox title="Circulating %" value={`${circulatingPerc}`} suffix="%"/>
                        <TitleValueBox title="Total Supply" value={utils.commify( formattedHstSupply )} />
                        <TitleValueBox title="Pool-LP Token Staked" value={formattedTokenStakedBalance} />
                    </Box>

                    <Button variant="contained" color="primary" fullWidth onClick={handleClaimButtonPressed} style={{ width: 220, height: 40 }} > 
                        Claim HST Tokens
                        { isDepositMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  

                    </Button>
                </Horizontal>
            </Box>
            <Box p={2}>
                <Contracts chainId={chainId} />
            </Box>
        </Box>
    )
}



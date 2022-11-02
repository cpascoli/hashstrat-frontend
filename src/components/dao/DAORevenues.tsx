import React, { useState, useEffect } from "react"

import { utils } from "ethers"
import { useBlockMeta, useNotifications } from "@usedapp/core"

import { Button, Popover, CircularProgress, Box, makeStyles, Typography, Card, CardContent } from  "@material-ui/core"
import { Info } from "@material-ui/icons"
import { Alert, AlertTitle } from "@material-ui/lab"

import { useGetDistributionIntervals, useClaimableDivs, useClaimedDivs, useClaimDivs } from "../../hooks/useDivsDistributor"
import { useGetPastVotes, useGetPastTotalSupply } from "../../hooks/useHST"


import { fromDecimals } from "../../utils/formatter"

import { SnackInfo } from "../SnackInfo"
import { Token } from "../../types/Token"
import { Horizontal } from "../Layout"
import { NetworkExplorerHost, NetworkExplorerName } from "../../utils/network"
import { StyledAlert } from "../shared/StyledAlert"



interface DAORevenuesProps {
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
        margin: "auto"
    }
}))




export const DAORevenues = ({ chainId, account, depositToken } : DAORevenuesProps ) => {

    const classes = useStyles()

    const blockInfo = useBlockMeta()
    const distributionIntervals = useGetDistributionIntervals(chainId)
    const claimedDivs = useClaimedDivs(chainId, 1, account)
    const claimableDivs = useClaimableDivs(chainId, account)
    
    const claimableDivsFormatted = claimableDivs ? fromDecimals(claimableDivs, depositToken.decimals, 2) : "0"
    const claimedDivsFormatted = claimedDivs ? fromDecimals(claimedDivs, depositToken.decimals, 2) : "0"

    const didClaimDivs = claimedDivs !== undefined && !claimedDivs.isZero()


    // Claim Divs
    const [userMessage, setUserMessage] = useState<SnackInfo>()
    const { notifications } = useNotifications()

    const { claimDivs, claimDivsState } = useClaimDivs(chainId)
    const isClaimDivsMining = claimDivsState.status === "Mining"

    const handleClaimButtonPressed = () => {
        setUserMessage(undefined)

        return claimDivs()
    }

    const explorerHost = NetworkExplorerHost(chainId)
    const claimedLink =  (claimDivsState.status === 'Success' && 
                claimDivsState.receipt && 
                claimDivsState.receipt.transactionHash 
                ) ? `https://${explorerHost}/tx/${claimDivsState.receipt.transactionHash}` : ""

    useEffect(() => {
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Claim Dividends"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Dividends claimed",
                linkUrl: claimedLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 10000
            }
            setUserMessage({
                type: "info",
                title: "Dividends claimed",
                message: "Come back again for the next dividends distribution!",
            })
        }
    }, [notifications, chainId, claimedLink])


    const periods = distributionIntervals && distributionIntervals.map( (period : any) => {
        return {
            id: period.id,
            from: period.from,
            to: period.to,
            reward: period.reward ? fromDecimals(period.reward, depositToken.decimals, 2) : "0",
            rewardPaid: period.rewardPaid ? fromDecimals(period.rewardPaid, depositToken.decimals, 2) : "0",
        }
    })


    const lastPeriod = periods && periods.length > 0 ? periods[periods.length-1] : undefined
    const totalDivsFormatted = lastPeriod ? lastPeriod.reward : ""
    const rewardsPaidFormatted = lastPeriod ? lastPeriod.rewardPaid : ''

    
    const avgBlockTime = 2
    let seconds = blockInfo?.blockNumber && lastPeriod ? Math.abs(lastPeriod.to.toNumber() - blockInfo.blockNumber) * avgBlockTime: undefined
    let timeFormatted = undefined
    
    if (seconds) {
        const days = Math.floor(seconds / (3600*24));
        seconds  -= days*3600*24;
        const hrs = Math.floor(seconds / 3600);
        seconds -= hrs*3600;
        const mnts = Math.floor(seconds / 60);
        console.log(days+" days, "+hrs+" Hrs, "+mnts+" Minutes");
        timeFormatted =  days > 0 ? `${days}d, ${hrs}h, ${mnts}m` : hrs > 0 ? `${hrs}h, ${mnts}m` : `${mnts}m`
    }


    const activeDistribution = blockInfo && lastPeriod && blockInfo.blockNumber ? (blockInfo.blockNumber >= lastPeriod.from && blockInfo.blockNumber <= lastPeriod.to) : undefined
    const distributionInfo = activeDistribution !== undefined && timeFormatted ? `Dividend distribution started at block ${lastPeriod.from.toNumber()} and will end at block ${lastPeriod.to.toNumber()}, in approximately ${timeFormatted}`  : ''


    const pastTokens = useGetPastVotes(chainId, lastPeriod?.from, account)
    const pastTotalSupply = useGetPastTotalSupply(chainId, lastPeriod?.from)
    const pastTokensFormatted = pastTokens ? fromDecimals(pastTokens, 18, 2) : ''
    const divsInfo = lastPeriod?.from ? `Your dividends are based on your balance of ${pastTokensFormatted} HST at block ${lastPeriod.from.toNumber()}` : ''


    // popovers
    const [anchorEl0, setAnchorEl0] = useState<HTMLButtonElement | null>(null);
    const [anchorEl1, setAnchorEl1] = useState<HTMLButtonElement | null>(null);

    const handleClick0 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl0(event.currentTarget);
    };
    const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl1(event.currentTarget);
    };
  
    const handleClose0 = () => {
        setAnchorEl0(null);
    };
    const handleClose1 = () => {
        setAnchorEl1(null);
    };
  
    const open0 = Boolean(anchorEl0)
    const open1 = Boolean(anchorEl1)
    const id0 = open0 ? 'divs-info-popover-0' : undefined
    const id1 = open1 ? 'divs-info-popover-1' : undefined
    

    return (
        <Box className={classes.container}>
            <Box p={0}>
                DAO revenues come from fees charged on profits generated by the protcool. These revenues get distributed, as dividends, to HST token holders.
                <br/>  <br/>
                Fees are currently set at 1% of the profits withdrawn by users.
                Through DAO governance, HST token holders will be able to adjust this percentage.
            </Box>


            <Box my={4}>
                <Horizontal align="center">

                { activeDistribution === undefined && <CircularProgress color="secondary" /> } 

                { activeDistribution == false && 
    
                    <StyledAlert severity={userMessage?.type}>
                        <AlertTitle> No divs distribution in progress</AlertTitle>
                        There are no dividends being distributed right now. Please come back when the next distribution starts.
                    </StyledAlert>
                }
                
                { activeDistribution == true && 
                    <>
                    <Card style={{ width: 270, height: 200 }}  >
                        <CardContent>
                            <div style={{ display:'flex', justifyContent:'center',  marginBottom: 15 }}> 

                                <span style={{ width: 25}}> </span>
                                <Typography variant="body1" style={{ marginBottom: 30 }}> Current  Distribution </Typography>

                                <Button onClick={handleClick0} style={{ height: 25, width: 25 }} ><Info /></Button>
                                <Popover id={id0} open={open0} anchorEl={anchorEl0} onClose={handleClose0} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} >
                                    <Typography style={{ padding: 10}}> { distributionInfo } </Typography>
                                </Popover>


                            </div>
                            <div style={{ display:'flex', justifyContent:'center' }}> 
                                <Typography variant="h5" style={{ marginBottom: 40 }} >
                                    { utils.commify( totalDivsFormatted ) } { depositToken.symbol }
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="body2" align="center"> dividends paid: { rewardsPaidFormatted } {depositToken.symbol} </Typography>
                                {/* <Typography variant="body2" align="center"> { distributionInfo } </Typography> */}
                            </div>
                        </CardContent>
                    </Card>

                    <Card style={{ width: 270, height: 200 }}  >
                        <CardContent>
                            <div style={{ display:'flex', justifyContent:'center', marginBottom: 15 }}> 

                                <span style={{ width: 45}}> </span>
                                <Typography variant="body1" style={{ marginBottom: 30 }}> Your Dividends </Typography> 

                                <Button onClick={handleClick1} style={{ height: 25, width: 25 }} ><Info /></Button>
                                <Popover id={id1} open={open1} anchorEl={anchorEl1} onClose={handleClose1} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} >
                                    <Typography style={{ padding: 10}}> { divsInfo } </Typography>
                                </Popover>

                            </div>
                            <div style={{ display:'flex', justifyContent:'center' }}> 
                                <Typography variant="h5" style={{ marginBottom: 10 }} >
                                    { utils.commify( claimableDivsFormatted ) } { depositToken.symbol }
                                </Typography>
                            </div>
                            
                            <div style={{ display:'flex', justifyContent:'center', marginTop: 20 }}>
                                { didClaimDivs && 
                                    <Typography variant="body2" align="center"> you already claimed {claimedDivsFormatted} {depositToken.symbol}</Typography>
                                }    
                                { !didClaimDivs && 
                                    <Button fullWidth disabled={ didClaimDivs || Number(claimableDivsFormatted) === 0 } name="claim_divs" variant="contained" color="primary" onClick={() => handleClaimButtonPressed()}>
                                        Claim
                                        { isClaimDivsMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                                    </Button>
                                }

                            </div>
                        </CardContent>
                    </Card>
                    </>
                }
                </Horizontal>
            </Box>
        </Box>

    )
}



import React, { useState, useEffect } from "react"

import { utils } from "ethers"
import { useBlockMeta, useNotifications } from "@usedapp/core"
import { Info } from "@material-ui/icons"
import { Button, Popover, CircularProgress } from  "@material-ui/core"

import { useGetDistributionIntervals, useGetDistributiontIntervalsCount,
     useClaimableDivs, useClaimedDivs, useClaimDivs } from "../../hooks/useDivsDistributor"

import { fromDecimals, round } from "../../utils/formatter"

import { SnackInfo } from "../SnackInfo"
import { Token } from "../../types/Token"
import { Box, makeStyles, Typography, Card, CardContent, CardActions } from "@material-ui/core"
import { Horizontal } from "../Layout"
import { NetworkExplorerHost, NetworkExplorerName } from "../../utils/network"



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
            reward: fromDecimals(period.reward, depositToken.decimals, 2),
            rewardPaid: period.rewardPaid,
        }
    })


    const lastPeriod = periods && periods.length > 0 ? periods[periods.length-1] : undefined
    const totalDivsFormatted = lastPeriod ? lastPeriod.reward : ""

    
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
        timeFormatted = `${days}d, ${hrs}h, ${mnts}m`
    }


    const activeDistribution = blockInfo && lastPeriod && blockInfo.blockNumber ? blockInfo.blockNumber >= lastPeriod.from && blockInfo.blockNumber <= lastPeriod.to : undefined
    const lastDistribution = blockInfo && lastPeriod && blockInfo.blockNumber ? blockInfo.blockNumber > lastPeriod.to : undefined


    const distributionTitle = activeDistribution === true ?  "Current Distriution" : lastDistribution === true ? "Past distribution" : ''

    const distributionPeriodInfo = activeDistribution && timeFormatted ? `this distribution will end in approximately ${timeFormatted}`  : 
                                   lastDistribution && timeFormatted ? `last distribution ended ${timeFormatted} ago`  : ''


    const divsInfo = lastPeriod?.from ? `As of HST balance at block ${lastPeriod.from.toNumber()}` : ''


    // popover
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'divs-info-popover' : undefined;
    

    return (
        <Box className={classes.container}>
            <Box p={0}>
                DAO revenues come from the fees charged on profits generated by the protcool.<br/>
                Fees are set at 1% of profits withdrawn by users. <br/>
                Through DAO governance, HST token holders will be able to adjust this percentage and collect their share of of the DAO revenues.
            </Box>


            <Box my={4}>
                <Horizontal align="center">
                    <Card style={{ width: 250, height: 200 }}  >
                        <CardContent>
                                <div style={{ display:'flex', justifyContent:'center' }}> 
                                    <Typography variant="body1" style={{ marginBottom: 30 }}>  {distributionTitle} </Typography>
                                </div>
                                <div style={{ display:'flex', justifyContent:'center' }}> 
                                    <Typography variant="h5" style={{ marginBottom: 30 }} >
                                        { utils.commify( totalDivsFormatted ) } { depositToken.symbol }
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body2" align="center">  {distributionPeriodInfo} </Typography>
                                </div>
                        </CardContent>
                    </Card>

                    <Card style={{ width: 250, height: 200 }}  >
                        <CardContent>
                            { 
                                <>

                                    <div style={{ display:'flex', justifyContent:'center' }}> 

                                        <span style={{ width: 45}}> </span>
                                        <Typography variant="body1" style={{ marginBottom: 30 }}> Your Dividends </Typography> 

                                        <Button onClick={handleClick} style={{ height: 25, width: 25 }} >
                                            <Info color="secondary" />
                                        </Button>
                                        <Popover
                                            id={id}
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}
                                        >
                                            <Typography style={{ padding: 10}}> { divsInfo } </Typography>
                                        </Popover>

                                    </div>
                                    <div style={{ display:'flex', justifyContent:'center' }}> 
                                        <Typography variant="h5" style={{ marginBottom: 10 }} >
                                            { utils.commify( claimableDivsFormatted ) } { depositToken.symbol }
                                        </Typography>
                                    </div>
                                    
                                    <div style={{ display:'flex', justifyContent:'center', marginTop: 20 }}>
                                        {!claimedDivs && 
                                            <Button fullWidth disabled={ claimedDivs || Number(claimableDivsFormatted) === 0 } name="claim_divs" variant="contained" color="primary" onClick={() => handleClaimButtonPressed()}>
                                                Claim
                                                { isClaimDivsMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                                            </Button>
                                        }
                                        {claimedDivs && 
                                            <Typography variant="body2" align="center"> you claimed your dividends </Typography>
                                        }           
                                    </div>

                                </>
                            }
                            
                        </CardContent>
                    </Card>

                </Horizontal>

            </Box>
</Box>

    )
}



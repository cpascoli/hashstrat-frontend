import React, { useState, useEffect } from "react"
import { useNotifications } from "@usedapp/core"

import { useTokenApprove, useTokenAllowance } from "../../hooks"
import { useDepositAndStartStake, useEndStakeAndWithdraw } from "../../hooks/useFarm"

import { Box, Grid, Button, Input, CircularProgress, Divider, Typography, Link, makeStyles } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import { StyledAlert } from "../shared/StyledAlert"

import { SnackInfo } from "../SnackInfo"
import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"
import { toDecimals, fromDecimals } from "../../utils/formatter"
import { NetworkExplorerHost, NetworkExplorerName, FarmAddress } from "../../utils/network"



export interface StakeFormProps {
    formType? :  "stake" | "unstake";
    chainId: number,
    poolId: string,
    token : Token;
    balance: string;
    
    handleSuccess: (result: SnackInfo) => void,
    handleError: (error: SnackInfo) => void,
    allowanceUpdated: () => void;
    onClose: () => void
}


const useStyle = makeStyles( theme => ({
    title: {
        fontWeight: 700,
        fontSize: 20,
    },
    container: {
        padding: 0,
        width: '100%',
        maxWidth: 360,
    },
    section1: {
        margin: `${theme.spacing(2)}px ${theme.spacing(2)}px`
    },
    tokenImg: {
        height: "30px",
        width: "30px",
        marginRight: 20,
        marginLeft: 0,
    },
    amountWithLabel: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20, 
        marginBottom: 50,
        marginLeft: 10,
    },
    amount: {
        fontSize: 28,
        fontWeight: 200,
        textAlign: "right",
        marginRight: 20,
    },
    info:{
        margin: "auto"
    }
}))

export const StakeForm = ({ formType, chainId, poolId, token, balance, handleSuccess, handleError, onClose } : StakeFormProps) => {

    const { symbol, image } = token

    // PoolLP Token Allowance 
    const allowance = useTokenAllowance(chainId, poolId, symbol, FarmAddress(chainId)) // in token decimals

    const { approveErc20, approveErc20State } = useTokenApprove(chainId, poolId, symbol, FarmAddress(chainId))

    const classes = useStyle()
    const { notifications } = useNotifications()

    // const initialAmount = parseFloat(balance)
    const [amount, setAmount] = useState<number | string>("")
    const formattedAllowance = allowance && fromDecimals(allowance, token.decimals, 4)

    const [userMessage, setUserMessage] = useState<SnackInfo>()


    const balancePressed = () => {
        setAmount(balance)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : event.target.value.trim()
        setAmount(newAmount)
    }

    // Approve Tokens
    const isApproveMining = approveErc20State.status === "Mining"
    const approveButtonPressed = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("approveButtonPressed - amount: ", amount, "amountDecimals", amountDecimals)
        return approveErc20(amountDecimals)
    }


    const submitForm = () => {
        setUserMessage(undefined)

        if (formType === 'stake') {
            submitDeposit()
        } else if (formType === 'unstake') {
            submitWithdrawal()
        }
    }


  
    const allowanceOk = formattedAllowance !== undefined && 
                        amount !== undefined && 
                        (parseFloat(formattedAllowance) >= Number(amount) )


    // Deposit and Stake LP Tokens
    const { deposit, depositState } = useDepositAndStartStake(chainId)
    const isDepositMining = depositState.status === "Mining"

    const submitDeposit = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("submit DepositAndStartStake - lptoken: ", token.address, ", amount: ", amount, "amountDecimals", amountDecimals)
        return deposit(token.address, amountDecimals)
    }

    // End Stake and Withdraw Tokens
    const { withdraw, withdrawState } = useEndStakeAndWithdraw(chainId)
    const isWithdrawMining = withdrawState.status === "Mining"
    const submitWithdrawal = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("submit EndStakeAndWithdraw - lptoken: ", token.address, ", amount: ", amount, "amountDecimals", amountDecimals)
        return withdraw(token.address, amountDecimals)
    }

    const submitButtonTitle = (formType === 'stake') ? "Stake" : 
                               (formType === 'unstake') ? "Unstake" : "n/a"

    const explorerHost = NetworkExplorerHost(chainId)
    const approveLink =  (approveErc20State.status === 'Success' && approveErc20State.receipt)? `https://${explorerHost}/tx/${approveErc20State.receipt.transactionHash}` : ""
    const depositLink =  (depositState.status === 'Success' && depositState.receipt)? `https://${explorerHost}/tx/${depositState.receipt.transactionHash}` : ""
    const withdrawLink =  (withdrawState.status === 'Success' && withdrawState.receipt)? `https://${explorerHost}/tx/${withdrawState.receipt.transactionHash}` : ""

    useEffect(() => {
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve Token Transfer"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Token transfer approved",
                linkUrl: approveLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 10000
            }
            setUserMessage({
                type: "info",
                title: "Token transfer approved",
                message: "Now you can Stake the tokens",
            })
            handleSuccess(info)
        }
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Deposit Tokens"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Staking of LP tokens completed",
                linkUrl: depositLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 10000
            }
            setUserMessage({
                type: "info",
                title: "Staking completed",
                message: "Now you can close the window",
            })
            handleSuccess(info)
            setAmount("")
        }

        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Withdraw Tokens"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Unstaking of LP tokens completed",
                linkUrl: withdrawLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 10000
            }
            setUserMessage({
                type: "info",
                title: "Unstaking completed",
                message: "Now you can close the window",
            })
            handleSuccess(info)
            setAmount("")
        }
    }, [notifications, chainId, approveLink, depositLink, withdrawLink])

    
    const showApproveButton =  (isApproveMining || (!allowanceOk && !isDepositMining)) // !allowanceOk  &&  !isDepositMining
    const showDepositButton =  ( !(isApproveMining || (!allowanceOk && !isDepositMining)) && (allowanceOk || isDepositMining)) // (allowanceOk || isDepositMining) && !isApproveMining
    // const showApproveButton =  allowanceOk  &&  !isDepositMining
    // const showDepositButton =  (allowanceOk || isDepositMining) && !isApproveMining

    console.log("allowanceOk", allowanceOk, "formattedAllowance: ", formattedAllowance, "amount", amount, "isApproveMining", isApproveMining, " ==> showApproveButton", showApproveButton)


    return (
        <>
        <div className={classes.container}>

            { userMessage &&
                <div className={classes.info}>
                     <StyledAlert severity={userMessage?.type}>
                        <AlertTitle> {userMessage?.title} </AlertTitle>
                        {userMessage?.message}
                    </StyledAlert>
                </div>
            }
                
            <div className={classes.section1}>
                <h1 className={classes.title}> { formType === 'stake' ? `Stake ${symbol}` : `Unstake ${symbol}` } </h1>
                <Typography color="textSecondary"> 
                    { formType === 'stake' ? 
                        "First approve the token transfer and then Stake the tokens" : 
                         "Unstake LP tokens to withdraw your funds in the Pool" 
                    }
                </Typography>
            </div>
            
            <Divider />

            <Box  alignItems="center" mt={3}>
                <Grid container justifyContent="flex-end">
                    <Link href="#" color="inherit" variant="body2" onClick={() => balancePressed()} >
                        Balance: {balance}
                    </Link>
                </Grid>
                <Grid container justifyContent="center">
                    <div className={classes.amountWithLabel}>
                        <Input className={classes.amount} inputProps={{min: 0, style: { textAlign: 'right' }}}  
                            value={amount} placeholder="0.0" autoFocus onChange={handleInputChange} /> 
                        <img className={classes.tokenImg} src={image} alt="token image" />
                        <Typography color="textSecondary" variant="body1" style={{minWidth:70}} >{symbol}</Typography>
                    </div> 
                </Grid>
            </Box>

            { formType === 'stake' &&
                <Box mb={2} >
                    { showApproveButton &&
                    <Button variant="contained" color="primary" fullWidth disabled={amount === ''}
                        onClick={() => approveButtonPressed()} >
                        Approve transfer
                        { isApproveMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                    </Button>
                    }


                    { showDepositButton && 
                    <Button variant="contained" color="primary" fullWidth  
                        onClick={() => submitForm()} >
                        { submitButtonTitle }
                        { isDepositMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                    </Button>
                    }

                    { userMessage && userMessage.title === 'Staking completed' &&
                        <Box mt={2} >
                            <Button variant="contained" color="secondary" fullWidth onClick={onClose} >
                                Close
                            </Button>
                        </Box>
                    }
                </Box>
  
            }  
            { formType === 'unstake' &&
                <Box mb={2} >
                    <Button variant="contained" color="primary" fullWidth disabled={amount === ''}
                        onClick={() => submitForm()}>
                        { submitButtonTitle }
                        { isWithdrawMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                    </Button>
                    { userMessage && userMessage.title === 'Unstaking completed' &&
                        <Box mt={2} >
                            <Button variant="contained" color="secondary" fullWidth onClick={onClose} >
                                Close
                            </Button>
                        </Box>
                    }
                </Box>
            }

            </div>
        
            {
                (approveErc20State.status === 'Mining' || depositState.status  === 'Mining' || withdrawState.status === 'Mining' ) ? 
                    <Typography color="textSecondary" variant="body2" >  Mining... </Typography> : 
                (approveErc20State.status === 'Exception' || depositState.status  === 'Exception' || withdrawState.status === 'Exception' ) ? 
                    <Typography color="error" variant="body2" >  
                        { approveErc20State.errorMessage } { depositState.errorMessage } { withdrawState.errorMessage }
                    </Typography> : ''
            }

        </>
    )
}
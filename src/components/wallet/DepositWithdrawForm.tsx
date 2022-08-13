import React, { useState, useEffect } from "react"
import { useNotifications } from "@usedapp/core"
import { Box, Grid, Button, Input, CircularProgress, Divider, Typography, Link, makeStyles } from "@material-ui/core"
import { useTokenApprove, useTokenAllowance, useDeposit, useWithdraw } from "../../hooks"
import { Token } from "../../types/Token"
import { toDecimals, fromDecimals } from "../../utils/formatter"
import { NetworkExplorerHost, NetworkExplorerName, PoolAddress} from "../../utils/network"
import { SnackInfo } from "../SnackInfo"
import { Horizontal } from "../Layout"
import { Alert, AlertTitle } from "@material-ui/lab"


export interface DepositWithdrawFormProps {
    formType? : "deposit" | "withdraw";
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

export const DepositWithdrawForm = ({ formType, chainId, poolId, token, balance, handleSuccess, handleError, onClose } : DepositWithdrawFormProps) => {

    const { symbol, image } = token

    // Token Allowance 
    const allowance = useTokenAllowance(chainId, poolId, symbol, PoolAddress(chainId, poolId)) // in token decimals

    const { approveErc20, approveErc20State } = useTokenApprove(chainId, poolId, symbol, PoolAddress(chainId, poolId))

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

        if (formType === 'deposit') {
            submitDeposit()
        } else if (formType === 'withdraw') {
            submitWithdrawal()
        }
    }


  
    const allowanceOk = formattedAllowance !== undefined && 
                        amount !== undefined && 
                        (parseFloat(formattedAllowance) >= Number(amount) )


    // Deposit Tokens
    const { deposit, depositState } = useDeposit(chainId, poolId)
    const isDepositMining = depositState.status === "Mining"

    const submitDeposit = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("submitDeposit - amount: ", amount, "amountDecimals", amountDecimals)
        return deposit(amountDecimals)
    }

    // Withdraw Tokens
    const { withdraw, withdrawState } = useWithdraw(chainId, poolId)
    const isWithdrawMining = withdrawState.status === "Mining"
    const submitWithdrawal = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("submitWithdrawal - amount: ", amount, "amountDecimals", amountDecimals)
        return withdraw(amountDecimals)
    }

    const submitButtonTitle = (formType === 'deposit') ? "Deposit" : 
                               (formType === 'withdraw') ? "Withdraw" : "n/a"

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
                message: "Now you can deposit the tokens",
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
                message: "Deposit completed",
                linkUrl: depositLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 10000
            }
            setUserMessage({
                type: "info",
                title: "Deposit completed",
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
                message: "Withdrawal completed",
                linkUrl: withdrawLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 10000
            }
            setUserMessage({
                type: "info",
                title: "Withdrawals completed",
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

    return (
        <>
        <div className={classes.container}>

            { userMessage &&
                <div className={classes.info}>
                     <Alert severity={userMessage?.type}>
                        <AlertTitle> {userMessage?.title} </AlertTitle>
                        {userMessage?.message}
                    </Alert>
                </div>
            }
                
            <div className={classes.section1}>
                <h1 className={classes.title}> {formType === 'deposit'? `Deposit ${symbol}` : 'Withdraw Liquidity' } </h1>
                <Typography color="textSecondary"> 
                   First approve and then transfer the tokens.
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
                        <Typography color="textSecondary" variant="body1" style={{minWidth:70}}>{symbol}</Typography>
                    </div> 
                </Grid>
            </Box>

            { formType === 'deposit' &&
                <Box mb={2} >
                    { showApproveButton &&
                    <Button variant="contained" color="primary" fullWidth disabled={amount === ''}
                        onClick={() => approveButtonPressed()} >
                        Approve {symbol} 
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

                    { userMessage && userMessage.title === 'Deposit completed' &&
                        <Box mt={2} >
                            <Button variant="contained" color="secondary" fullWidth onClick={onClose} >
                                Close
                            </Button>
                        </Box>
                    }
                </Box>
  
            }  
            { formType === 'withdraw' &&
                <Box mb={2} >
                    <Button variant="contained" color="primary" fullWidth disabled={amount === ''}
                        onClick={() => submitForm()}>
                        { submitButtonTitle }
                        { isWithdrawMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                    </Button>
                    { userMessage && userMessage.title === 'Withdrawals completed' &&
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
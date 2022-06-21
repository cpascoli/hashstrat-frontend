import React, { useState, useEffect } from "react"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { Box, Grid, Button, Input, CircularProgress, Snackbar, Divider, Typography, Link, makeStyles } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useTokenApprove, useTokenAllowance, useDeposit, useWithdraw } from "../hooks"
import { Token } from "./Main"
import { toDecimals, fromDecimals } from "../utils/formatter"

export interface DepositWithdrawFormProps {
    formType? : string;
    chainId: number,
    token : Token;
    balance: string;

    handleSuccess: (result: any) => void;
    handleError: (error: any, message: string) => void;
    allowanceUpdated: () => void;
}


const useStyle = makeStyles( theme => ({
    title: {
        fontWeight: 700,
        fontSize: 20,
    },
    container: {
        // display: "grid",
        // gridTemplateColumns: "repeat(1, 1fr)",
        // gap: theme.spacing(0),
        padding: 0,
        width: '100%',
        maxWidth: 360,
        // backgroundColor: theme.palette.background.default,
        // backgroundColor: "red"
    },
    section1: {
        margin: `${theme.spacing(2)}px ${theme.spacing(2)}px`
    },
    tokenImg: {
        height: "30px",
        width: "30px",
        marginRight: 20,
        marginLeft: 0,
        // margin: "auto",
    },
    amountWithLabel: {
        // border: "1px solid black",
        // margin: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // gap: theme.spacing(2),
        marginTop: 20, 
        marginBottom: 50,
        marginLeft: 10,
    },
    amount: {
        fontSize: 28,
        fontWeight: 200,
        textAlign: "right",
        marginRight: 20,
    }
}))

export const DepositWithdrawForm = ({ formType, chainId, token, balance } : DepositWithdrawFormProps) => {


    const { symbol, image, address } = token

    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showDepositTokenSuccess, setShowDepositTokenSuccess] = useState(false)
    const [showWithdrawTokenSuccess, setShowWithdrawTokenSuccess] = useState(false)

    // Token Allowance 
    const allowance = useTokenAllowance(chainId, symbol) // in token decimals
    const { approveErc20, approveErc20State } = useTokenApprove(chainId, symbol)

    const classes = useStyle()
    const { notifications } = useNotifications()

    // const initialAmount = parseFloat(balance)
    const [amount, setAmount] = useState<number | string>("")
    const formattedAllowance = allowance && fromDecimals(allowance, token.decimals, 4)

    const balancePressed = () => {
        setAmount(balance)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        const newAmount = event.target.value === "" ? "" : event.target.value.trim()
        setAmount(newAmount)
        console.log("handleInputChange - amount: ", newAmount)
    }

    // Approve Tokens
    const isApproveMining = approveErc20State.status === "Mining"
    const approveButtonPressed = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("approveButtonPressed - amount: ", amount, "amountDecimals", amountDecimals)
        return approveErc20(amountDecimals)
    }


    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowDepositTokenSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve Token Transfer").length > 0) {
            setShowErc20ApprovalSuccess(true)
            setShowDepositTokenSuccess(false)
            setShowWithdrawTokenSuccess(false)
        }
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Deposit Tokens"
        ).length > 0) {
            setShowErc20ApprovalSuccess(false)
            setShowDepositTokenSuccess(true)
            setShowWithdrawTokenSuccess(false)
        }

        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Withdraw Tokens"
        ).length > 0) {
            setShowErc20ApprovalSuccess(false)
            setShowDepositTokenSuccess(false)
            setShowWithdrawTokenSuccess(true)
        }
    }, [notifications, showErc20ApprovalSuccess, showDepositTokenSuccess, showWithdrawTokenSuccess])



    const submitForm = () => {
        console.log("submitForm")
        if (formType === 'deposit') {
            submitDeposit()
        } else if (formType === 'withdraw') {
            submitWithdrawal()
        }
    }


    const allowanceOk = formattedAllowance && amount && (parseFloat(formattedAllowance) >= amount)

    // Deposit Tokens
    const { deposit, depositState } = useDeposit(chainId)
    const isDepositMining = depositState.status === "Mining"

    const submitDeposit = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("submitDeposit - amount: ", amount, "amountDecimals", amountDecimals)
        return deposit(amountDecimals)
    }

    // Withdraw Tokens
    const { withdraw, withdrawState } = useWithdraw(chainId)
    const isWithdrawMining = withdrawState.status === "Mining"
    const submitWithdrawal = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("submitWithdrawal - amount: ", amount, "amountDecimals", amountDecimals)
        return withdraw(amountDecimals)
    }

    const submitButtonTitle = (formType === 'deposit') ? "Deposit" :  (formType === 'withdraw') ? "Withdraw" : "n/a"


    return (
        <>
        <div className={classes.container}>
                
            <div className={classes.section1}>
                <h1 className={classes.title}> {formType === 'deposit'? 'Add Liquidity' : 'Remove Liquidity' } </h1>
                <Typography color="textSecondary"> Deposit tokens into the pool</Typography>
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
                        <Typography color="textSecondary" variant="body1" >{symbol}</Typography>
                    </div> 
                </Grid>
            </Box>


                { formType === 'deposit' &&
                    <Box mb={2} >
                       { !allowanceOk && 
                        <Button  variant="contained" color="primary" fullWidth disabled={allowanceOk}
                            onClick={() => approveButtonPressed()} >
                            {isApproveMining ? <CircularProgress size={26} title={`Approve ${symbol}`} /> : `Approve ${symbol}`}
                        </Button>
                        }
                        { allowanceOk && 
                        <Button variant="contained" color="primary" fullWidth  
                            onClick={() => submitForm()} disabled={!allowanceOk} >
                            {isDepositMining ? <CircularProgress size={26} title={submitButtonTitle} /> : submitButtonTitle }
                        </Button>
                        }
                    </Box>
                }  
                { formType === 'withdraw' &&
                    <Box  >
                        <Button variant="contained" color="primary" fullWidth
                            onClick={() => submitForm()}>
                            {isWithdrawMining ? <CircularProgress size={26} title={submitButtonTitle} /> : submitButtonTitle }
                        </Button>
                    </Box>
                }  


            </div>

            { approveErc20State.status !== 'None' && <Typography color="textSecondary" variant="body1" >Approve Erc20 state:{ approveErc20State.status} </Typography> } 
            { depositState.status !== 'None' && <Typography color="textSecondary" variant="body1" > depositState state:{ depositState.status} </Typography> } 
            <Typography color="textSecondary" variant="body2" > 
                Current Allowance of {formattedAllowance} {symbol} is {allowanceOk ? "sufficient" : "insufficient"} to deposit
            </Typography>
        
            <Snackbar
                open={showErc20ApprovalSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    Token Transfer Approved!
                </Alert>
            </Snackbar>
            <Snackbar
                open={showDepositTokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Tokens Deposited into the Pool!
                </Alert>
            </Snackbar>
            <Snackbar
                open={showWithdrawTokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Tokens Withdrawn from the Pool!
                </Alert>
            </Snackbar>
        </>
    )
}
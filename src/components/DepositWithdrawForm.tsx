import React, { useState, useEffect } from "react"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { Button, Input, CircularProgress, Snackbar, makeStyles } from "@material-ui/core"
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
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        gap: theme.spacing(2),
        border: "1px solid black",
        padding: 20,
        minWidth: "300px",

        // backgroundColor: "red"
    },
    tokenImg: {
        height: "30px",
        width: "30px",
        margin: "auto",
        // padding: 2
    },
    amountWithLabel: {
        // border: "1px solid black",
        margin: "auto",
        display: "flex",
        gap: theme.spacing(2),
    },
    amount: {
        fontWeight: 700,
        textAlign: "right"
    }
}))

export const DepositWithdrawForm = ({ formType, chainId, token, balance } : DepositWithdrawFormProps) => {


    const { symbol, image, address } = token

    const classes = useStyle()
    const { notifications } = useNotifications()

    const initialAmount = parseFloat(balance)
    const [amount, setAmount] = useState<number | string>(initialAmount)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log("handleInputChange - amount: ", newAmount)
    }


    // Approve Tokens
    const { approveErc20, approveErc20State } = useTokenApprove(chainId, symbol)
    const isApproveMining = approveErc20State.status === "Mining"
    const approveButtonPressed = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("approveButtonPressed - amount: ", amount, "amountDecimals", amountDecimals)
        return approveErc20(amountDecimals)
    }

    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showDepositTokenSuccess, setShowDepositTokenSuccess] = useState(false)
    const [showWithdrawTokenSuccess, setShowWithdrawTokenSuccess] = useState(false)

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

    // Token Allowance 
    const allowance = useTokenAllowance(chainId, symbol) // in token decimals
    const formattedAllowance = allowance && fromDecimals(allowance, token.decimals, 4)
    console.log(">>> allowance: ", allowance, "formattedAllowance: ", formattedAllowance, "amount: ", amount, typeof amount)

    const allowanceOk = formattedAllowance && amount && (parseFloat(formattedAllowance) >= amount)
    console.log(">>> allowanceOk: ", allowanceOk)


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

                <label> {formType?.toUpperCase()} </label>

                <div className={classes.amountWithLabel}>
                
                    <Input className={classes.amount} inputProps={{min: 0, style: { textAlign: 'right' }}}  value={amount} placeholder={symbol} onChange={handleInputChange} /> 
                    <img className={classes.tokenImg} src={image} alt="token image" />
                </div> 

                { formType === 'deposit' &&
                    <div style={{ textAlign: "center" }} className="mt-4">
                        <Button name="allow" type="button" variant="contained" disabled={allowanceOk}
                            onClick={() => approveButtonPressed()} className="pl-2">
                            {isApproveMining ? <CircularProgress size={26} title="Allow token transfer" /> : "Allow token transfer"}
                        </Button>
                        <Button variant="contained" onClick={() => submitForm()} disabled={!allowanceOk} >
                            {isDepositMining ? <CircularProgress size={26} title={submitButtonTitle} /> : submitButtonTitle }
                        </Button>
                    </div>
                }  
                { formType === 'withdraw' &&
                    <div style={{ textAlign: "center" }} className="mt-4">
                        <Button variant="contained" onClick={() => submitForm()}>
                            {isWithdrawMining ? <CircularProgress size={26} title={submitButtonTitle} /> : submitButtonTitle }
                        </Button>
                    </div>
                }  



                <label> approveErc20 state:{ approveErc20State.status} </label>
                <label> depositState state:{ depositState.status} </label>
                <label> allowance: {formattedAllowance} sufficient: {allowanceOk ? "true" : "false"} </label>
            </div>
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
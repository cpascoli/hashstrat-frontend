import React, { useState, useEffect } from "react"
import { useNotifications } from "@usedapp/core"
import { BigNumber } from "ethers"


import { Box, Grid, Button, Input, CircularProgress, Divider, Typography, Link, makeStyles } from "@material-ui/core"
import { useTokenApprove, useTokenAllowance, useTokenBalance } from "../../hooks/useErc20Tokens"
import { useLpTokensValue, useDeposit, useWithdraw, useFeesForWithdraw } from "../../hooks/usePool"


import { Token } from "../../types/Token"
import { toDecimals, fromDecimals } from "../../utils/formatter"
import { NetworkExplorerHost, NetworkExplorerName, PoolAddress} from "../../utils/network"
import { SnackInfo } from "../SnackInfo"
import { Horizontal } from "../Layout"
import { Alert, AlertTitle } from "@material-ui/lab"
import { StyledAlert } from "../shared/StyledAlert"
import { DepositToken } from "../../utils/pools"


export interface DepositWithdrawFormProps {
    formType? : "deposit" | "withdraw";
    chainId: number,
    poolId: string,
    token : Token;
    balance: string;
    account: string;

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

    amount: {
        fontSize: 28,
        fontWeight: 200,
        textAlign: "right",
        marginRight: 0,
    },
    info:{
        margin: "auto"
    }
}))





export const DepositWithdrawForm = ({ formType, chainId, poolId, token, balance, handleSuccess, handleError, onClose, account} : DepositWithdrawFormProps) => {

    const classes = useStyle()
    const { symbol, image } = token

    // Token stats 
    const allowance = useTokenAllowance(chainId, poolId, symbol, PoolAddress(chainId, poolId)) // in token decimals
    const tokenBalance = useTokenBalance(chainId, poolId, "pool-lp", account);

    // form state management
    const [amount, setAmount] = useState<number | string>("")
    const [isValidAmount, setIsValidAmount] = useState<boolean>(false) 
    const [amountDecimals, setAmountDecimals] = useState<string>("")
    const [userMessage, setUserMessage] = useState<SnackInfo>()

    // withdraw only data (fees are only available for pools)
    const lpTokensValue =  useLpTokensValue(chainId, poolId, amountDecimals)
    const feesForWithdraw = useFeesForWithdraw(chainId, poolId, amountDecimals, account)

    
    const { approveErc20, approveErc20State } = useTokenApprove(chainId, poolId, symbol, PoolAddress(chainId, poolId))
    const { notifications } = useNotifications()


    // formatted values
    const depositToken = DepositToken(chainId)
    const formattedAllowance = allowance && fromDecimals(allowance, token.decimals, 4)
    const formattedLTokensValue = lpTokensValue ? fromDecimals( BigNumber.from(lpTokensValue), depositToken!.decimals, 2) : ""
    const formattedFeesToWithdraw = feesForWithdraw ? fromDecimals( BigNumber.from(feesForWithdraw), depositToken!.decimals, 2) : ""


    // Form Handlers

    const balancePressed = () => {
        updateAmount(balance)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : event.target.value.trim()
        updateAmount(newAmount)
    }

    // validates the deposit/withdrawal amount and its decimal amount
    const updateAmount = (newAmount: string) => {
        setAmount(newAmount)
        const amounDec = Number(newAmount)
        const validAmount = newAmount !== '' && !isNaN(amounDec) 

        const amountDecimals = toDecimals( validAmount ? amounDec.toString() : "0", token.decimals)
        setAmountDecimals(amountDecimals)
        setIsValidAmount(validAmount)
    }



    // Approve Tokens
    const isApproveMining = approveErc20State.status === "Mining"
    const approveButtonPressed = () => {
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
                        amount !== undefined && amount !== '' && 
                        (parseFloat(formattedAllowance) >= Number(amount) )


    // Deposit Tokens
    const { deposit, depositState } = useDeposit(chainId, poolId)
    const isDepositMining = depositState.status === "Mining"

    const submitDeposit = () => {
        // const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("submitDeposit - amount: ", amount, "amountDecimals", amountDecimals)
        return deposit(amountDecimals)
    }

    // Withdraw Tokens
    const { withdraw, withdrawState } = useWithdraw(chainId, poolId)
    const isWithdrawMining = withdrawState.status === "Mining"
    
    const submitWithdrawal = () => {
        const currentBalance = tokenBalance ? tokenBalance.toString() : balance
        if ( isVeryCloseValues(amountDecimals ,  currentBalance) ) {
            console.log("submitWithdrawal - should withdraw all!  currentBalance => ", currentBalance)
        }
        
        const withdrawAmount = isVeryCloseValues( amountDecimals ,  currentBalance ) ? currentBalance : amountDecimals
        return withdraw(withdrawAmount)
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
            updateAmount("")
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
            updateAmount("")
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
                     <StyledAlert severity={userMessage?.type}>
                        <AlertTitle> {userMessage?.title} </AlertTitle>
                        {userMessage?.message}
                    </StyledAlert>
                </div>
            }
                
            <div className={classes.section1}>
                <h1 className={classes.title}> {formType === 'deposit'? `Deposit ${symbol}` : 'Withdraw Liquidity' } </h1>
                <Typography color="textSecondary"> 
                   First approve and then transfer the tokens.
                </Typography>
            </div>
            
            <Divider />

            <Box mt={3} mb={2}>

                <Grid container justifyContent="flex-start"> 
                    <Link href="#" color="inherit" variant="body2" onClick={() => balancePressed()} style={{textDecoration: "underline"}} >
                        Balance: {balance}
                    </Link>
                </Grid>

                <Grid container justifyContent="space-between">
                    {/* first row */}
                    <Grid item xs={9} >
                        <Input className={classes.amount} inputProps={{min: 0, style: { textAlign: 'right' }}}  
                            value={amount} placeholder="0.0" autoFocus onChange={handleInputChange} /> 
                    </Grid> 
                    <Grid item xs={3} >
                        <Box style={{paddingTop: 12, paddingLeft: 5}}>
                            <Typography color="textSecondary" variant="body1" style={{minWidth:70}}>{symbol}</Typography>
                        </Box>
                    </Grid> 
                    {/* second row */}
                    <Grid item xs={9} >
                        { formType === 'withdraw' && 
                            <Box py={2}>
                                <Horizontal spacing="between">
                                    <Typography variant="body2">{`${isValidAmount && formattedFeesToWithdraw ? 'fees: ≈ $'+formattedFeesToWithdraw : ' ' }` } </Typography>
                                    <Typography variant="body2">{`${isValidAmount && formattedLTokensValue ? '≈ $'+formattedLTokensValue : ' ' }` } </Typography>
                                </Horizontal>
                            </Box>
                        }
                    </Grid> 
                    <Grid item xs={2} > </Grid> 
                </Grid>
    
            </Box>

            { formType === 'deposit' &&
                <Box mb={2} >
                    { showApproveButton &&
                    <Button variant="contained" color="secondary" fullWidth disabled={ !isValidAmount }
                        onClick={() => approveButtonPressed()} >
                        Approve {symbol} 
                        { isApproveMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                    </Button>
                    }


                    { showDepositButton && 
                    <Button variant="contained" color="primary" fullWidth disabled={ !isValidAmount }
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
                    <Button variant="contained" color="primary" fullWidth disabled={ !isValidAmount }
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



// returns true if the 2 values are closer than 0.01 % difference
const isVeryCloseValues = (value1: string, value2: string) : boolean => {
    const a = BigNumber.from(value1) 
    const b = BigNumber.from(value2)
    if (a.eq(BigNumber.from(0)) && b.eq(BigNumber.from(0))) return true

    const diff = a.gte(b) ? a.sub(b) : b.sub(a)
    const max = a.gte(b) ? a : b
    const percDiff = diff.mul(BigNumber.from(1000)).div(max)

    return percDiff.toNumber()  < 1
}

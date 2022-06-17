import { Grid, Input, Button, makeStyles } from  "@material-ui/core"

export interface DepositWithdrawFormProps {
    formType? : string;
    tokenSymbol : string;
    tokenImgSrc: string;
    balance: string;

    handleSuccess: (result: any) => void;
    handleError: (error: any, message: string) => void;
    allowanceUpdated: () => void;
}


const useStyle = makeStyles( theme => ({
    container: {
        display: "inline-grid",
        gridTemplateColumns: "auto auto auto",
        gap: theme.spacing(1) 
    },
    tokenImg: {
        width: "20px"
    },
    amount: {
        fontWeight: 700
    }
}))

export const DepositWithdrawForm = ({ formType, tokenSymbol, tokenImgSrc, balance } : DepositWithdrawFormProps) => {

    const classes = useStyle()

    const allowButtonPressed = () => {
        console.log("allowButtonPressed")
    }

    const submitForm = () => {
        console.log("submitForm")
    }

    const submitButtonTitle = (formType === 'deposit') ? "Deposit" :  (formType === 'withdraw') ? "Withdraw" : "n/a"
    const amount = parseFloat(balance)


    return (
        <div className={classes.container}>
            <div> == {formType} Form == </div>
            <div>{tokenSymbol}</div>

            <Input className={classes.amount} value={amount} placeholder=""/> {tokenSymbol}

            <img className={classes.tokenImg} src={tokenImgSrc} alt="token image" />

            <div style={{ textAlign: "center" }} className="mt-4">
                    <Button name="allow" type="button" variant="outlined"
                        onClick={() => allowButtonPressed()} className="pl-2">
                        Allow token transfer
                    </Button>
                &nbsp;&nbsp;&nbsp;
                    <Button variant="outlined" onClick={() => submitForm()} >
                        {submitButtonTitle}
                    </Button>
                
            </div>

        </div>
    )
}
import { useState } from "react"
import { useEthers, useTokenBalance } from "@usedapp/core"

import { Box, Grid, Paper, Button, makeStyles } from  "@material-ui/core"
import { TitleValueBox } from './TitleValueBox'
import { DepositWithdrawForm } from './DepositWithdrawForm'

import { Modal } from "./Modal"
import { Token } from "./Main"

import { fromDecimals } from "../utils/formatter"



interface DepositWithdrawViewProps {
  formType?: string,
  chainId: number,
  token: Token;
  handleSuccess: (result: any) => void,
  handleError: (error: any, message: string) => void,
}


const useStyle = makeStyles( theme => ({
  container: {
    margin: "auto",
    padding: theme.spacing(1),
    textAlign: 'center',
    maxWidth: "500px",
  },
  balanceView: {
    marginBottom: "20px",
  }
}))



export const DepositWithdrawView = ( { formType, chainId, token, handleSuccess, handleError } : DepositWithdrawViewProps ) => {

  const classes = useStyle()
  const [showUpdateStakeModal, setShowUpdateStakeModal] = useState(false);
  const [formTypeValue, setFormTypeValue] = useState(formType);


  const { symbol, image, address } = token
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedTokenBalance = tokenBalance && fromDecimals(tokenBalance, token.decimals, 2) || "0.0"

  const showModalPressed = (buttonType: string) => {
    setShowUpdateStakeModal(true)
    console.log("handleAllowanceUpdated - buttonType: ", buttonType)
    setFormTypeValue(buttonType)
  }

  const hideModalPreseed = () => {

    console.log("hideModalPreseed")
    setShowUpdateStakeModal(false)
    setFormTypeValue(undefined)
  }

  const handleAllowanceUpdated = () => {
    console.log("handleAllowanceUpdated")
  }
  

    return (
      <Box className={classes.container}>
          <div className={classes.balanceView}>
            <TitleValueBox title={`Available to ${formType}`} value={formattedTokenBalance} tokenSymbol={symbol} />
          </div>
          <Box sx={{ flexGrow: 1, pt: 2 }}>
              <Grid container>
                { formType === 'deposit' && 
                  <Grid item xs={12}>
                      <Box >
                          <Button name="deposit" variant="contained" onClick={(e) => showModalPressed("deposit")}>
                            Deposit
                          </Button>
                      </Box>
                  </Grid>
                }
                { formType === 'withdraw' &&
                  <Grid item xs={12}>
                      <Box>
                          <Button name="withdraw" variant="contained" onClick={(e) => showModalPressed("withdraw")}>
                            Withdraw
                          </Button>
                      </Box>
                  </Grid>
                }
              </Grid>
          </Box>
          

          {showUpdateStakeModal && (
            <Modal onClose={(e) => hideModalPreseed()}>
              <DepositWithdrawForm
                formType={formTypeValue}
                balance={formattedTokenBalance}
                chainId={chainId}
                token={token}
                handleSuccess={handleSuccess}
                handleError={handleError}
                allowanceUpdated={handleAllowanceUpdated}
              /> 
            </Modal>
          )}
      </Box>
    )

}
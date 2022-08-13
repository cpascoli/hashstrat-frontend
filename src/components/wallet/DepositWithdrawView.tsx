import { useState } from "react"
import { useEthers, useTokenBalance } from "@usedapp/core"

import { Box, Grid, Button, Typography, Link, makeStyles } from  "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { TitleValueBox } from '../TitleValueBox'
import { DepositWithdrawForm } from './DepositWithdrawForm'

import { Modal } from "../Modal"
import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { SnackInfo } from "../SnackInfo"


interface DepositWithdrawViewProps {
  formType: "deposit" | "withdraw",
  chainId: number,
  poolId: string,
  token: Token;
  handleSuccess: (result: SnackInfo) => void,
  handleError: (error: SnackInfo) => void,
}


const useStyle = makeStyles( theme => ({
  container: {
    margin: "auto",
    padding: theme.spacing(1),
    textAlign: 'center',
    maxWidth: "500px",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  balanceView: {
    marginBottom: "20px",
  }
}))



export const DepositWithdrawView = ( { formType, chainId, poolId, token, handleSuccess, handleError } : DepositWithdrawViewProps ) => {

  const classes = useStyle()
  const [showUpdateStakeModal, setShowUpdateStakeModal] = useState(false);
  const [formTypeValue, setFormTypeValue] = useState(formType);

  const { symbol, image, address } = token
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedTokenBalance = tokenBalance && fromDecimals(tokenBalance, token.decimals, 2) || "0.0"

  const showModalPressed = (buttonType: 'deposit' | 'withdraw') => {
    setShowUpdateStakeModal(true)
    setFormTypeValue(buttonType)
  }

  const hideModalPreseed = () => {
    setShowUpdateStakeModal(false)
    setFormTypeValue('deposit')
  }

  const handleAllowanceUpdated = () => {
    console.log("handleAllowanceUpdated")
  }
  
  return (
      <Box className={classes.container}>

           {  formType === 'deposit' &&  chainId === 137  && formattedTokenBalance === "0" &&
              <Alert severity="info" style={{textAlign: "center", marginBottom: 20}} > 
                  <AlertTitle>No {symbol} to deposit</AlertTitle>
                  You can get {token.symbol} tokens directly on Polygon using <Link href="https://quickswap.exchange/#/swap" target="_blank"> QuickSwap</Link>,
                  or transfer {token.symbol} from Ethereum to Polygon via the <Link href="https://wallet.polygon.technology/bridge" target="_blank">Polygon Bridge</Link>
              </Alert>
          }

          {  formType === 'withdraw' &&  chainId === 137  && formattedTokenBalance === "0" &&
              <Alert severity="info" style={{textAlign: "center", marginBottom: 20}} > 
                  <AlertTitle>No {symbol} to withdraw</AlertTitle>
                  If you staked some {symbol} tokens, you need to un-stake them before you can withdraw funds from the pool.
              </Alert>
          }

          <div className={classes.balanceView}>
            <TitleValueBox title={`Available to ${formType}`} value={formattedTokenBalance} suffix={symbol} border={true} />
          </div>
          <Box sx={{ flexGrow: 1, pt: 2 }}>
              <Grid container>
                { formType === 'deposit' && 
                  <Grid item xs={12}>
                      <Box >
                          <Button name="deposit" variant="contained" color="primary" onClick={(e) => showModalPressed("deposit")}>
                            Deposit
                          </Button>
                      </Box>
                  </Grid>
                }
                { formType === 'withdraw' &&
                  <Grid item xs={12}>
                      <Box>
                          <Button name="withdraw" variant="contained" color="primary" onClick={(e) => showModalPressed("withdraw")}>
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
                poolId={poolId}
                token={token}
                handleSuccess={handleSuccess}
                handleError={handleError}
                allowanceUpdated={handleAllowanceUpdated}
                onClose={hideModalPreseed}
              /> 
            </Modal>
          )}
      </Box>
    )

}
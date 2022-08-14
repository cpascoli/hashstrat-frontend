import { useState } from "react"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { useStakedTokenBalance } from "../../hooks/useFarm"

import { Box, Grid, Button, makeStyles, styled} from  "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import { StyledAlert } from "../shared/StyledAlert"

import { TitleValueBox } from '../TitleValueBox'

import { Modal } from "../Modal"
import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { SnackInfo } from "../SnackInfo"

import { StakeForm } from "./StakeForm"


interface StakingViewProps {
  formType :  "stake" | "unstake";
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



export const StakingView = ( { chainId, poolId, token, formType, handleSuccess, handleError } : StakingViewProps ) => {

  const classes = useStyle()
  const [showUpdateStakeModal, setShowUpdateStakeModal] = useState(false);

  const { symbol, address } = token
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedTokenBalance = tokenBalance && fromDecimals(tokenBalance, token.decimals, 2) || "0.0"

  const tokenStakedBalance = useStakedTokenBalance(chainId, poolId, account)
  const formattedTokenStakedBalance = tokenStakedBalance && fromDecimals(tokenStakedBalance, token.decimals, 2) || "0.0"

  const showModalPressed = () => {
    setShowUpdateStakeModal(true)
  }

  const hideModalPreseed = () => {
    setShowUpdateStakeModal(false)
  }

  const handleAllowanceUpdated = () => {
    console.log("handleAllowanceUpdated")
  }
  

  return (
      <Box className={classes.container}>

            { formType === 'stake' && formattedTokenBalance === "0" &&
                <StyledAlert severity="info" color="info" style={{textAlign: "center", marginBottom: 20 }} > 
                    <AlertTitle>No {symbol} tokens to stake</AlertTitle>
                    Deposit funds into a Pool to get {symbol} tokens that you can stake here to earn HashStrat DAO tokens (HST)
                </StyledAlert>
            }


          <div className={classes.balanceView}>
            <TitleValueBox title={`Available to ${formType === 'stake' ? 'Stake' : 'Unstake'}`} 
                    value={ formType === 'stake' ? formattedTokenBalance : formattedTokenStakedBalance } suffix={symbol} border={true} />
          </div>
          <Box sx={{ flexGrow: 1, pt: 2 }}>
              <Grid container>
            
                  <Grid item xs={12}>
                      <Box >
                        <Button name="stake" variant="contained" color="primary" onClick={(e) => showModalPressed()}>
                            { formType === 'stake' ?  "Stake" : "Unstake" }
                        </Button> 
                      </Box>
                  </Grid>
              </Grid>
          </Box>
          

          {showUpdateStakeModal && (
            <Modal onClose={(e) => hideModalPreseed()}>

              <StakeForm
                formType={formType}
                balance={ formType === 'stake' ? formattedTokenBalance : formattedTokenStakedBalance }
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
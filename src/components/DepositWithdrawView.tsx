
import React from 'react'
import { useState } from "react"


import { styled } from "@material-ui/core/styles"
import { Box, Grid, Paper, Button, makeStyles } from  "@material-ui/core"
import { TitleValueBox } from './TitleValueBox'
import { DepositWithdrawForm } from './DepositWithdrawForm'

import { Modal } from "./Modal"

interface DepositWithdrawViewProps {
  formType?: string,
  balanceUSDC: string;
  portfolioValue: string;
  tokenSymbol: string
  tokenImgSrc: string,
  handleSuccess: (result: any) => void,
  handleError: (error: any, message: string) => void,
}




const useStyle = makeStyles( theme => ({
  container: {
    padding: theme.spacing(2),
    textAlign: 'center',
    width: "100%",
  }
}))



export const DepositWithdrawView = ( { formType, balanceUSDC, portfolioValue, tokenSymbol, tokenImgSrc, handleSuccess, handleError } : DepositWithdrawViewProps ) => {

  const classes = useStyle()
  const [showUpdateStakeModal, setShowUpdateStakeModal] = useState(false);
  const [formTypeValue, setFormTypeValue] = useState(formType);


  const showModalPreseed = (buttonType: string) => {

    setShowUpdateStakeModal(true)
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
  

    //const { showUpdateStakeModal, formType, balanceUSDC, portfolioValue, depositTokenSymbol } = this.state

    return (
      <Box>

          <TitleValueBox title="Available to deposit" value={balanceUSDC} tokenSymbol={tokenSymbol} />

          <Box sx={{ flexGrow: 1, pt: 2 }}>
              <Grid container >
                  <Grid item xs={6}>
                      <Box className={classes.container}>
                          <Button name="stake" variant="contained" onClick={(e) => showModalPreseed("deposit")}>Deposit</Button>
                      </Box>
                  </Grid>
                  <Grid item xs={6}>
                      <Box className={classes.container}>
                          <Button name="unstake" variant="contained" onClick={(e) => showModalPreseed("withdraw")}>Withdraw</Button>
                      </Box>
                  </Grid>
              </Grid>
          </Box>
          

          <div className="mt-4"></div>

          {/* <RewardsInfo rewardRate={rewardRate} totalRewardsPaid={totalRewardsPaid} /> */}

          <div className="mt-4"></div>

          {showUpdateStakeModal && (
            <Modal onClose={(e) => hideModalPreseed()}>
              <DepositWithdrawForm
                formType={formTypeValue}
                handleSuccess={handleSuccess}
                handleError={handleError}
                allowanceUpdated={handleAllowanceUpdated}
                balance={formType == "deposit" ? balanceUSDC : formType == "withdraw" ? portfolioValue : "0.0"}
                tokenSymbol={tokenSymbol}
                tokenImgSrc={tokenImgSrc}
              />
            </Modal>
          )}
      </Box>
    )

}
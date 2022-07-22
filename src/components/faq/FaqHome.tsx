


import { useState } from "react";

import { makeStyles, useTheme, Box, Accordion, AccordionDetails, AccordionSummary, Typography,  } from  "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"




export const FaqHome = () => {

    const theme = useTheme();
  

    return (
        <Box>

           <Accordion expanded={true}>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What are HashStrat Pools?  </Typography>
                </AccordionSummary>

                <AccordionDetails >
                    <Typography variant="body2" >
                        HashStrat Pools are crypto-funds automated on-chain.  <br/> 
                        Users deposit capital into a Pool in the form of stable crypto-assets (e.g. USDC) to be invested by an on-chain Strategy.
                        <br/><br/>
                        When users deposit funds into a Pool, they receive "LP Tokens" that represent ownership of a share of the Pool.<br/>
                        Users can withdraw their funds at any time by returning their "LP Tokens".
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What are Strategies? </Typography>
                </AccordionSummary>

                <AccordionDetails >
                    <Typography variant="body2" >
                        Strategies are set of rules, encoded into a smart contract, designed to manage the assets available in a Pool.
                        All strategies aim to grown the value of the assets held in the Pool over time. <br/><br/>
                        Strategies can allocate capital to risk assets (e.g. BTC or ETH) and can manage risk trading back into stable assets.
                        <br/>
                        Different Strategies offer different risk/reward characteristics but all aim to grow their Pool value over time.
                    </Typography>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > Why crypto-funds on the blockchain? </Typography>
                </AccordionSummary>

                <AccordionDetails >
                    <Typography variant="body2" >
                        HashStrat Pools and Strategies are smart contracts executed on-chain. <br/>
                        All code is open source and verified so their behaviour is transparent and predictable. <br/>
                        Correctness of execution is guaranteed by the blcokchain. <br/>
                        This means you don't have to trust any counterparty to manage your funds with integrity.
                        <br/><br/>
                        Buying when the price (and sentiment) is low and selling when price (and sentiment) is high can be hard.<br/>
                        Smart contracts don't suffer from emotions that can prevent human investors from executing correctly on their plan.<br/>
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </Box>
    )
}
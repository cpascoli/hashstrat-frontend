



import { Link, Box, Accordion, AccordionDetails, AccordionSummary, Typography,  } from  "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { Alert, AlertTitle } from "@material-ui/lab"

export const FaqHome = () => {

    return (
        <Box>


            <Box my={2}>
                <Alert severity="warning">
                    <AlertTitle> Scary Disclaimer </AlertTitle>
                    Hashtrat is an experimental platform under active development.<br/>
                    Don't use it if you don't know what you are doing or be prepared to loose all your funds!
                </Alert>
            </Box>

           <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What is HashStrat?  </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body2" >
                        HashStrat is a self-sovereign crypto-fund on the blockchain. <br/> 
                        Users deposit capital into Pools in the form of stable crypto-assets (USDC) to be invested by on-chain strategies.
                        <br/><br/>
                        When users deposit funds into a Pool, they receive "LP Tokens" that represent ownership of a share of the Pool.<br/>
                        Users can withdraw their funds at any time by returning their "LP Tokens".
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What are HashStrat Strategies? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body2" >
                        Strategies are set of rules, encoded into a smart contract, designed to manage the assets available in a Pool.
                        Their goal is to grow the value of the assets held in the Pool over time. <br/><br/>
                        Strategies decide when to allocate capital to risk assets and how to manage risk trading back into stable assets.
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
                        This means you don't have to trust any counterparty to manage your funds with integrity.<br/>
                        .<br/>
                        Buying when price (and sentiment) is low and selling when price (and sentiment) is high can be hard.<br/>
                        Smart contracts don't suffer from emotions that can prevent human investors from executing correctly on their plan.<br/>
                        <br/>
                        All code is open source and verified so their behaviour is transparent and predictable. <br/>
                        Correctness of execution is guaranteed by the blcokchain. <br/>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > How do you use HashStrat? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body2" >
                        HashStrat is a web3 application running on the Polygon Network. <br/>
                        To intereact with the HashStrat smart contracts you need a web3 enabled browser.  
                        Good options are <Link href="https://metamask.io" target="_blank">MetaMask</Link>  or  <Link href="https://www.coinbase.com/wallet" target="_blank">Coinbase wallet</Link>  <br/>
                        You will also need a little amount of <Link href="https://quickswap.exchange/#/swap" target="_blank">MATIC (Polygon)</Link> tokens to pay for transaction fees on the Polygon Network.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > How do you deposit funds into Hashtrat Pools? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body2">
                        You need USDC tokens on the Polygon Network to deposit into a Pool. <br/>
                        You can get USDC directly on Polygon using <Link href="https://quickswap.exchange/#/swap" target="_blank"> QuickSwap &gt; Buy </Link>
                        or you can transfer USDC from Ethereum to Polygon via the <Link href="https://wallet.polygon.technology/bridge" target="_blank">Polygon Bridge</Link>
                    </Typography> 
                </AccordionDetails>
            </Accordion>
 

        </Box>
    )
}
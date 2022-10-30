



import { makeStyles,  Link, Box, Accordion, AccordionDetails, AccordionSummary, Typography, Breadcrumbs, Divider } from  "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { Alert, AlertTitle } from "@material-ui/lab"
import { Link as RouterLink } from "react-router-dom"

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))

export const FaqHome = () => {

    const classes = useStyles()
    
    return (
        <div className={classes.container}>

            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>FAQ</Typography>
            </Breadcrumbs>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>


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
                        HashStrat is a DeFi protocol for self-sovereign crypto-funds on the blockchain. <br/> 
                        Users deposit capital, in the form of stable crypto-assets (USDC), into Pools managed by on-chain strategies.
                        <br/>
                        When users deposit funds into a Pool, they receive "Pool LP tokens" that represent ownership of their share of the Pool.<br/>
                        Users can "stake" their PoolLP tokens and "farm" HST tokens that allow to participate in the protocol gorvernance and revenue 
                        sharing programs.<br/>
                        Users can withdraw their funds at any time by returning their LP tokens to the Pools.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What are HashStrat Strategies? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body2" >
                        Strategies are set of rules, encoded into a smart contract, designed to manage the assets held in a Pool.<br/>
                        Their goal is to grow the value of the assets in the Pool over time. <br/>
                        Strategies decide how to allocate capital to risk assets and how to manage risk, trading back into stable assets.<br/>
                        HashStrat strategies are desigend to work best on the long term (think 3-5 years minimum) capture
                        the appreciation of pristine crypto assets like BTC and ETH, whilst at the same time reducing drawdowns compared to
                        simple buy &amp; hold strategies.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > Why a self-sovereign crypto-fund on the blockchain? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Box>
                        Because Decentralized Finance (DeFi) is the future of Finance. <br />
                        When well execured DeFi provides the following benefits:
                        <ul>
                            <li>No need to trust any counterparty to manage your funds with integrity </li>
                            <li>No minimum investing requirements, no barriers to entry and no gatekeepers</li>
                            <li>Users stay in control of their funds at all times. No need to ask someone to get your mney back </li>
                            <li>Ownership of digital asset is auditable by anybody on the blockchain</li>
                            <li>All trades are auditable by anybody on the blockchain</li>
                            <li>Behaviour of trading strategies is deterministic and transparent</li>
                            <li>Correctness of execution is guaranteed by the blcokchain </li>
                            <li>All code is open source and smart contracts are verified on-chain</li>
                            <li>Seamless integration with other DeFi protocols</li>
                            <li>Seamless access to on-chain liquidity</li>
                        </ul>

                        Additionally, HashStrat can prevent loosing money by solo trading.  <br/>
                        Buying when price (and sentiment) is low and selling when price (and sentiment) is high is hard.<br/>
                        Smart contracts don't suffer from emotions that can prevent human investors from executing correctly on their plan.<br/>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What do you need to use HashStrat? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Box>
                        HashStrat is a web3 application running on the Polygon Network. <br/>
                        To intereact with the HashStrat smart contracts you need:
                        <ul>
                            <li>A web3 enabled browser.  <br/>
                                Good options are <Link href="https://metamask.io" target="_blank">MetaMask</Link>  or  <Link href="https://www.coinbase.com/wallet" target="_blank">Coinbase wallet</Link>  
                            </li>
                            <li>A little amount of <Link href="https://coinmarketcap.com/currencies/polygon/" target="_blank">MATIC (Polygon)</Link> tokens to pay for transaction fees on the Polygon Network.</li>
                        </ul>
                        </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > How do you deposit into Hashtrat crypto-funds? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Box>
                        You need <Link href="https://www.circle.com/en/usdc" target="_blank">USDC </Link> tokens on the Polygon Network to deposit into HashStrat Pools &amp; Indexes <br/>
                        You can get USDC tokens:
                        <ul>
                            <li>
                               On an echange like <Link href="https://coinbase.com/join/pascol_c" target="_blank">Coinbase</Link> and then withdraw to the Polygon network
                            </li>
                            <li>
                                Directly on Polygon using <Link href="https://quickswap.exchange/#/swap" target="_blank"> QuickSwap &gt; Buy </Link>
                            </li>
                            <li>
                                or you can transfer USDC from Ethereum to Polygon via the <Link href="https://wallet.polygon.technology/bridge" target="_blank">Polygon Bridge</Link>
                            </li>
                        </ul> 
                    </Box>
                </AccordionDetails>
            </Accordion>
 

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What is the HashStrat DAO?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body2">
                        The HashStrat protocol is governed by a Decentralized Autonomous Organization, the HashStrat DAO. <br/>
                        DAO members are users of the protocol themselves, who participate in the governance and revenue sharing programs. <br />
                        The HashStat DAO token <Link component={RouterLink} to="/dao">HST</Link> facilitates all DAO decisions and operations.<br />
                        All HST tokens in existance are being distributed to users of the HashStat pools who stake their PoolLP tokens. <br/>
                    </Typography> 
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What's the DAO business model?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body2">
                        The HashStrat protocol generaets revenues by taxing profits that are withdrawn from HashStrat Pools &amp; Indexes. <br/>
                        The withdrawal fee is currently set to 1% of profits.<br/>
                        Fees stay within the pool and soon, DAO memebers will be able to decide their destination.<br/>
                        Possible uses include distibution among DAO token holders, or allocation to marketing and R&amp;D budgets.
                    </Typography> 
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > This is cool but what are the risks?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Box>
                        Decentralized Finance is a nascent industry and it's important to be aware of its risks.<br/>
                        These are the main risks that is worth considering when using a DeFi protocol like HashStrat: 
                       
                        <ul>
                            <li>
                              Protocol risks: <br/>
                              Although great care is put into following programing best practices, 
                              HashStrat smart contracts could contain bugs and be subject to exploits. 
                              Be aware that in several situations DeFi protocols have been exploited and users lost access to their funds.
                            </li>
                            <li>
                              Digital Asset risks: <br/>
                              HashStat strategies trade a small number of top digital assets on the Polygon Network: USDC, WETH, WBTC.
                              In case of catastrophic events on the Polygon Network and Polygon Bridge, these assets could, in theory, loose value against 
                              their pegged tokens (BTC on the Bitcoin network, ETH and USDC on the Ethereum network).
                            </li>
                            <li>
                              Smart contract integration risks: <br/>
                              In order to enable strategy trading, HashStat integrates a limited number of high-profile thirt-party protocols: <Link href="https://chain.link/" target="_blank"> Chainlink </Link> data-feeds, <Link href="https://quickswap.exchange/" target="_blank">QuickSwap DEX</Link>. 
                              <br/>
                              Issues with thes protocols could impact HashStat strategies by halting their functions or altering their behaviour.
                               
                            </li>
                            <li>
                              Network risks: <br/>
                              The HashStrat protocol runs on a blockchain, 
                              the <Link href="https://polygon.technology/" target="_blank">Polygon Network</Link>, that could suffer from malfunctions and exploits. <br/>
                              Issues at the base layer of a blockchian are very rare but can't be totally discounted. 
                            </li>

                            <li>
                              Regulatory risks: <br/>
                                Owning crypto assets and using DeFi is perfectly legal in <Link href="https://www.euronews.com/next/2022/04/27/bitcoin-ban-these-are-the-countries-where-crypto-is-restricted-or-illegal2" target="_blank"> almost </Link> every
                                jurisdiction, but it's worth keeping  an eye on how regualtions evolve and make sure you are following laws applicable in your jurisdiction.
                            </li>

                        </ul>   
                    </Box>
                </AccordionDetails>
            </Accordion>

        </div>
    )
}
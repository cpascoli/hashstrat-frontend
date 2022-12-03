



import { makeStyles,  Link, Box, Accordion, AccordionDetails, AccordionSummary, Typography, Breadcrumbs, Divider } from  "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { Alert, AlertTitle } from "@material-ui/lab"
import { Link as RouterLink } from "react-router-dom"


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))

export const FaqContent = () => {

    const classes = useStyles()
    
    return (
        <Box>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What is HashStrat?  </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body1" >
                        <ul>
                            <li>
                                HashStrat is a new DeFi protocol for investing in digital assets (e.g. BTC & ETH) with a long-term outlook.
                            </li>
                            <li>
                                With HashStrat you can build a portfolio of digital assets and let on-chain strategies automatically manage risk for you.
                            </li>
                            <li>
                                You pick your combination of assets &amp; management strategies, you deposit USDC and the protocol takes care of the rest.
                            </li>
                            <li>
                                Your strategies decide when to spend USDC to buy your favourite assets and when to sell into USDC to offload some risk.
                            </li>
                            <li>
                                You can withdraw the funds in your portfolio in USDC at any time.
                            </li>
                        </ul>

                        <br/>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > Why use HashStrat?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body1" >
                        HashStrat will help you to invest in digital assets:
                        <ul>
                            <li>Our on-chain strategies can dramatically reduce volatility &amp; drawdowns of your portfolio and produce returns competitive with a simple holding strategy.</li>
                            <li>Reduced volatility helps you to avoid FOMO buying or panic selling your investments at the wrong time. </li>
                            <li>HashStrat will make it easier for you to stay invested for longer and rip greater returns over the long term.</li>
                        </ul>

                        Being an honest DeFi protocol, you'll also get all the benefits of DeFi:
                        <ul>
                            <li>You stay in control of your funds at all times. </li>
                            <li>No minimum investment requirements and other arbitrary constraints, no barriers to entry or to exit.</li>
                            <li>Behaviour of trading strategies is deterministic and transparent.</li>
                            <li>Asset allocation and individual trades are auditable by anybody on the blockchain.</li>
                            <li>Correctness of execution is guaranteed by the blockchain.</li>
                            <li>All code is open source and smart contracts are verified on-chain.</li>
                            <li>No need to share any personal information. </li>
                            <li>Seamless access to on-chain liquidity.</li>
                        </ul>
                    </Typography>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What are HashStrat Strategies? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body1" >
                        <ul>
                            <li> Strategies are set of rules, encoded into smart contracts, designed to manage the assets held in your digital asset portfolio.</li>
                            <li> Strategies decide when to allocate capital to risk assets (e.g. BTC, ETH) and when to trade back into a stable asset (USDC).</li>
                            <li> Their goal is to grow the value of your digital asset portfolio over time, while managing risk. </li>
                            <li> HashStrat strategies are desigend to work best over the long term, capturing the appreciation of pristine crypto assets like BTC and ETH over multiple market cycles. </li>
                        </ul>
                    </Typography>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > Who is it for? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body1" >
                        <ul>
                            <li> <strong>Individual investors</strong> who want to automate the management of their crypto-portfolios, improve returns and reduce volatility, whilst retaining control over their digital assets.</li>
                            <li> <strong>DAO treasuries</strong> who want to protect the value of their stablecoin holdings from currency debasement by getting some exposure to pristine crypto assets in a trustless and verifiable way.</li>
                            <li> <strong>DeFi protocols</strong> who want to safely invest some of their stablecoin liquidity for the long term.</li>
                        </ul>
                    </Typography>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > How do you use HashStrat? </Typography>
                </AccordionSummary>
               
                <AccordionDetails >
                    <Typography variant="body1" >
                        Using HashStat is as simple as:
                        <ol>
                            <li>
                                Select the assets you want to hold and the strategies that will manage your assets.
                            </li>
                            <li>
                                Deposit USDC into the pool identified by the assets/strategies you picked.
                            </li>
                            <li>
                                Sit back and let HashStrat manage your digital asset portfolio for you.
                            </li>
                        </ol>

                        HashStrat is a web3 application running over the Polygon Network. To intereact with the HashStrat smart contracts you need:
                        <ol>
                            <li>A web3 enabled browser. Good options are <Link href="https://metamask.io" target="_blank">MetaMask</Link>  or  <Link href="https://www.coinbase.com/wallet" target="_blank">Coinbase wallet</Link>  
                            </li>
                            <li>A little amount of <Link href="https://coinmarketcap.com/currencies/polygon/" target="_blank">MATIC (Polygon)</Link> tokens to pay for transaction fees on the Polygon Network.</li>
                        </ol>
                           
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What is the HashStrat DAO?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body1">
                        <ul>
                            <li>The HashStrat protocol is governed by a Decentralized Autonomous Organization, the HashStrat DAO.</li>
                            <li>Users of the protocol can earn the DAO token <Link component={RouterLink} to="/dao">HST</Link> and become members of the DAO.</li>
                            <li> HST holders are able to participate in the protocol governance and revenue sharing programs.</li>
                        </ul>
                    </Typography> 
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > What's the DAO business model?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body1">
                        <ul>
                            <li> The protocol generates its revenues by taxing profits withdrawn from Pools &amp; Indexes. </li>
                            <li> The withdrawal fee is currently set to 1% of profits. </li>
                            <li> These fees are periodically collected into the DAO Treasury and re-distributed to DAO token holders as "dividends" </li>
                        </ul>
                    </Typography> 
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography style={{fontSize: 20, fontWeight: 400}} > This is cool but what are the risks?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Typography variant="body1">
                        
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
                                Issues with these protocols could impact HashStat strategies, halting their functions or altering their behaviour.
                                
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
                        
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </Box>
    )
}
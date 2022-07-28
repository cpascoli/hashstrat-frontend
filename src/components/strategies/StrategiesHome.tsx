


import { makeStyles, useTheme, Box, Typography, Link, Accordion, AccordionDetails, AccordionSummary } from  "@material-ui/core"
import { Horizontal } from "../Layout";
import { ExpandMore } from "@material-ui/icons"
import { Link as RouterLink } from "react-router-dom"

import strategy1 from "../img/strategy_reb01_chart_v2.png"
import strategy2 from "../img/strategy_meanrev01_chart_v2.png"
import strategy3 from "../img/strategy_trendfollow01_chart_v2.png"

const useStyle = makeStyles( theme => ({
    strategies: {
        // textAlign: "center",
        padding: theme.spacing(2),
        minHeight: 300
    },
    chart: {
        width: "100%",
        margin: "auto",
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    }

}))


export const StrategiesHome = () => {
    const classes = useStyle()
    const theme = useTheme();

    return (
        <Box className={classes.strategies}>
            <Box my={3} >
                <Typography>Strategies are set of rules, coded into smart contracts, to manage the assets held into the HashStrat Pools.</Typography>
                <br />
                <Typography>These are the Strategies currently available:</Typography>
            </Box>

            <Box>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <div>
                        <Link href="https://github.com/cpascoli/hashstrat/blob/main/contracts/strategies/RebalancingStrategyV1.sol" target="_blank"> 
                            <strong> RebalancingStrategyV1  </strong>
                        </Link> 
                        <Typography> A rebalancing strategy over a 2 tokens portfolio</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails >
                    <div>
                        <div>
                            <strong>Goal</strong> <br/>
                            Capture volatility in the risk asset by rebalancing the Pool whenever the value of either assets
                            deviates from the Pool target allocation by a given percentage.
                        </div>
                        <br />
                        <div>     
                            <strong>Rule</strong> <br/>
                            Given a ETH/USD Pool with 60%/40% target allocation and 10% rebalance trigger, <br />
                            When the value of ETH rises above 70% (drops below 60%) of the overall value in the Pool<br />
                            Then the Pool is rebalanced by selling ETH (buying ETH) to restore the original 60%/40% allocation.
                        </div>
                        <br />
                        <div>     
                            <strong>Pools</strong> <br/>
                            <Horizontal>
                                <Link component={RouterLink} to="/pools/pool01">BTC-USDC REB01</Link>
                                <Link component={RouterLink} to="/pools/pool02">ETH-USDC REB01</Link>
                            </Horizontal>
                        </div>
                        <br />
                        <div>     
                            <strong>Returns</strong> <br/>
                            Using this strategy, from Jan 2019 to July 2022, a $1,000 Pool would have returned $6,386. <br/>
                            A Pool with $400 in USDC and $600 in ETH, would have turned that into $2,396 in USDC and $3,990 in ETH.
                        </div>
                        <div>   
                            <img src={strategy1} className={classes.chart} alt="RebalancingStrategyV1 strategy stats"/>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >

                     <div>
                        <Link href="https://github.com/cpascoli/hashstrat/blob/main/contracts/strategies/MeanReversionV1.sol" target="_blank"> 
                            <strong> MeanReversionV1  </strong>
                        </Link> 
                        <Typography>A dollar-cost average strategy according to the asset's long term trend</Typography>
                    </div>

                </AccordionSummary>
                <AccordionDetails >
                    <div>
                        <div>
                            <strong>Gaol</strong> <br/>
                            Accumulate the risk asset when its price is significantly below its long term trend and divest when it's significantly above.
                        </div>
                        <br />
                        <div>     
                            <strong>Rule</strong> <br/>
                            Given a Pool containing ETH/USD and a dollar-cost average configuration of 5% every 5 days <br />
                            When ETH price is 33% below its 350D moving average, then every 5 days, buy ETH with 5% of the USD in the Pool.  <br />
                            When ETH price is 66% above its 350D moving average, then every 5 days, sell 5% of the ETH in the Pool. 
                        </div>
                        <br />
                        <div>     
                            <strong>Pools</strong> <br/>
                            <Horizontal>
                                <Link component={RouterLink} to="/pools/pool03">BTC-USDC MEANREV01</Link>
                                <Link component={RouterLink} to="/pools/pool04">ETH-USDC MEANREV01</Link>
                            </Horizontal>
                        </div>
                        <br />
                        <div>     
                            <strong>Returns</strong> <br/>
                            Using this strategy, from Jan 2019 to July 2022, a $1,000 Pool would have returned $8,533. <br/>
                            A Pool with $800 in USDC and $200 in ETH, would have turned that into $5,282 in USDC and $3,251 in ETH.
                        </div>
                        <div>   
                            <img src={strategy2} className={classes.chart} alt="MeanReversionV1 strategy stats"/>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >

                     <div>
                        <Link href="https://github.com/cpascoli/hashstrat/blob/main/contracts/strategies/TrendFollowV1.sol" target="_blank"> 
                            <strong> TrendFollowV1  </strong>
                        </Link> 
                        <Typography>A trend-following strategy trading in the direction of the underlying trend</Typography>
                    </div>

                </AccordionSummary>
                <AccordionDetails >
                    <div>
                        <div>
                            <strong>Goal</strong> <br/>
                            Capture volatility in the risk asset when its price is moving in a sustained direction. 
                        </div>
                        <br />
                        <div>     
                            <strong>Rule</strong> <br/>
                            Given a Pool containing ETH/USD <br />
                            When ETH price is above its 50D moving average, then buy ETH with all USDC available in the Pool <br />
                            When ETH price is below its 50D moving average, then sell all ETH into USDC. 
                        </div>
                        <br />
                        <div>     
                            <strong>Pools</strong> <br/>
                            <Horizontal>
                                <Link component={RouterLink} to="/pools/pool05">BTC-USDC TRDFLW01</Link>
                                <Link component={RouterLink} to="/pools/pool06">ETH-USDC TRDFLW01</Link>
                            </Horizontal>
                        </div>
                        <br />
                        <div>     
                            <strong>Returns</strong> <br/>
                            Using this strategy, from Jan 2019 to July 2022, a $1,000 Pool would have returned $18,917.<br/>
                            A Pool with $800 in USDC and $200 in ETH, would have turned that into $18,917 in USDC and $0 in ETH.
                        </div>
                        <div>   
                            <img src={strategy3} className={classes.chart} alt="TrendFollowV1 strategy stats"/>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>

     
            </Box>
        </Box>
    )
}
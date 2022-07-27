


import { makeStyles, useTheme, Box, Typography, Link, Accordion, AccordionDetails, AccordionSummary } from  "@material-ui/core"
import { Horizontal } from "../Layout";
import { ExpandMore } from "@material-ui/icons"

import strategy1 from "../img/strategy_reb01_chart.png"
import strategy2 from "../img/strategy_meanrev01_chart.png"
import strategy3 from "../img/strategy_trendfollow01_chart.png"

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
                <Typography>Strategies are set of rules, coded into smart contracts, that manage the assets in HashStrat Pools.</Typography>
                <Typography>These are the Strategies currently available:</Typography>
            </Box>

            <Box>

            <Accordion defaultExpanded >
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
                            <strong>Rule</strong> <br/>
                            When the value of one of the tokens grows above (or drops below) a predefined percentage of the overall value in the Pool,                    
                            rebalance the Pool to its target allocation. <br />
                        </div>
                        <br />
                        <div>     
                            <strong>Example</strong> <br/>
                            Given a Pool with 60%/40% target allocation on an ETH/USD and 15% rebalancing thereshold, <br />
                            When the value of ETH reaches 75% (or drops below 55%) of the overall value in the Pool<br />
                            Then the Pool is rebalanced by selling ETH (or buying ETH) to restore the original 60%/40% allocation.
                        </div>
                    
                        <br />
                        <div>     
                            <strong>Returns</strong> <br/>
                            Using this strategy, from Jan 2019 to July 2022, a $1,000 Pool would have returned $6,379. <br/>
                            A Pool with $400 in USDC and $600 in ETH, would have turned that into $2,214 in USDC and $4,165 in ETH.
                        </div>
                        <div>   
                            <img src={strategy1} className={classes.chart} alt="RebalancingStrategyV1 strategy stats"/>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>


            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >

                     <div>
                        <Link href="https://github.com/cpascoli/hashstrat/blob/main/contracts/strategies/MeanReversionV1.sol" target="_blank"> 
                            <strong> MeanReversionV1  </strong>
                        </Link> 
                        <Typography>A strategy to dollar-cost average in and out of a risk asset according to its price long term trend</Typography>
                    </div>

                </AccordionSummary>
                <AccordionDetails >
                    <div>
                        <div>
                            <strong>Rule</strong> <br/>
                            Accumulate the risk asset when its price is way below its long term trend and divest when it's way above.
                        </div>
                        <br />
                        <div>     
                            <strong>Example</strong> <br/>
                            Given a Pool containing ETH/USD and a dollar-cost average configuration of 5% every 5 days <br />
                            When ETH price is 33% below its 350D moving average, then every 5 days, buy ETH with 5% of the USD in the Pool.  <br />
                            When ETH price is 66% above its 350D moving average, then every 5 days, sell 5% of the ETH in the Pool. 
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


            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >

                     <div>
                        <Link href="https://github.com/cpascoli/hashstrat/blob/main/contracts/strategies/TrendFollowV1.sol" target="_blank"> 
                            <strong> TrendFollowV1  </strong>
                        </Link> 
                        <Typography>A trend following strategy aiming to allocate in and out of a risk asset according to its price short term trend</Typography>
                    </div>

                </AccordionSummary>
                <AccordionDetails >
                    <div>
                        <div>
                            <strong>Rule</strong> <br/>
                                Allocate to the risk asset when its price is above its 50D moving average and de-risk into the stable asset when it's below.
                             <br />
                        </div>
                        <br />
                        <div>     
                            <strong>Example</strong> <br/>
                            Given a Pool containing ETH/USD <br />
                            When ETH price is above its 50D moving average, then buy ETH with all USDC available in the Pool <br />
                            When ETH price is below its 50D moving average, then sell all ETH into USDC. 
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
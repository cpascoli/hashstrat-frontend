


import { useEffect, useState } from 'react'

import { makeStyles, Box, Typography, Link, Accordion, AccordionDetails, AccordionSummary, Breadcrumbs, Divider } from  "@material-ui/core"
import { Horizontal } from "../Layout";
import { ExpandMore } from "@material-ui/icons"
import { Link as RouterLink } from "react-router-dom"


import { useSearchParams } from "react-router-dom"

import { SimulatorInastance, StrategyName } from "../../services/simulator/SimulatorService"

import { StrategyPlayground } from "../home/StrategyPlayground"

import { RebalancingSummary, RebalancingDetails } from "./Rebalancing"
import { TrendFollowingSummary, TrendFollowingDetails } from "./TrendFollowing"
import { MeanReversionSummary, MeanReversionDetails } from "./MeanReversion"


const useStyle = makeStyles( theme => ({

    container: {
        paddingTop: theme.spacing(2),
        maxWidth: 1200,
        margin: 'auto',
    },

    playground: {
        // minWidth: 1000,
        // backgroundColor: 'orange',
        [theme.breakpoints.up('xs')]: {
            // minWidth: 390,
            // minWidth: 200,
        },
    },

    accordionDetails: {
        minWidth: 1200,
        [theme.breakpoints.up('xs')]: {
            minWidth: 400,
            margin: 0,
            padding: 0,
        },
    },

    strategies: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    },


}))


const simulatrParams = {
    fromDate: "sim.fromDate",
    toDate: "sim.toDate",
    asset: "sim.asset",
    strategy: "sim.strategy",
    investment: "sim.investment",
}


export const StrategiesHome = () => {
    const classes = useStyle()

    const [searchParams] = useSearchParams();

    const strategyParam = ['MeanReversion', 'Rebalancing', 'TrendFollowing'].includes(searchParams.get("s") ?? '') ?
                searchParams.get("s") : ''    

     const [strategy, setStrategy] = useState<string | null>(strategyParam)



    return (
        <Box className={classes.container} >

            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/home"> Home </Link>
                    <Typography>Strategies</Typography>
                </Breadcrumbs>
            </Box>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>


            <Box my={3} px={2}>
                <Typography>Strategies are set of rules, encoded into smart contracts, that can trade the assets held into HashStrat pools.</Typography>
                <Typography>Pools are smart contracts holding a risk asset (WBTC or WETH) and a stable asset (USDC) and are configured with a strategy to trade between them.</Typography>
            </Box>

            <Box  >

                <Accordion defaultExpanded={ strategy === 'Rebalancing' }>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                        <RebalancingSummary />
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails} >
                        <div>
                            <RebalancingDetails />
 
                            <Box pt={2} className={classes.playground} >
                                <StrategyPlayground 
                                    strategy='Rebalancing'
                                    symbol="ETH"
                                    from="2019-01-01"
                                    to="2023-01-16"
                                    chartHeight={340}
                                    chainId={137} //FIXME
                                /> 
                            </Box>
                        </div>    
                    </AccordionDetails>
                </Accordion>
 
                <Accordion defaultExpanded={ strategy === 'MeanReversion' }>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                       <MeanReversionSummary />

                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails} >
                        <div>
                            <MeanReversionDetails />

                            <Box pt={2} className={classes.playground} >
                                <StrategyPlayground 
                                    strategy='MeanReversion'
                                    symbol="ETH"
                                    from="2019-01-01"
                                    to="2023-01-16"
                                    chartHeight={340}
                                    chainId={137} //FIXME
                                /> 
                            </Box>
                        </div>
                    </AccordionDetails>
                </Accordion>
                
                <Accordion defaultExpanded={ strategy === 'TrendFollowing' }>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                        <TrendFollowingSummary />
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails} >
                        <div>
                            <TrendFollowingDetails />

                            <Box pt={2} className={classes.playground} >
                                <StrategyPlayground 
                                    strategy='TrendFollowing'
                                    symbol="ETH"
                                    from="2019-01-01"
                                    to="2023-01-16"
                                    chartHeight={340}
                                    chainId={137} //FIXME
                                /> 
                            </Box>
                        </div>
                    </AccordionDetails>
                </Accordion>

            </Box>
        </Box>
    )
}
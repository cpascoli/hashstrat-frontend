

import {  Box, Typography, Link } from  "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import { Horizontal } from "../Layout";
import { Launch } from "@material-ui/icons"


export const TrendFollowingSummary = () => {
    return (
        <div>
            <Typography variant="h5">
                <strong> Trend Following </strong>
            </Typography>
            <Typography>A momentum strategy trading in the direction of the underlying trend as determined by its 50D moving average</Typography>
            
            <div style={{marginTop: 10}}>
                <Link href="https://medium.com/@hashstrat/trend-following-strategy-7dce9756eaa" target="_blank" > Learn More <Launch style={{ height: 15, transform: "translateY(2px)" }} />  </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link href="https://github.com/cpascoli/hashstrat/blob/main/contracts/strategies/TrendFollowV1.sol">GitHub <Launch style={{ height: 15, transform: "translateY(2px)" }} /> </Link>
            </div>
        </div>
    )
}

export const TrendFollowingDetails = () => {


    return (
        <Box px={2}>
            <div>
                <strong>Goal</strong> <br/>
                Capture volatility in the risk asset when its price is moving in a sustained direction. 
            </div>
            <br />
            <div>     
                <strong>Rule</strong> <br/>
                Given a Pool containing ETH/USD <br />
                When ETH price is above its 40D moving average, then buy ETH with all USDC available in the Pool <br />
                When ETH price is below its 40D moving average, then sell all ETH into USDC. 
            </div>
            <br />
            <div>     
                <strong>Pools</strong> <br/>
                <Horizontal>
                    <Link component={RouterLink} to="/pools/pool05v3a">BTC-USDC TRDFLW01</Link>
                    <Link component={RouterLink} to="/pools/pool06v3a">ETH-USDC TRDFLW01</Link>
                </Horizontal>
            </div>
            <br />
            <div>     
                <strong>Returns</strong> <br/>
                From Jan 2019 to July 2022 this strategy would have returned 18.9x your investment.
            </div>
        </Box>
    )
}
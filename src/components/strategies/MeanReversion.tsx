

import {  Box, Typography, Link } from  "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import { Horizontal } from "../Layout";
import { Launch } from "@material-ui/icons"


export const MeanReversionSummary = () => {
    return (
        <div>
            <Typography variant="h5">
                <strong> Mean Reversion</strong>
            </Typography>
            <Typography>A strategy for dollar-cost averaging in and out a risk asset when its price diverges substantially from its long term trend</Typography>

            <div style={{marginTop: 10}}>
                <Link href="https://medium.com/@hashstrat/hashstrat-mean-reversion-strategy-b1a576b05d5f" target="_blank" > Learn More <Launch style={{ height: 15, transform: "translateY(2px)" }} />  </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link href="https://github.com/cpascoli/hashstrat/blob/main/contracts/strategies/MeanReversionV1.sol"> GitHub <Launch style={{ height: 15, transform: "translateY(2px)" }} /> </Link>
            </div>

        </div>
    )
}

export const MeanReversionDetails = () => {


    return (
        <Box px={2}>
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
                    <Link component={RouterLink} to="/pools/pool03v3a">BTC-USDC MEANREV01</Link>
                    <Link component={RouterLink} to="/pools/pool04v3a">ETH-USDC MEANREV01</Link>
                </Horizontal>
            </div>
            <br />
            <div>     
                <strong>Returns</strong> <br/>
                From Jan 2019 to July 2022 this strategy would have returned 8.5x your investment.
            </div>
        </Box>
    )
}


import { makeStyles, Box, Typography, Link } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { useTokensInfoForPools, useTokensInfoForIndexes } from "../../hooks/usePoolInfo"

import { Token } from "../../types/Token"
import { fromDecimals, round} from "../../utils/formatter"
import { BigNumber } from "ethers"
import { PoolSummary } from "./PoolSummary"
import { Horizontal } from "../Layout"

import { TitleValueBox } from "../TitleValueBox"
import { PieChartWithLabels } from "../shared/PieChartWithLabels"
import { Link as RouterLink } from "react-router-dom"

import { PoolIds, IndexesIds } from "../../utils/pools"

import { useDashboardModel } from "./DashboadModel"

interface DashboardProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    },
    portfolioSummary: {
        maxWidth: 700,
        margin: "auto"
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


export const Dashboard = ({ chainId, depositToken, investTokens, account} : DashboardProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]

    console.log("Dashboard - account", account)

    const { poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool } = useDashboardModel(chainId, tokens, depositToken, account)

    // console.log(">>> indexesInfo: ", indexesInfo)

    const tokenBalancesoFormatted = Object.values(portfolioInfo.tokenBalances).map( (item ) => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance, item.decimals, 4),
            value: fromDecimals( item.value, depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
            decimals: item.decimals
       }

    })
 
    const poolsSummaryViews = [...indexesInfo, ...poolsInfo].filter( pool => pool.totalValue.isZero() === false ).map ( pool => {
        return <PoolSummary key={pool.poolId} 
                    chainId={chainId} 
                    poolId={pool.poolId} 
                    tokens={pool.tokenInfoArray} 
                    depositToken={depositToken
                 }/>
   
    })
  

    const totalValueFormatted = portfolioInfo.totalValue && fromDecimals( portfolioInfo.totalValue, depositToken.decimals, 2)
    
    return (
        <div className={classes.container}>
         


            {/* { account  && totalValueFormatted && Number(totalValueFormatted) == 0 && 
                <Alert severity="info" style={{marginTop: 20, marginBottom: 20}}>
                    <AlertTitle> You currently have no assets in your portfolio </AlertTitle>
                    When you deposit into a <Link component={RouterLink} to="/pools">Pool</Link> or
                    an <Link component={RouterLink} to="/indexes">Index</Link> a summary of your assets will show here. 
                </Alert>
            } */}

            { account && account?.length > 0 && 
                <Box>
                    <Typography variant="h4" align="center" >Portfolio Summary </Typography>
                    <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                        Your Assets across all Pools &amp; Indexes
                    </Typography>
                </Box>
            }
            { !account && 

                <Box>
                    <Typography variant="h4" align="center" >Asset Summary</Typography>
                    <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                        Total assets across all Pools &amp; Indexes
                    </Typography>
                </Box>
            }

            <div className={classes.portfolioSummary} > 
                <Box className={classes.portfolioInfo} >
                {
                    tokenBalancesoFormatted && tokenBalancesoFormatted.map( (token : any)=> {
                        const valueFormatted = `${token.balance} (${token.value} ${depositToken.symbol})`
                        return  <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted}  mode="small" />
                    })
                }
                    <TitleValueBox title="Total Invested" value={`${totalValueFormatted} ${depositToken.symbol}` }  />
                </Box>

                <Horizontal align="center">
                    { totalValueFormatted  &&  <PieChartWithLabels { ...chartValueByAsset } /> }
                    { totalValueFormatted  &&  <PieChartWithLabels  { ...chartValueByPool } /> }
                </Horizontal>


            </div>

            {  account && account?.length > 0 && poolsSummaryViews.length > 0 &&
                <Box my={4} >
                    <Typography variant="h4" align="center" >Asset Allocation</Typography>
                    <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                        Your assets allocation in the different Pools
                    </Typography>
                    <Horizontal align="center" > 
                        { poolsSummaryViews }
                    </Horizontal>
                </Box>
            }

        </div>
    )

}





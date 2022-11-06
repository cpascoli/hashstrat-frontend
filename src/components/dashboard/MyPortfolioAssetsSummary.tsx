import { makeStyles, Box, Typography, CircularProgress } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"

import { utils } from "ethers"

import { Token } from "../../types/Token"
import { fromDecimals, round } from "../../utils/formatter"
import { PoolSummary } from "../shared/PoolSummary"
import { Horizontal } from "../Layout"

import { TitleValueBox } from "../TitleValueBox"
import { VPieChart } from "../shared/VPieChart"
import { StyledAlert } from "../shared/StyledAlert"
import { Alert, AlertTitle } from "@material-ui/lab"
import { Link as RouterLink } from "react-router-dom"


import { useDashboardModel } from "./DashboadModel"
import { useTotalDeposited, useTotalWithdrawals } from "../../hooks/useUserInfo"




interface MyPortfolioAssetsSummaryProps {
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
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    portfolioCharts: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(2),
        // border: "1px solid black"
    }
}))


export const MyPortfolioAssetsSummary = ({ chainId, depositToken, investTokens, account} : MyPortfolioAssetsSummaryProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]
 
    const { poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool, didLoad } = useDashboardModel(chainId, tokens, depositToken, account)

    const totalDeposited = useTotalDeposited(chainId, account)
    const totalWithdrawn = useTotalWithdrawals(chainId, account)
    
    const tokensBalanceInfo = Object.values(portfolioInfo.tokenBalances).map( (item ) => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance, item.decimals, item.symbol === 'USDC' ? 2 : 4),
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
                    depositToken={depositToken}
                    account={account}
                 />
   
    })

    const totalValueFormatted = portfolioInfo.totalValue && fromDecimals( portfolioInfo.totalValue, depositToken.decimals, 2)
    const totalDepositedFormatted = totalDeposited && fromDecimals( totalDeposited, depositToken.decimals, 2)
    const totalWithdrawnFormatted = totalWithdrawn && fromDecimals( totalWithdrawn, depositToken.decimals, 2)

    const roiFormatted = (totalValueFormatted && totalWithdrawnFormatted && totalDepositedFormatted && parseFloat(totalDepositedFormatted) > 0) ? 
                            String(Math.round( 10000 * (parseFloat(totalWithdrawnFormatted) + parseFloat(totalValueFormatted) - parseFloat(totalDepositedFormatted)) / parseFloat(totalDepositedFormatted)) / 100 ) : 'n/a'


    return (
        <div className={classes.container}>

            { !didLoad && 
                <div style={{height: 300, paddingTop: 140}} >
                    <Horizontal align="center" > <CircularProgress color="secondary" /> </Horizontal>  
                </div>
            }
         
            { didLoad && !account &&
                <Box>
                    <Typography variant="body2" align="center" style={{marginTop: 20, marginBottom: 20}}>
                        Connect an account to the Polygon netowrk to see your Assets across all Pools &amp; Indexes
                    </Typography>
                </Box>
            }

            {/* { account && totalValueFormatted && Number(totalValueFormatted) == 0 && 
                <StyledAlert severity="info" style={{marginTop: 20, marginBottom: 20}}>
                    <AlertTitle>You have no assets in your portfolio </AlertTitle>
                    Deposit funds into a <Link component={RouterLink} to="/pools">Pool</Link> or
                    an <Link component={RouterLink} to="/indexes">Index</Link> and a summary of your assets will appear here. 
                </StyledAlert>
            } */}


            {  didLoad && account &&
                <div>
                    <Box>
                        <Typography variant="h4" align="center" >Portfolio Summary </Typography>
                        <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 10}}>
                            The value of your assets across all Pools &amp; Indexes
                        </Typography>
                        <Typography variant="h5" align="center" style={{marginTop: 0, marginBottom: 20}}>
                           { utils.commify(totalValueFormatted) } {depositToken.symbol}
                        </Typography>
                    </Box>
                    <div className={classes.portfolioSummary} > 

                        <Horizontal>
                            <Box className={classes.portfolioInfo} >
                            {
                                tokensBalanceInfo && tokensBalanceInfo.map( asset => {
                                    const valueFormatted = `${ utils.commify(asset.balance) } ($ ${  utils.commify(asset.value) })`
                                    return  <TitleValueBox key={asset.symbol} title={asset.symbol} value={ valueFormatted }  mode="small" />
                                })
                            }

                            </Box>

                            <Box className={classes.portfolioInfo}>
                                <TitleValueBox mode="small" title="ROI" value={roiFormatted?.toString()??""} suffix="%" />
                                <TitleValueBox mode="small" title="My Deposits" value={ utils.commify(totalDepositedFormatted) } suffix={depositToken.symbol} />
                                <TitleValueBox mode="small" title="My Withdrawals" value={ utils.commify(totalWithdrawnFormatted) } suffix={depositToken.symbol} />
                            </Box>
                        </Horizontal>

                        { totalValueFormatted  && Number(totalValueFormatted) > 0 &&
                            <Box className={classes.portfolioCharts}>
                                <Horizontal align="center" >
                                    <VPieChart { ...chartValueByAsset } /> 
                                    <VPieChart  { ...chartValueByPool } />
                                </Horizontal>
                            </Box>
                        }
                    </div>

                    { poolsSummaryViews && poolsSummaryViews.length > 0 &&
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
            }

        </div>
    )

}





import { makeStyles, Box, Typography, CircularProgress } from "@material-ui/core"
import { utils } from "ethers"
import { Alert, AlertTitle } from "@material-ui/lab"

import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { PoolSummary } from "../shared/PoolSummary"
import { Horizontal } from "../Layout"

import { TitleValueBox } from "../TitleValueBox"
import { VPieChart } from "../shared/VPieChart"
import { PoolInfo } from "../../utils/pools"

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


export const MyPortfolioAssetsSummary = ({ chainId, depositToken, investTokens, account } : MyPortfolioAssetsSummaryProps) => {
    
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


 
    const userHasDisabledPools = [...indexesInfo, ...poolsInfo].filter( pool => pool.totalValue.isZero() === false ).reduce( (acc, val ) => {
        return acc = acc || PoolInfo(chainId, val.poolId).disabled === 'true'
    }, false)



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


    // console.log("account", account, "totalValueFormatted: ", totalValueFormatted)


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
                        Connect an account to the Polygon netowrk to access your Assets across all Pools &amp; Indexes
                    </Typography>
                </Box>
            }

            { userHasDisabledPools && 
                <Box pb={2} >
                    <Alert severity="warning" > 
                        <AlertTitle>Upgraded Pools &amp; Indexes</AlertTitle>
                        New versions of all Pools &amp; Indexes have been deployed and the old versions are now disabled.<br/>
                        Withdraw your funds from disabled Pools &amp; Indexes and deposit into active ones. <br/>
                        If you had "staked" your LP tokens remember to "unstake" them before you can withdraw.
                    </Alert>
                </Box>
            }

            {  didLoad && account &&
                <div>



                    <Box>
                        <Typography variant="h4" align="center" > Portfolio Summary </Typography>
                        <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 10}}>
                            The value of your assets across all Pools &amp; Indexes
                        </Typography>
                        <Typography variant="h5" align="center" style={{marginTop: 0, marginBottom: 20}}>
                           ${ utils.commify(totalValueFormatted) }
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





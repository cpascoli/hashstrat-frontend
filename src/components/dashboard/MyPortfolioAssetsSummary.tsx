

import { makeStyles, Box, Typography, Link } from "@material-ui/core"
import { utils } from "ethers"

import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { PoolSummary } from "./PoolSummary"
import { Horizontal } from "../Layout"

import { TitleValueBox } from "../TitleValueBox"
import { PieChartWithLabels } from "../shared/PieChartWithLabels"


import { useDashboardModel } from "./DashboadModel"


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
 
    const { poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool } = useDashboardModel(chainId, tokens, depositToken, account)

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
         
            { !account &&
                <Box>
                    <Typography variant="body2" align="center" style={{marginTop: 20, marginBottom: 20}}>
                        Connect an account to the Polygon netowrk to see your Assets across all Pools &amp; Indexes
                    </Typography>
                </Box>
            }

            {/* { account && totalValueFormatted && Number(totalValueFormatted) == 0 && 
                <Alert severity="info" style={{marginTop: 20, marginBottom: 20}}>
                    <AlertTitle> You currently have no assets in your portfolio </AlertTitle>
                    When you deposit into a <Link component={RouterLink} to="/pools">Pool</Link> or
                    an <Link component={RouterLink} to="/indexes">Index</Link> a summary of your assets will show here. 
                </Alert>
            } */}


            {  account &&
                <div>
                    <Box>
                        <Typography variant="h4" align="center" >Portfolio Summary </Typography>
                        <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                            Your assets across all Pools &amp; Indexes
                        </Typography>
                    </Box>
                    <div className={classes.portfolioSummary} > 
                        <Box className={classes.portfolioInfo} >
                        {
                            tokenBalancesoFormatted && tokenBalancesoFormatted.map( (token : any)=> {
                                const valueFormatted = `${ utils.commify(token.balance) } (${token.value} ${depositToken.symbol})`
                                return  <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted}  mode="small" />
                            })
                        }
                            <TitleValueBox title="Total Invested" value={`${ utils.commify(totalValueFormatted) } ${depositToken.symbol}` }  />
                        </Box>

                        { totalValueFormatted  &&  
                            <Box className={classes.portfolioCharts}>
                                <Horizontal align="center" >
                                    <PieChartWithLabels { ...chartValueByAsset } /> 
                                    <PieChartWithLabels  { ...chartValueByPool } />
                                </Horizontal>
                        </Box>
                        }
                    </div>
                    <Box my={4} >
                        <Typography variant="h4" align="center" >Asset Allocation</Typography>
                        <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                            Your assets allocation in the different Pools
                        </Typography>
                        <Horizontal align="center" > 
                            { poolsSummaryViews }
                        </Horizontal>
                    </Box>
                </div>
            }

        </div>
    )

}





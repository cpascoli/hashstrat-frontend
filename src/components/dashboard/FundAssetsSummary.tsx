

import { makeStyles, Box, Typography } from "@material-ui/core"
import { utils } from "ethers"

import { Token } from "../../types/Token"
import { PoolSummary } from "./PoolSummary"
import { Horizontal } from "../Layout"
import { TitleValueBox } from "../TitleValueBox"
import { PieChartWithLabels } from "../shared/PieChartWithLabels"
import { useDashboardModel } from "./DashboadModel"

import { fromDecimals } from "../../utils/formatter"

interface FundAssetsSummaryProps {
    chainId: number,
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


export const FundAssetsSummary = ({ chainId, depositToken, investTokens } : FundAssetsSummaryProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]


    const { poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool } = useDashboardModel(chainId, tokens, depositToken)

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
         
            <Box>
                <Typography variant="h4" align="center" >Asset Summary</Typography>
                <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                    Total assets across all Pools &amp; Indexes
                </Typography>
            </Box>

            <div className={classes.portfolioSummary} > 
                <Box className={classes.portfolioInfo} >
                {
                    tokenBalancesoFormatted && tokenBalancesoFormatted.map( (token : any)=> {
                        const valueFormatted = `${utils.commify( token.balance )} (${ utils.commify( token.value )} ${depositToken.symbol})`
                        return  <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted}  mode="small" />
                    })
                }
                    <TitleValueBox title="Total Value Locked (TVL)" value={`${ utils.commify( totalValueFormatted )} ${depositToken.symbol}` }  />
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
{/* 
            <Box my={4} >
                <Typography variant="h4" align="center" >Asset Allocation</Typography>
                <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                    Asset allocation in the different Pools &amp; Indexes
                </Typography>
                <Horizontal align="center" > 
                    { poolsSummaryViews }
                </Horizontal>
            </Box> */}

        </div>
    )

}





import { makeStyles, Box, Typography } from  "@material-ui/core"
import { TitleValueBox } from "../../TitleValueBox"
import { Token } from  "../../../types/Token"
import { useIndexModel, PoolSummary } from "./IndexModel"
import { fromDecimals, round } from "../../../utils/formatter"
import { BigNumber } from "ethers"
import { PoolInfo, InvestTokens } from "../../../utils/pools"
import { PieChartWithLabels } from "../../shared/PieChartWithLabels"
import { Horizontal } from "../../Layout"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
        paddingBottom: 30
    },
    portfolioInfo: {
        // maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    },
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    }
}))


interface IndexStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    account?: string
}




export const IndexStatsView = ( { chainId, poolId, depositToken, account } : IndexStatsViewProps ) => {

    const classes = useStyle()

    const { name, description, investTokens } = PoolInfo(chainId, poolId)
 
    const tokens =  [depositToken, ... InvestTokens(chainId)]
    const { indexInfo, poolsInfo, portfolioInfo, chartValueByAsset, chartValueByPool } = useIndexModel(chainId, poolId, tokens, depositToken)
  
    console.log("IndexStatsView", poolsInfo)  //indexInfo:  {poolId: 'index02', tokenInfoArray: Array(2), totalValue: BigNumber}
    
    const formattedPortfolioValue = portfolioInfo.totalValue ? fromDecimals(portfolioInfo.totalValue, depositToken.decimals, 2) : undefined

    const assetViews = indexInfo.tokenInfoArray.map( token => {
        const balance = token.accountBalance ?? BigNumber.from(0)
        const value = token.accountValue ?? BigNumber.from(0)
        const decimals = token.decimals //    tokens.find( t => t.symbol === symbol)?.decimals ?? 2
        const accountBalanceFormatted = fromDecimals(balance, decimals, 4 ) as any
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any
        const valueFormatted = `${accountBalanceFormatted} (${accountValueFormatted} ${ depositToken.symbol }) `

        return { symbol: token.symbol, valueFormatted, balance, value }
    }).map( it => <TitleValueBox key={it.symbol} title={it.symbol} value={it.valueFormatted} /> )


    const totalWeights = poolsInfo?.reduce( (acc, val ) => {
        return acc + val.weight
    }, 0)
    const poolsInIndex = poolsInfo?.map( ( pool : PoolSummary) => {
        const perc = round( 100 * pool.weight / totalWeights )
        return <TitleValueBox mode="small" key={pool.poolId} title={pool.name} value={perc.toString()}  suffix="%" />
    })

    

    return (
        <Box className={classes.container}>

            <Box mb={2}>
                <Typography variant="h6" align="center"> {name}</Typography> 
                <Typography variant="body2" align="center"> {description}</Typography> 
            </Box>

            <Horizontal align="center" >
                <PieChartWithLabels { ...chartValueByAsset } /> 
                <PieChartWithLabels { ...chartValueByPool } /> 

                <Box className={classes.portfolioInfo} >
                    { assetViews }
                    <TitleValueBox title="Total Asset Value" value={formattedPortfolioValue??""} suffix={depositToken.symbol} />
    
                    {/* <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                    <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>
         */}
                </Box>

                <Box className={classes.portfolioInfo} >
                    { poolsInIndex }

                </Box>
            </Horizontal>


            

{/* 
            <Typography variant="h6" align="center"> {name}</Typography> 
            <Typography variant="body2" align="center"> {description}</Typography>  */}


            {/* <Box className={classes.chart}>
                <Horizontal align="center">
                    <PieChartWithLabels { ...chartData } /> 
                </Horizontal>
            </Box> */}

        </Box>
       
    )
}

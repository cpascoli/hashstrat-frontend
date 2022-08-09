import { Box, Typography, makeStyles } from "@material-ui/core"
import { TitleValueBox } from "../../TitleValueBox"
import { Token } from "../../../types/Token"
import { fromDecimals } from "../../../utils/formatter"

import { PoolInfo, InvestTokens } from "../../../utils/pools"
import { useTotalDeposited, useTotalWithdrawn, useMultiPoolValue } from "../../../hooks/useIndex"
import { useTokensInfoForIndexes }  from "../../../hooks/usePoolInfo"

import { PieChartWithLabels } from "../../shared/PieChartWithLabels"
import { Horizontal } from "../../Layout"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


interface IndexStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    account?: string
}




export const IndexStatsView = ( { chainId, poolId, depositToken, account } : IndexStatsViewProps ) => {

    const { name, description, investTokens } = PoolInfo(chainId, poolId)
 
    const tokens =  [depositToken, ... InvestTokens(chainId)]
    const indexBalances = useTokensInfoForIndexes(chainId, [poolId], tokens)

    const multiPoolValue = useMultiPoolValue(chainId, poolId)
    const totalDeposited = useTotalDeposited(chainId, poolId)
    const totalWithdrawn = useTotalWithdrawn(chainId, poolId)

    const formattedMultiPoolValue =  (multiPoolValue) ? fromDecimals(multiPoolValue, depositToken.decimals, 2) : ""
    const formattedDeposited =  (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn =  (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""
 
    const classes = useStyle()

  
    const chartData = Object.keys(indexBalances[poolId]).map( symbol => {
        const value = indexBalances[poolId][symbol].value
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any

        return {
            name: symbol,
            value: Number(accountValueFormatted),
        }
    }).filter( it => it.value > 0)

    
    const assetViews = Object.keys(indexBalances[poolId]).map( symbol => {
        const balance = indexBalances[poolId][symbol].balance
        const value = indexBalances[poolId][symbol].value

        const decimals = tokens.find( t => t.symbol === symbol)?.decimals ?? 2
        const accountBalanceFormatted =  fromDecimals(balance, decimals, 4 ) as any
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any

        const valueFormatted = `${accountBalanceFormatted} (${accountValueFormatted} ${ depositToken.symbol }) `

        return { symbol, valueFormatted, balance, value }

    }).filter(it => it.valueFormatted && [...investTokens, depositToken.symbol].includes(it.symbol) )
        .map( it => <TitleValueBox key={it.symbol} title={it.symbol} value={it.valueFormatted}  /> )




    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >

                 <Typography color="textSecondary" align="center" variant="h5">  {name} </Typography>
                 <Typography color="textSecondary" align="center" variant="body2" style={{marginBottom: 30}}> {description} </Typography>

                { formattedMultiPoolValue && 
                   <Horizontal align="center" valign="center"> 
                        { chartData && chartData.length > 0 && 
                            <PieChartWithLabels data={chartData} title="Assets Chart" />  
                        }
                        <Box>
                             { assetViews }
                             <TitleValueBox title="Total Value" value={formattedMultiPoolValue} suffix={depositToken.symbol} />
                            <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                            <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>
                        </Box>
                    </Horizontal>
                 }


                <div style={{marginBottom: 50}} />

            </Box>


        </Box>
    )
}

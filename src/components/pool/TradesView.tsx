import { Box, makeStyles, Typography } from "@material-ui/core"
import { Token } from "../../types/Token"
import { fromDecimals, round } from "../../utils/formatter"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import { useSwapInfoArray } from "../../hooks"
import { TimeSeriesLineChart } from "./TimeSeriesLineChart"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 10,
        maxWidth: 800
    },
    chart: {
        maxWidth: 700,
        margin: "auto"
    }

}))


interface PoolStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}


export const TradesView = ( { chainId, poolId, depositToken, investToken } : PoolStatsViewProps ) => {

    const classes = useStyle()

    // arraay of trades made in chronological order
    const swaps = useSwapInfoArray(chainId, poolId)


    // chart labels & data
    const label1 = `${depositToken.symbol} % Traded`
    const label2 = `${investToken.symbol} % Traded`

    // cumulative % of tokens traded
    let depositTonensPerc = 0
    let investTokensPerc = 0

    const chartData = swaps?.map( (data: any) => {
        const date = data.timestamp * 1000
        const price = parseFloat(fromDecimals(data.feedPrice, 8, 2))

        const depositTokenBalance = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const investTokenBalance = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))

        const bought = (data.side === 'BUY')? 
              parseFloat(fromDecimals(data.bought, investToken.decimals, 6)) : 
              parseFloat(fromDecimals(data.bought, depositToken.decimals, 2))

        const sold = (data.side === 'SELL')? 
              parseFloat(fromDecimals(data.sold, investToken.decimals, 6)) : 
              parseFloat(fromDecimals(data.sold, depositToken.decimals, 2))

        let record : any = {}
        record['time'] = date

        // const stableAssetPercValue = 100 * depositTokenBalance / (investTokenBalance * price + depositTokenBalance)
        // const riskAssetPercValue = 100 * investTokenBalance / (investTokenBalance * price + depositTokenBalance)


        depositTonensPerc += (data.side === 'BUY') ? -round(100 * bought * price / depositTokenBalance) :  //  perc of deposit tokens sold (to buy invest tokens)
                                                      round(100 * sold * price / depositTokenBalance)      //  perc of deposit tokens bought (by selling invest tokens)
        investTokensPerc += (data.side === 'BUY') ?   round(100 * bought / investTokenBalance) :           //  perc of invest tokens bought (by selling deposit tokens)
                                                     -round(100 * sold / investTokenBalance)               //  perc of invest tokens sold (by buying deposit tokens)
        
        record[label1] = round(depositTonensPerc)
        record[label2] = round(investTokensPerc)
        return record
    })


    // Trades table headers
    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', type: 'date', width: 130, sortable: true },
        { field: 'side', headerName: 'Side', width: 90, sortable: false },
        {
            field: 'riskAssetTradedAmount',
            headerName: `${investToken.symbol} Traded`,
            description: 'The amount of the risk asset bought or sold',
            type: 'string',
            sortable: false,
            width: 150,
            // valueFormatter: (params) => {
            //     return params.value;
            // },
        },
        {
            field: 'stableAssetTradedAmount',
            headerName: `${depositToken.symbol} Traded`,
            description: 'The amount of the stable asset sold or bought',
            type: 'string',
            sortable: false,
            width: 150,
            // valueFormatter: (params) => {
            //     return params.value;
            // },
          },
          {
            field: 'feedPrice',
            headerName: 'Price',
            type: 'number',
            width: 120,
            sortable: false,
        },
    ];

    // Trades table rows
    const rows = swaps?.slice().reverse()?.map( (data: any, index: number) => {

        const date = new Date(data.timestamp * 1000)
        const feedPrice = parseFloat(fromDecimals(data.feedPrice, 8, 2))

        const tradeSideFactor = data.side === 'BUY' ? 1.0 : -1.0
        const amount1 = data.side === 'BUY' ? data.bought : data.sold
        const amount2 = data.side === 'BUY' ? data.sold : data.bought
        const riskAssetAmountTraded = parseFloat(fromDecimals(amount1, investToken.decimals, 6))
        const stableAssetAmountTraded =  parseFloat(fromDecimals(amount2, depositToken.decimals, 2))

        // perc risk asset traded
        const riskAssetBalance = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))
        const riskAssetTradedPerc = round(100 * riskAssetAmountTraded  / ( riskAssetBalance + (data.side === 'BUY' ? 0 : riskAssetAmountTraded) ))

        // perc stable asset traded
        const stableAssetBalance = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const stableAssetTradedPerc = round(100 * stableAssetAmountTraded / (stableAssetBalance + (data.side === 'BUY' ? stableAssetAmountTraded : 0) ))

        return {
            id: index,
            date: date,
            side: data.side,
            feedPrice: feedPrice,
            riskAssetTradedAmount: `${tradeSideFactor * riskAssetAmountTraded} (${riskAssetTradedPerc}%)`,
            stableAssetTradedAmount: `${-tradeSideFactor * stableAssetAmountTraded} (${stableAssetTradedPerc}%)`,
        }
    })
  
  

    return (
        <Box className={classes.container}>

            <Typography align="center">Assets Traded (Cumulative % Chg)</Typography>
            <Box className={classes.chart} >
                <TimeSeriesLineChart title="Assets Traded (Cumulative % Chg)" 
                    label1={label1} 
                    label2={label2} 
                    data={chartData}  
                /> 
            </Box>

            <br/>

            { rows && 
                <Box> 
                    <div style={{ height: rows.length * 56 + 110, width: '100%', marginTop: 20 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                    />
                    </div>
                </Box> 
            }

        </Box>
    )
}

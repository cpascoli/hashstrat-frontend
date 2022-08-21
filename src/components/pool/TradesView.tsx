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

    const swaps = useSwapInfoArray(chainId, poolId)
    const label1 = `${depositToken.symbol} % Traded`
    const label2 = `${investToken.symbol} % Traded`

    
    // chart of cumulative % of tokens traded
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
        depositTonensPerc += (data.side === 'BUY') ? -round(100 * bought * price / depositTokenBalance) :  // Bought invest tokens and sold deposit tokens
                                                      round(100 * sold * price / depositTokenBalance)      // Sold invest tokens and bought deposit tokens
        investTokensPerc += (data.side === 'BUY') ?   round(100 * bought / investTokenBalance) :           // Bought invest tokens and sold deposit tokens 
                                                     -round(100 * sold / investTokenBalance)               // Sold invest tokens and bought deposit tokens
        
        record[label1] = round(depositTonensPerc)
        record[label2] = round(investTokensPerc)
        return record
    })


    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', type: 'date', width: 130, sortable: true },
        { field: 'side', headerName: 'Side', width: 90, sortable: false },
        {
            field: 'asset1',
            headerName: `${investToken.symbol} Traded`,
            description: 'The amount of the risk asset bought or sold',
            type: 'number',
            sortable: false,
            width: 150,
            valueFormatter: (params) => {
                return params.value;
            },
        },
        {
            field: 'asset2',
            headerName: `${depositToken.symbol} Traded`,
            description: 'The amount of the stable asset sold or bought',
            type: 'number',
            sortable: false,
            width: 150,
            valueFormatter: (params) => {
                return params.value;
            },
          },
          {
            field: 'feedPrice',
            headerName: 'Price',
            type: 'number',
            width: 120,
            sortable: false,
        },
      ];

     const rows = swaps?.map( (data: any, index: number) => {
        const date = new Date(data.timestamp * 1000)
        const feedPrice = parseFloat(fromDecimals(data.feedPrice, 8, 2))

        const factor = data.side === 'BUY' ? 1.0 : -1.0
        const amount1 = data.side === 'BUY' ? data.bought : data.sold
        const amount2 = data.side === 'BUY' ? data.sold : data.bought
        const asset1 = factor * parseFloat(fromDecimals(amount1, investToken.decimals, 8))
        const asset2 = factor * parseFloat(fromDecimals(amount2, depositToken.decimals, 2))
        return {
            id: index,
            date: date,
            side: data.side,
            feedPrice: feedPrice,
            asset1: asset1,
            asset2: asset2,
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

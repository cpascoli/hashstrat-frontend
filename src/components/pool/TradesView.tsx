import { Box, makeStyles, Typography } from "@material-ui/core"
import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import { useSwapInfoArray } from "../../hooks"
import { TimeSeriesLineChart } from "./TimeSeriesLineChart"
import { DataUsageSharp } from "@material-ui/icons"


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


interface PoolStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}



export const TradesView = ( { chainId, poolId, depositToken, investToken } : PoolStatsViewProps ) => {

    const classes = useStyle()

    const swaps = useSwapInfoArray(chainId, poolId)
    const label1 = `${investToken.symbol} Amount`
    const label2 = `${depositToken.symbol} Amount`
  
    const chartData = swaps?.map( (data: any) => {
        const date = data.timestamp * 1000
        const price = parseFloat(fromDecimals(data.feedPrice, 8, 2))
        const asset1 = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))
        const asset2 = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))

        let record : any = {}
        record['time'] = date
        record[label1] = asset1
        record[label2] = asset2
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
        },
        {
            field: 'asset2',
            headerName: `${depositToken.symbol} Traded`,
            description: 'The amount of the stable asset sold or bought',
            type: 'number',
            sortable: false,
            width: 150,
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
        // timestamp:
        // side: 
        // bought: 
        // sold:
        // feedPrice: 
        // depositTokenBalance:
        // investTokenBalance:
        const date = new Date(data.timestamp * 1000)
        const feedPrice = parseFloat(fromDecimals(data.feedPrice, 8, 2))

        const factor = data.side === 'BUY' ? 1.0 : -1.0
        const amount1 = data.side === 'BUY' ? data.bought : data.sold
        const amount2 = data.side === 'BUY' ? data.sold : data.bought
        const asset1 = factor * parseFloat(fromDecimals(amount1, investToken.decimals, 6))
        const asset2 = -1 * factor * parseFloat(fromDecimals(amount2, depositToken.decimals, 2))

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
        <Box className={classes.container} px={3}>

            <Typography align="center">
                Strategy Trades
            </Typography>

            <TimeSeriesLineChart title="Assets Value in USD" 
                label1={label1} 
                label2={label2} 
                data={chartData}  
            /> 

            <br/>

            { rows && 
                <div style={{ height: rows.length * 56 + 110, width: '100%', marginTop: 20 }}>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        // checkboxSelection
                />
                </div>
            }

        </Box>
    )
}

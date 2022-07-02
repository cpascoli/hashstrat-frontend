import { Box, makeStyles, Typography } from "@material-ui/core"
import { Token } from  "../Main"
import { fromDecimals } from "../../utils/formatter"
import { DataGrid, GridColDef } from "@material-ui/data-grid"


import { useSwapInfoArray } from "../../hooks"

import { TimeSeriesChart } from "./TimeSeriesChart"


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
    account: string,
    depositToken: Token,
    investToken: Token
}



export const TradesView = ( { chainId, account, depositToken, investToken } : PoolStatsViewProps ) => {

    const classes = useStyle()

    const swaps = useSwapInfoArray(chainId)
    const label1 = `${depositToken.symbol}`
    const label2 = `${investToken.symbol}`
  
    const chartData = swaps?.map( (data: any) => {
        const date = data.timestamp * 1000
        const price = parseFloat(fromDecimals(data.feedPrice, 8, 2))
        const asset1 = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const asset2 = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))

        console.log("info >>>: ", price, asset1, asset2)

        let record : any = {}
        record['time'] = date
        record[label1] = asset1
        record[label2] = asset2 * price
        return record
    })


    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', type: 'date', width: 130, sortable: true },
        { field: 'side', headerName: 'Side', width: 90, sortable: false },
        {
            field: 'feedPrice',
            headerName: 'Price',
            type: 'number',
            width: 120,
            sortable: false,
        },
        {
            field: 'asset1',
            headerName: `${depositToken.symbol} Balance`,
            description: 'The amount of the stable asset held by the pool',
            type: 'number',
            sortable: false,
            width: 150,
        },
        {
            field: 'asset2',
            headerName: `${investToken.symbol} Balance`,
            description: 'The amount of the risk asset held by the pool',
            type: 'number',
            sortable: false,
            width: 150,
          },
      ];

     const rows = swaps?.map( (data: any, index: number) => {
        // timestamp:
        // side: 
        // swapPrice: 
        // feedPrice: 
        // depositTokenBalance:
        // investTokenBalance:
        const date = new Date(data.timestamp * 1000)
        const feedPrice = parseFloat(fromDecimals(data.feedPrice, 8, 2))
        const asset1 = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const asset2 = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))

        return {
            id: index,
            date: date,
            side: data.side,
            feedPrice: feedPrice,
            asset1: asset1,
            asset2: asset2,
            portfolioValue: asset1 + (asset2 * feedPrice)
        }
    })
  

  

    return (
        <Box className={classes.container} px={3}>

            <Typography align="center">
                Assets held in the pool over time
            </Typography>

            <TimeSeriesChart title="Assets Value in USD" 
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

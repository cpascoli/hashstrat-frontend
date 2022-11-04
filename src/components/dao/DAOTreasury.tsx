
import { utils } from "ethers"
import { Link, Box, makeStyles, Typography, Card, CardContent, CircularProgress } from  "@material-ui/core"
import { DataGrid, GridColDef } from "@material-ui/data-grid"

import { useGetBalance, useGetPayments } from "../../hooks/useTreasury"
import { fromDecimals } from "../../utils/formatter"
import { Token } from "../../types/Token"
import { Horizontal } from "../Layout"
import { NetworkExplorerHost, DivsDistributorAddress } from "../../utils/network"


interface DAOTreasuryProps {
    chainId: number,
    account?: string,
    depositToken: Token
}


const useStyles = makeStyles( theme => ({
    tokenInfo: {
        maxWidth: 600,
        margin: "auto"
    },
    container: {
        padding: theme.spacing(2),
        minHeight: 300
    },
    info:{
        margin: "auto"
    }
}))




export const DAOTreasury = ({ chainId, account, depositToken } : DAOTreasuryProps ) => {

    const classes = useStyles()
    const treasuryBalance = useGetBalance(chainId)
    const payments = useGetPayments(chainId)

    const treasuryBalanceFormatted = treasuryBalance ? fromDecimals(treasuryBalance, depositToken.decimals, 2) : undefined
    

    const paymentList = payments?.slice().reverse().map( (payment : any) => {
        return {
            id: payment.id,
            amount: payment.amount,
            recepient: payment.recepient,
            timestamp: payment.timestamp 
        }
    })


    const explorerHost = NetworkExplorerHost(chainId)
    const divsDistributor = DivsDistributorAddress(chainId)
                
     // Payments table headers
     const columns: GridColDef[] = [
        { 
            field: 'date', 
            headerName: 'Date', 
            type: 'date',
            width: 130, 
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            width: 150,
            sortable: false,
            align: 'center',
            headerAlign: 'center',

            renderCell: (params) => {
                const amount = params.value ? utils.commify(params.value.toString()) : '0'
                return`${amount} ${depositToken.symbol}`
            },
        },
        {
            field: 'recepient',
            headerName: `Recepient`,
            description: 'The recepeint of this payment',
            type: 'string',
            width: 350,
            sortable: false,
            align: 'center',
            headerAlign: 'center',

            renderCell: (params) => {
                const url = `https://${explorerHost}/address/${params.value}`
                const name = divsDistributor.toLowerCase() === params.value?.toString().toLowerCase() ? "Divs Distribution Contract" : params.value
                return <Link href={url} target="_blank">{name}</Link>;
            },
        },
    ];



    // Payments table rows
    const rows = paymentList?.map( (data: any, index: number) => {
        return {
            date: new Date(data.timestamp * 1000),
            id: data.id,
            amount: parseFloat(fromDecimals(data.amount, depositToken.decimals, 2)),
            recepient: data.recepient,
        }
    })



    return (
        <Box className={classes.container}>
            <Box p={0}>
                DAO Treasury is where protocol fees are collected and held until the next dividend distribution starts. 
                <br/>
                DAO token holders can vote to use Treasury's funds for other initiatives, like R&amp;D and markerting.
            </Box>


            <Box my={4}>

                <Horizontal align="center">
                    <Card style={{ width: 250, height: 150 }} variant="outlined" >
                        <CardContent>
                            <div style={{ display:'flex', justifyContent:'center' }}> 
                                <Typography variant="body1" style={{ marginBottom: 30 }}> Funds held in the Treasury </Typography>
                            </div>
                            <div style={{ display:'flex', justifyContent:'center' }}> 
                            { !treasuryBalanceFormatted && <CircularProgress color="secondary" />}
                            { treasuryBalanceFormatted && 
                                <Typography variant="h5" style={{ marginBottom: 30 }} >
                                    { utils.commify( treasuryBalanceFormatted ) } { depositToken.symbol }
                                </Typography>
                            }
                            </div>
                        </CardContent>
                    </Card>
                </Horizontal>

                { rows && 
                    <Box py={2} > 
                        <div style={{ height: rows.length * 56 + 110, width: '100%', marginTop: 20 }}>
                            <Typography variant="h5" style={{ marginBottom: 10 }} >
                               Past Payments
                            </Typography>

                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                disableSelectionOnClick={true}
                            />
                        </div>
                    </Box> 
                }


            </Box>
        </Box>
    )
}



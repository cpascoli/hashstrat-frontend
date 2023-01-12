import { useEffect, useState } from 'react'
import { BigNumber, utils } from 'ethers'
import moment from 'moment'

import { makeStyles, Box, Paper, TextField, Typography, Select, MenuItem, Card, CardContent } from  "@material-ui/core"
import { DataGrid, GridColDef } from "@material-ui/data-grid"

import { TimeSeriesAreaChart } from "../shared/TimeSeriesAreaChart"


import { DepositToken, InvestTokens } from "../../utils/pools"
import { TimeSeriesLineChart, TimeSeriesData } from "../shared/TimeSeriesLineChart"
import { RoiInfo } from '../../types/RoiInfo'
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { round } from "../../utils/formatter"
import { roiDataForSwaps  } from "../../utils/calculators/indexRoiCalculator"
import { SimulatorInastance, StrategyName } from "../../services/simulator/SimulatorService"

import { fromDecimals } from "../../utils/formatter"
import { SwapInfo } from "../../types/SwapInfo"
import { Horizontal } from '../Layout'


const useStyle = makeStyles( theme => ({
 
    container: {
        paddingTop: 2,
        paddingLeft: 20,
        paddingRight: 20,
        maxWidth: 900,
        margin: "auto",
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
		},
    },
    form: {
        width: "100%",
        [theme.breakpoints.down('xs')]: {
            width: 200,
		},
    },

    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    },
    dateField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    amountField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    selectField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    }

}))


export interface SimHomeProps {
    chainId: number,
}


export const SimHome = ({ chainId } : SimHomeProps) => {

    const classes = useStyle()

    const [investment, setInvestment] = useState<number>(1000)
    const [fromDate, setFromDate] = useState<Date>(new Date('2019-01-15T00:00:00')) // 2018-12-15 //'2018-01-01T00:00:00'
    const [toDate, setToDate] = useState<Date>(new Date('2022-06-18T00:00:00'))  // new Date())
    const [asset, setAsset] = useState<string>("WETH")
    const [strategy, setStrategy] = useState<string>(StrategyName[StrategyName.TrendFollowing])
    
    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)
    const [chartValueData, setChartValueData] = useState<TimeSeriesData[]|undefined>(undefined)
    

    const [roiInfo, setRoiInfo] = useState<RoiInfo|undefined>(undefined)

    const depositToken = DepositToken(chainId)!
    const investTokens = InvestTokens(chainId)

    const investToken = investTokens.find( it => it.symbol === asset)!

    // Run simulator
    const simulator = depositToken && investToken && SimulatorInastance(asset, StrategyName[strategy as keyof typeof StrategyName], investment, depositToken, [investToken])
    const swapsInfos = simulator?.getSwapsInfo(fromDate, toDate)
    const swaps = swapsInfos?.map( (it : PoolTokensSwapsInfo) => it.swaps ).flat()


    const label1 = `Strategy ROI`
    const label2 = `Buy & Hold ROI`

    const labelValue1 = `${depositToken.symbol} Value %`
    const labelValue2 = `${investToken.symbol} Value %`

    

    useEffect(() => {

        if (swapsInfos && depositToken && investToken && !chartData && investment > 0 ) {
            const roi = roiDataForSwaps(swapsInfos, depositToken, [investToken], investment)
            const lastRoi = roi[roi.length-1]
            setRoiInfo(lastRoi)

            // strategy roi data
            const data = roi.map( (data: RoiInfo) => {
                let record : any = {}
                record['time'] = data.date * 1000
                record[label1] = round(data.strategyROI)
                record[label2] = round(data.buyAndHoldROI)
                return record
            })
            setChartData(data)

            // asset value chart data
            const valueData = roi.map( (data: RoiInfo) => {
                let record : any = {}
                record['time'] = data.date * 1000
                record[labelValue1] = round(data.depositTokenPerc)
                record[labelValue2] = round(data.investTokenPerc)
                return record
            })
            setChartValueData(valueData)
        }

	}, [swapsInfos, depositToken, investToken])



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
        {
            field: 'portfolioValue',
            headerName: 'Portfolio Value',
            type: 'number',
            width: 150,
            sortable: false,
        },
    ]



    // Trades table rows
    const rows = swaps?.slice().sort( (a, b) => Number(b.timestamp) - Number(a.timestamp)  )?.map( (data : SwapInfo, index: number) => {

        const date = new Date( Number(data.timestamp) * 1000)
        const feedPrice = parseFloat(fromDecimals(BigNumber.from(data.feedPrice), 8, 2))

        const tradeSideFactor = data.side === 'BUY' ? 1.0 : -1.0
        const amount1 = data.side === 'BUY' ? BigNumber.from(data.bought) : BigNumber.from(data.sold)
        const amount2 = data.side === 'BUY' ? BigNumber.from(data.sold) : BigNumber.from(data.bought)
        const riskAssetAmountTraded = parseFloat(fromDecimals(amount1, investToken.decimals, 6))
        const stableAssetAmountTraded = parseFloat(fromDecimals(amount2, depositToken.decimals, 2))

        // perc risk asset traded
        const riskAssetBalance = parseFloat(fromDecimals(BigNumber.from(data.investTokenBalance), investToken.decimals, 6))
        const riskAssetTradedPerc = round(100 * riskAssetAmountTraded  / ( riskAssetBalance + (data.side === 'BUY' ? 0 : riskAssetAmountTraded) ))

        // perc stable asset traded
        const stableAssetBalance = parseFloat(fromDecimals(BigNumber.from(data.depositTokenBalance), depositToken.decimals, 2))
        const stableAssetTradedPerc = round(100 * stableAssetAmountTraded / (stableAssetBalance + (data.side === 'BUY' ? stableAssetAmountTraded : 0) ))

        const portfolioValueFormatted = data.portfolioValue && fromDecimals(BigNumber.from(data.portfolioValue), depositToken.decimals, 2)

        return {
            id: index,
            date: date,
            side: data.side,
            feedPrice: feedPrice,
            riskAssetTradedAmount: `${tradeSideFactor * riskAssetAmountTraded} (${riskAssetTradedPerc}%)`,
            stableAssetTradedAmount: `${-tradeSideFactor * stableAssetAmountTraded} (${stableAssetTradedPerc}%)`,
            portfolioValue: portfolioValueFormatted && utils.commify( portfolioValueFormatted )
        }
    })



    return (
        <Box className={classes.container}>

            <Paper>
                
                <Box py={4}>
                    <Typography variant='h3' align="center">Strategy Simulator</Typography>
                </Box>

                <Box px={2} >
                    <Horizontal align='center'>
                        <form  noValidate className={classes.form}>

                            <Select 
                                className={classes.selectField}
                                id="asset-select"
                                value={asset}
                                label="Asset"
                                onChange={ (e) => { 
                                    setAsset(e.target.value as string) 
                                    setChartData(undefined)
                                }}
                            >
                                <MenuItem key={0} value={'WBTC'}>BTC</MenuItem>
                                <MenuItem key={1} value={'WETH'}>ETH</MenuItem>
                            </Select>

                            <Select 
                                className={classes.selectField}
                                id="strategy-select"
                                value={strategy}
                                label="Strategy"
                                onChange={ (e) => { 
                                    setStrategy( e.target.value as string) 
                                    setChartData(undefined)
                                }}
                                placeholder="Select strategy"
                            >
                                <MenuItem key={0} value={ StrategyName[StrategyName.Rebalancing]}>Rebalancing</MenuItem>
                                <MenuItem key={1} value={ StrategyName[StrategyName.MeanReversion]}>Mean Reversion</MenuItem>
                                <MenuItem key={2} value={ StrategyName[StrategyName.TrendFollowing]}>Trend Following</MenuItem>
                            </Select>

                            <br/>
                        
                            <TextField
                                id="dateFrom"
                                label="From"
                                type="date"
                                defaultValue={ moment(fromDate.getTime()).format('yyyy-MM-DD') }
                                className={classes.dateField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => { 
                                    console.log("From changed: ", e.target.value)
                                    setFromDate( new Date(Date.parse(e.target.value )) )
                                    setChartData(undefined)
                                }}
                            />

                            <TextField
                                id="dateTo"
                                label="To"
                                type="date"
                                defaultValue={ moment(toDate.getTime()).format('yyyy-MM-DD') }
                                className={classes.dateField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    console.log("To changed: ", e.target.value)
                                    setToDate( new Date(Date.parse(e.target.value )) )
                                    setChartData(undefined)
                                }}
                            />

                            <TextField
                                id="investment"
                                label="Investment"
                                type="number"
                                defaultValue="1000"
                                className={classes.amountField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{min: 0, style: { textAlign: 'right' }}} 
                                placeholder='USDC'
                                onChange={(e) => {
                                    console.log("Amount changed: ", e.target.value)
                                    setInvestment(Number(e.target.value))
                                    setChartData(undefined)
                                }}
                            />

                        </form>
                    </Horizontal>
                </Box>

                <Box py={4} >
                    <Horizontal align="center">

                        <Card style={{ minWidth: 240, height: 150 }} variant="outlined" >
                            <CardContent>
                                <div style={{ display:'flex', justifyContent:'center' }}> 
                                    <Typography variant="body1" style={{ marginBottom: 20 }}> Portfolio Value </Typography>
                                </div>
                                <div style={{ display:'flex', justifyContent:'center' }}> 
                                    { roiInfo &&
                                        <>
                                            <Typography variant="h5" style={{ marginBottom: 20 }} color='primary'>
                                                ${ utils.commify( roiInfo.strategyValue ) }
                                            </Typography>
                                        </>
                                    }
                                </div>
                                { roiInfo &&
                                    <Typography variant="body2" style={{ paddingBottom: 0, paddingTop:0 }} align="center" >
                                        Buy &amp; Hold value: ${ utils.commify( roiInfo.buyAndHoldValue ) }
                                    </Typography>
                                }
                            </CardContent>
                        </Card>

                        <Card style={{ minWidth: 240, height: 150 }} variant="outlined" >
                            <CardContent>
                                <div style={{ display:'flex', justifyContent:'center' }}> 
                                    <Typography variant="body1" style={{ marginBottom: 20 }}> Strategy ROI </Typography>
                                </div>
                                <div style={{ display:'flex', justifyContent:'center' }}> 
                                    { roiInfo &&
                                        <>
                                            <Typography variant="h5" style={{ marginBottom: 20 }} color='primary'>
                                                { utils.commify( roiInfo.strategyROI ) }%
                                            </Typography>
                                        </>
                                    }
                                </div>
                                { roiInfo &&
                                    <Typography variant="body2" style={{ paddingBottom: 0, paddingTop:0 }} align="center" >
                                        Buy &amp; Hold ROI: { utils.commify( roiInfo.buyAndHoldROI ) }%
                                    </Typography>
                                }
                            </CardContent>
                        </Card>
                    </Horizontal>
                </Box>

                <Box className={classes.chart} >
                    <TimeSeriesLineChart 
                        title="Strategy ROI vs Benchmark" 
                        label1={label1} 
                        label2={label2} 
                        data={chartData!}  
                    /> 
                </Box>

                <Box className={classes.chart} >
                    <TimeSeriesAreaChart title="Asset Value %" 
                        label1={labelValue1} 
                        label2={labelValue2} 
                        data={chartValueData!}  
                    /> 
                </Box>



                { rows && 
                    <Box> 
                        <div style={{ height: rows.length * 56 + 110, width: '100%', marginTop: 20 }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                
                        />
                        </div>
                    </Box> 
                }

            </Paper>
        </Box>
    )
}
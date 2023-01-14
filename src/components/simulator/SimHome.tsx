import { useEffect, useState } from 'react'
import moment from 'moment'
import { makeStyles, Box, Paper, TextField, Typography, Select, MenuItem } from  "@material-ui/core"

import { SimulatorInastance, StrategyName } from "../../services/simulator/SimulatorService"
import { DepositToken, InvestTokens } from "../../utils/pools"
import { roiDataForSwaps  } from "../../utils/calculators/roiCalculator"
import { RoiInfo } from '../../types/RoiInfo'
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { Horizontal } from '../Layout'
import { InfoCard } from './InfoCard'
import { StraetegyTrades } from "./StraetegyTrades"
import { ROIChart } from "./ROIChart"
import { AssetAllocationChart } from "./AssetAllocationChart"
import { DrawdownChart } from './DrawdownChart'

const useStyle = makeStyles( theme => ({
 
    container: {
        marginTop: 2,
        paddingLeft: 20,
        paddingRight: 20,
        maxWidth: 1200,
        margin: "auto",
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
		},
    },

    form: {
        width: "100%",
    },

    metrics: {
        maxWidth: 900
    },

    formField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
        [theme.breakpoints.down('xs')]: {
            marginBottom: 20,
            width: 140,
		},
    },

    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },

    trades: {
        minWidth: 900,
        [theme.breakpoints.down('xs')]: {
            minWidth: '100%'
		},
    }

}))


export interface SimHomeProps {
    chainId: number,
}


export const SimHome = ({ chainId } : SimHomeProps) => {


    const classes = useStyle()

    const params = {
        fromDate: "sim.fromDate",
        toDate: "sim.toDate",
        asset: "sim.asset",
        strategy: "sim.strategy",
        investment: "sim.investment",
    }

    // get sim params from local storage or defaults
    const fromDateStorage = localStorage.getItem(params.fromDate) ?? '2019-01-15T00:00:00'
    const toDateStorage = localStorage.getItem(params.toDate) ?? '2022-06-18T00:00:00'
    const assetStorage = localStorage.getItem(params.asset) ?? 'WETH'
    const strategyStorage = localStorage.getItem(params.strategy) ?? StrategyName[StrategyName.TrendFollowing]
    const investmentStorage = localStorage.getItem(params.investment) ?? '1000'

    // initialize form values
    const [investment, setInvestment] = useState<number>(Number(investmentStorage))
    const [fromDate, setFromDate] = useState<Date>(new Date(fromDateStorage)) // 2018-12-15 //'2018-01-01T00:00:00'
    const [toDate, setToDate] = useState<Date>(new Date(toDateStorage))       // new Date())
    const [asset, setAsset] = useState<string>(assetStorage)
    const [strategy, setStrategy] = useState<string>(strategyStorage)
    

    // ROI items
    const [roiInfos, setRoiInfos] = useState<RoiInfo[]|undefined>(undefined)

    const depositToken = DepositToken(chainId)!
    const investTokens = InvestTokens(chainId)
    const investToken = investTokens.find( it => it.symbol === asset)!

    // Run simulator
    const simulator = depositToken && investToken && SimulatorInastance(asset, StrategyName[strategy as keyof typeof StrategyName], investment, depositToken, [investToken])
    const swapsInfos = simulator?.getSwapsInfo(fromDate, toDate)
    const swaps = swapsInfos?.map( (it : PoolTokensSwapsInfo) => it.swaps ).flat()


    useEffect(() => {
        if (swapsInfos && depositToken && investToken && validate(investment, fromDate, toDate) ) {
            const roiInfos = roiDataForSwaps(swapsInfos, depositToken, [investToken], investment)
            setRoiInfos(roiInfos)
        }

	}, [fromDate, toDate, asset, strategy, investment])


    const validate = (amount: number, from: Date, to: Date) => {
        const validAmount = amount > 0
        const validDates = from.getTime() > new Date('2009-01-01T00:00:00').getTime() &&
            from.getTime() < (to.getTime() + 86400 * 1000)

        return validAmount && validDates
    }


    const lastRoi = roiInfos && roiInfos.length > 0 ? roiInfos[roiInfos.length-1] : undefined


    return (
        <Paper className={classes.container}>

                <Box py={4}>
                    <Typography variant='h3' align="center">Strategy Simulator</Typography>
                </Box>

                <Box px={2} >
                    <Horizontal align='center'>
                        <form  noValidate className={classes.form}>
                            <Select 
                                className={classes.formField}
                                id="asset-select"
                                value={asset}
                                label="Asset"
                                onChange={ (e) => { 
                                    setAsset(e.target.value as string) 
                                    localStorage.setItem(params.asset, e.target.value as string)
                                }}
                            >
                                <MenuItem key={0} value={'WBTC'}>BTC</MenuItem>
                                <MenuItem key={1} value={'WETH'}>ETH</MenuItem>
                            </Select>

                            <Select 
                                className={classes.formField}
                                id="strategy-select"
                                value={strategy}
                                label="Strategy"
                                onChange={ (e) => { 
                                    setStrategy( e.target.value as string) 
                                    localStorage.setItem(params.strategy, e.target.value as string)
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
                                className={classes.formField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => { 
                                    console.log("e.target.value", e.target.value)
                                    if (e.target.value.length > 0) {
                                        const date = Date.parse(e.target.value) > new Date().getTime() ? new Date() : new Date(Date.parse(e.target.value))
                                        setFromDate(date)
                                        localStorage.setItem(params.fromDate, date.toISOString())
                                    }
                
                                }}
                            />

                            <TextField
                                id="dateTo"
                                label="To"
                                type="date"
                                defaultValue={ moment(toDate.getTime()).format('yyyy-MM-DD') }
                                className={classes.formField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    console.log("e.target.value", e.target.value)
                                    if (e.target.value.length > 0) {
                                        const date = Date.parse(e.target.value) > new Date().getTime() ? new Date() : new Date(Date.parse(e.target.value))
                                        setToDate(date)
                                        localStorage.setItem(params.toDate, date.toISOString())
                                    }
                                }}
                            />

                            <TextField
                                id="investment"
                                label="Investment"
                                type="number"
                                defaultValue={investment}
                                className={classes.formField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{min: 0, style: { textAlign: 'right' }}} 
                                placeholder='USDC'
                                onChange={(e) => {
                                    setInvestment(Number(e.target.value))
                                    localStorage.setItem(params.investment, e.target.value)
                                }}
                            />
                        </form>
                    </Horizontal>
                </Box>

                <Horizontal align="center" >
                    <Box py={4} className={classes.metrics}>
                        <Horizontal align="center" >
                            <InfoCard 
                                type="amount"
                                title="Portfolio Value" value={lastRoi?.strategyValue} 
                                detailTitle="Buy-and-hold" detailValue={lastRoi?.buyAndHoldValue} 
                            /> 
                            <InfoCard 
                                type="percentage"
                                title="Strategy ROI" value={lastRoi?.strategyROI} 
                                detailTitle="Buy-and-hold" detailValue={lastRoi?.buyAndHoldROI} 
                            /> 
                            <InfoCard 
                                type="percentage"
                                title="Max Drawdown" value={lastRoi?.maxStrategyDrawdownPerc} 
                                detailTitle="Buy-and-hold" detailValue={lastRoi?.maxBuyAndHoldDrawdownPerc} 
                            /> 
                        </Horizontal>
                    </Box>
                </Horizontal>


                { roiInfos &&
                    <ROIChart roiInfos={roiInfos} /> 
                }
                { roiInfos &&
                    <DrawdownChart roiInfos={roiInfos} /> 
                }
                { roiInfos &&
                    <AssetAllocationChart roiInfos={roiInfos} 
                        asset1={investToken.symbol} 
                        asset2={depositToken.symbol}
                    /> 
                }

                <Horizontal align='center'>
                    <Box className={classes.trades}>
                        <StraetegyTrades swaps={swaps} depositToken={depositToken} investToken={investToken} />
                    </Box>
                </Horizontal>

            </Paper>
    )
}

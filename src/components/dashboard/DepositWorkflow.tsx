import { makeStyles, Box, Link, Typography, Breadcrumbs, Checkbox, FormControl, InputLabel, Select, MenuItem,
    FormControlLabel, FormGroup, Button, Popover, Paper, Divider,  Stepper, StepLabel, Step  } from "@material-ui/core"
import { useState, useEffect } from "react";

import { SnackInfo } from "../SnackInfo"

import { Token } from "../../types/Token"
import { DepositWithdrawView } from "../wallet/DepositWithdrawView"

import { usePoolsInfo, useIndexesInfo, PoolData } from "../dashboard/DashboadModel"

import { PoolIds } from "../../utils/pools";
import { PoolSummary } from "../shared/PoolSummary"
import { InvestTokens, PoolInfo } from "../../utils/pools"
import { IndexesIds } from "../../utils/pools";

import poolsInfo from "../../config/pools.json"
import indexesInfo from "../../config/indexes.json"
import networksConfig from "../../config/networks.json"
import { Horizontal } from "../Layout";

import wbtc from "../img/wbtc.png"
import weth from "../img/weth.png"





interface DespositWorkflowProps {
    chainId: number,
    depositToken: Token,
    investTokens: Array<Token>,
    account?: string,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },

    asset: {
        margin: theme.spacing(0),
        padding: theme.spacing(1),
        // border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 12,
        minWidth: 100,
        height: 80,
        color: theme.palette.text.primary
    },

    strategy: {
        margin: theme.spacing(0),
        padding: theme.spacing(1),
        // border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 12,
        maxWidth: 300,
        minHeight: 120,
        color: theme.palette.text.primary
    }

}))


const strategyNames = {
    "rebalance_01": "Rebalancing",
    "meanrev_01": "Mean Reversion",
    "trendfollow_01": "Trend Following",
    "rebalance_01,meanrev_01,trendfollow_01": "Mean Reversion + Rebalancing + Trend Following"
}

const assetNames = {
    "WBTC": "BTC",
    "WETH": "ETH",
    "WBTC,WETH": "BTC + ETH",
}


const allStrategies = (chainId: number) : string[]=> {

    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const indexes = indexesInfo[networkName as keyof typeof indexesInfo]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]
    const enabled = [...indexes, ...pools].filter( (pool: {disabled: string}) => { return (pool.disabled === 'false')} )
    const filtered = enabled.map((pool: { strategy: string }) => pool.strategy)
    const deduped = Array.from(new Set(filtered))
    
    let single : Array<string> = [], multi :  Array<string> = [];
    deduped.forEach(e =>  (e.indexOf(',') > 0 ? multi : single).push(e) );

    return [ ...single.sort(), ...multi.sort()]
}


const allAssets = (chainId: number) : string[] => {

    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const indexes = indexesInfo[networkName as keyof typeof indexesInfo]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]

    const enabled = [...indexes, ...pools].filter( (pool: {disabled: string}) => { return (pool.disabled === 'false')} )
 
    const filtered = enabled.map(pool => pool.investTokens.join(','))
    const deduped = Array.from(new Set(filtered))

    let single : Array<string> = [], multi :  Array<string> = [];
    deduped.forEach(e =>  (e.indexOf(',') > 0 ? multi : single).push(e) );

    return [ ...single.sort(), ...multi.sort()]
}

const assetImages = ['WBTC','WETH'].map( (item, idx) => {
    const imageSrc = item === 'WBTC' ? wbtc : item === 'WETH' ? weth : ''
    return <img key={idx} src={imageSrc} style={{width: 35, height: 35}} />
})


const filterPools = (chainId: number, poolsInfo: PoolData[], poolId: string | undefined, asset: string | undefined, mypools: boolean) => {
    console.log("filterPools poolId", poolId, "asset", asset)

    const filtered = poolsInfo.filter( pool => { 

        const info = PoolInfo(chainId, pool.poolId)

        const includePool = poolId === undefined || pool.poolId === poolId
        const includeAsset = asset === undefined || info.investTokens.map( (it: string) => it.toLowerCase()).join(',') === asset.toLowerCase()

        const includeMyPools = mypools == false || isMyPool(pool)

        console.log("filterPools investTokens", includePool, includeAsset, "", asset?.toLowerCase())

        return info.disabled === 'false' && includeAsset && includeMyPools
    })

    return filtered
}

const isMyPool = (pool: PoolData) : boolean => {


    const noValue = pool.tokenInfoArray.reduce( (acc, val) => {
        if ( val.accountValue !== undefined && !val.accountValue?.isZero() ) {
            console.log("isMyPool ", val.symbol, "=>", val.accountValue?.toString())
        }
     
        return acc && (val.accountValue === undefined || val.accountValue?.isZero())
    }, true)


    return !noValue
}



export const DepositWorkflow = ({ chainId, depositToken, investTokens, account } : DespositWorkflowProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]

    const steps = [
        'Select your assets',
        'Select your strategy',
        'Deposit',
    ];

    const [selectedAsset, setSelectedAsset] = useState<string>()
    const [selectedPool, setSelectedPool] = useState<string>()
    

    const didSelectAsset = (asset: string) => {
        console.log("didSelectAsset: ", asset)
        if (asset === selectedAsset) {
            setSelectedAsset(undefined)
        } else {
            setSelectedAsset(asset)
        }
    }

    const didSelectPool = (poolId: string) => {
        console.log("didSelectPool: ", poolId)
        if (poolId === selectedPool) {
            setSelectedPool(undefined)
        } else {
            setSelectedPool(poolId)
        }
    }



    useEffect(() => {
		if (selectedPool !== undefined ) {
            setActiveStep(2)
		} else if (selectedAsset !== undefined) {
            setActiveStep(1)
        } else {
            setActiveStep(0)
        }

	}, [selectedAsset, selectedPool])

    

    const [asset, setAsset] = useState(-1)
    const [strategy, setStrategy] = useState(-1)

    const strategies = allStrategies(chainId)
    const assets = allAssets(chainId)

    // console.log("strategies", strategies)



    const pools = usePoolsInfo(chainId, PoolIds(chainId), tokens, account)
    const indexes = useIndexesInfo(chainId, IndexesIds(chainId), tokens, account)




    //// FILTER POOL

    // const selectedStrategy = strategy == -1 ? undefined : strategies[strategy]

    const poolsForAssets = filterPools(chainId, [...indexes, ...pools], selectedPool, selectedAsset, false).map( pool => { 
        return pool.poolId
    })


    const poolsViews = poolsForAssets?.map( (poolId, idx) => {
        const { name, description, investTokens, depositToken : depositTokenSymbol, disabled } = PoolInfo(chainId, poolId)

        const info = PoolInfo(chainId, poolId)
        console.log("poolId: ", poolId, "selectedPool", selectedPool, info.strategy)
        const strategyName =  strategyNames[info.strategy as keyof typeof strategyNames] || info.strategy

        return (
            <Box p={1} key={idx}>
                <Button color="secondary" onClick={() => didSelectPool(poolId)} variant={selectedPool === poolId? 'contained' : 'outlined'} style={{ textTransform:'none'}} >
                    <Box className={classes.strategy} >
                        <Typography variant="h6">{strategyName}</Typography>
                        <Typography variant="body2">{description}</Typography>
                    </Box>
                </Button>
            </Box>
        )
    })



    ////// STEPPER

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());
  
    const reset = () => {
        setSelectedAsset(undefined)
        setSelectedPool(undefined)
    };


    /// DEPOSIT

    const [showSnack, setShowSnack] = useState(false)
    const [snackContent, setSnackContent] = useState<SnackInfo>()

    const token = tokens.find(el => el.symbol === 'USDC')

    const handleSuccess = (info: SnackInfo) => {
        console.log("DepositWorkflow.handleSuccess() >>> ", info)
        setSnackContent(info)
        setShowSnack(true)
    }

    const handleError = (error: SnackInfo) => {
        console.log("DepositWorkflow.handleError() >>> ", error)
        setSnackContent(error)
        setShowSnack(true)
    }

    const handleGoBackToStep = (step: number) => {
        console.log("DepositWorkflow.handleGoBackToStep() >>> ", step)
        if (step == 0) {
            setSelectedAsset(undefined)
            setSelectedPool(undefined)
        }
        if (step == 1) {
            setSelectedPool(undefined)
        }
    }

    
    const assetSelectionStep = selectedAsset ? assetNames[ selectedAsset.toUpperCase() as keyof typeof assetNames] : ''

    const strategySelectionStep = selectedPool && strategyNames[PoolInfo(chainId, selectedPool).strategy as keyof typeof strategyNames]


    return (
        <Box mt={5}>

            <Paper>
                <Box py={2}>
                    <Typography variant="body2" align="center" style={{marginTop: 10}}>Select your combination of Assets and Strategy to start investing</Typography>
                </Box>
            

                <Stepper activeStep={activeStep} alternativeLabel >
                    {steps.map((label, idx) => (
                        <Step key={label}>
                        <StepLabel children={
                            <Box>
                                <Typography>{label}</Typography>
                                <Link onClick={ e => handleGoBackToStep(idx) } >
                                    <Typography variant="body2">{ idx == 0 ? assetSelectionStep : idx == 1 ? strategySelectionStep : '' }</Typography>
                                </Link>
                            </Box>
                        } />
                        </Step>
                    ))}
                </Stepper>

                { selectedAsset === undefined &&
                    <Box pt={3} pb={2} display="flex" justifyContent="center" >

                        <Horizontal align="center">
                                <Box p={1}>
                                    <Button color="secondary" onClick={() => didSelectAsset('wbtc')} variant={selectedAsset === 'wbtc' ? 'contained' : 'outlined'} >
                                        <Box className={classes.asset} >
                                            <Box>BTC</Box>
                                            {assetImages[0]}
                                        </Box>
                                    </Button>
                                </Box>
                                
                                <Box p={1}>
                                    <Button color="secondary" onClick={() => didSelectAsset('weth')} variant={selectedAsset === 'weth' ? 'contained' : 'outlined'}>
                                        <Box className={classes.asset} >
                                            <Box>ETH</Box>
                                            {assetImages[1]}
                                        </Box>
                                    </Button>
                                </Box>

                                <Box p={1}>
                                    <Button color="secondary" onClick={() => didSelectAsset('wbtc,weth')} variant={selectedAsset === 'wbtc,weth' ? 'contained' : 'outlined'}>
                                        <Box className={classes.asset} >
                                            <Box>BTC + ETH</Box>
                                            <Horizontal align="center">
                                                {assetImages[0]}
                                                {assetImages[1]}
                                            </Horizontal>
                                        </Box>
                                    </Button>
                                </Box>
                        
                        </Horizontal>
                    </Box>
                }

                { poolsViews && poolsViews.length > 0 && selectedAsset !== undefined && selectedPool === undefined &&
                    <Box pt={0} pb={2} display="flex" justifyContent="center" >
                        <Horizontal>
                            {poolsViews}
                        </Horizontal>
                    </Box>
                }

                { selectedPool !== undefined &&
                    <Box>
                        <DepositWithdrawView 
                            formType="deposit"
                            chainId={chainId}
                            poolId={selectedPool}
                            token={depositToken}
                            handleSuccess={handleSuccess}
                            handleError={handleError}
                        />
                    </Box>
                }

            </Paper>


        </Box>
    )

}







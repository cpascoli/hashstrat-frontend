import { makeStyles, Box, Link, Typography, Breadcrumbs, Checkbox, FormControl, InputLabel, Select, MenuItem,
     FormControlLabel, FormGroup, Button, Popover, Paper, Divider } from "@material-ui/core"
import { useState } from "react";

import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"
import { Horizontal } from "../Layout"
import { Info } from "@material-ui/icons"

import poolsInfo from "../../config/pools.json"
import indexesInfo from "../../config/indexes.json"
import networksConfig from "../../config/networks.json"

import { usePoolsInfo, useIndexesInfo, PoolData } from "../dashboard/DashboadModel"

import { PoolIds } from "../../utils/pools";
import { PoolSummary } from "../shared/PoolSummary"
import { InvestTokens, PoolInfo } from "../../utils/pools"
import { IndexesIds } from "../../utils/pools";

interface InvestHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        // backgroundColor: theme.palette.type === 'light' ?  theme.palette.grey[100]: theme.palette.grey[900],
    }
}))


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



const isMyPool = (pool: PoolData) : boolean => {

    console.log("isMyPool", pool)

    const noValue = pool.tokenInfoArray.reduce( (acc, val) => {
        if ( val.accountValue !== undefined && !val.accountValue?.isZero() ) {
            console.log("isMyPool ", val.symbol, "=>", val.accountValue?.toString())
        }
     
        return acc && (val.accountValue === undefined || val.accountValue?.isZero())
    }, true)


    return !noValue
}


const filterPools = (chainId: number, poolsInfo: PoolData[], strategy: string | undefined, asset: string | undefined, mypools: boolean) => {
    console.log("filterPools strategy", strategy, "asset", asset)

    const filtered = poolsInfo.filter( pool => { 

        const info = PoolInfo(chainId, pool.poolId)
        const includeStrategy = strategy === undefined || info.strategy === strategy
        const includeAsset = asset === undefined || info.investTokens.join(',') === asset

        const includeMyPools = mypools == false || isMyPool(pool)

        return info.disabled === 'false' && includeStrategy && includeAsset && includeMyPools
    })

    return filtered
}


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


export const InvestHome = ({ chainId, account, depositToken }: InvestHomeProps) => {

    const classes = useStyles()

    const [asset, setAsset] = useState(-1)
    const [strategy, setStrategy] = useState(-1)
    const [mypools, setMypools] = useState(false)

    const strategies = allStrategies(chainId)
    const assets = allAssets(chainId)
    
    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]
    const pools = usePoolsInfo(chainId, PoolIds(chainId), tokens, account)
    const indexes = useIndexesInfo(chainId, IndexesIds(chainId), tokens, account)

    const handleStrategyChange = (event: React.ChangeEvent <{ name?: string | undefined; value: unknown; }>) => {
        setStrategy(Number(event.target.value))
        console.log("handleStrategyChange", event.target.value, "strategy", strategy)
    }
    
    const handleAssetChange = (event: React.ChangeEvent <{ name?: string | undefined; value: unknown; }>) => {
        setAsset(Number(event.target.value))
        console.log("handleAssetChange", event.target.value, "asset", asset)
    }

    const handleMyPoolsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //const [isTrue, setIsTrue] = React.useState(false);

        console.log("handleMyPoolsChange", event.target.checked)
        setMypools(event.target.checked)
    }

    const strategyItems = strategies.map( (item, idx) => {
        const name = strategyNames[item as keyof typeof strategyNames] || item
        return <MenuItem key={idx} value={idx}>{name}</MenuItem>
    })


    const assetItems = assets.map( (item, idx) => {
        const name = assetNames[item as keyof typeof assetNames] || item

        return <MenuItem key={idx} value={idx}>{name}</MenuItem>
    })

    const selectedStrategy = strategy == -1 ? undefined : strategies[strategy]
    const selectedAsset = asset == -1 ? undefined : assets[asset]

    const poolsViews = filterPools(chainId, [...indexes, ...pools], selectedStrategy, selectedAsset, mypools).map( index => { 
        return (
            <div key={index.poolId}>
                <PoolSummary chainId={chainId} poolId={index.poolId} account={account} depositToken={depositToken} tokens={index.tokenInfoArray} />
            </div>
        )
    })


    ///// popover //// 
    const [anchorEl0, setAnchorEl0] = useState<HTMLButtonElement | null>(null);

    const handleClick0 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl0(event.currentTarget);
    };
    
    const handleClose0 = () => {
        setAnchorEl0(null);
    };

    const open0 = Boolean(anchorEl0)
    const id0 = open0 ? 'divs-info-popover-0' : undefined
        

    return (

        <div className={classes.container}>

            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>Invest</Typography>
            </Breadcrumbs>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>

            
            <Box my={4} >
                <Paper>

                    <Box style={{margin: "auto"}} >

                        <Horizontal align="center"  >
                            <Typography variant="body1" align="center" >
                                Select a strategy/asset combination to find a Pool or an Index to deposit into
                                <Button onClick={handleClick0} style={{ height: 40, width: 40 }} ><Info /></Button>
                            </Typography>   

                        
                            <Popover style={{maxWidth: 400}} id={id0} open={open0} anchorEl={anchorEl0} onClose={handleClose0} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} >
                                <Box style={{ width: '250px'}}>
                                    <Paper variant="elevation">
                                            <Typography style={{ padding: 10 }} variant="body2" > 
                                                Pools hold digital assets and use a <Link component={RouterLink} to="/strategies" >strategy</Link> to trade between them.
                                                <br/>
                                                Indexes are baskets of Pools and offer exposure to multiple strategies and assets.
                                                </Typography>
                                    </Paper>
                                </Box>
                            </Popover> 
                        </Horizontal>

                    </Box>

                    <Horizontal  align="center" valign="center"> 
                            <Box p={2}>
                                <Horizontal align="center"  >
                                    <FormControl fullWidth={false} >
                                        <InputLabel id="strategy-select-label">Strategies</InputLabel>
                                        <Select style={{minWidth: 320}}
                                            labelId="strategy-select-label"
                                            id="strategy-select"
                                            value={strategy}
                                            label="Strategies"
                                            onChange={ e => handleStrategyChange(e) }
                                            placeholder="Select strategies"
                                        >
                                            <MenuItem key={-1} value={-1}>All</MenuItem>
                                            {strategyItems}
                                        </Select>
                                    </FormControl>
                                    
                                    <FormControl fullWidth={false}>
                                        <InputLabel id="assets-select-label">Assets</InputLabel>
                                        <Select style={{minWidth: 180}}
                                            labelId="assets-select-label"
                                            id="assets-select"
                                            value={asset}
                                            label="Assets"
                                            onChange={ e => handleAssetChange(e) }
                                            placeholder="Select assets"
                                            
                                        >
                                            <MenuItem key={-1} value={-1}>All</MenuItem>
                                            {assetItems}
                                        </Select>
                                    </FormControl>

                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={mypools} onChange={ e => handleMyPoolsChange(e) }  />} label="My Pools" />
                                    </FormGroup>

                                </Horizontal>
                            </Box>

                    </Horizontal>

                </Paper>

            </Box>

            { poolsViews && poolsViews.length > 0 && 
                <Paper>
                <Box py={3} >
                     
                       <Horizontal align="center"> { poolsViews } </Horizontal>
                    
                </Box>
                </Paper>
            }

        </div>
    )
}



import { makeStyles, Box, Link, Typography, Breadcrumbs, MenuItem, Divider } from "@material-ui/core"
import { useState } from "react";

import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"
import { PoolExplorer } from "./PoolExprorer"


import poolsInfo from "../../config/pools.json"
import indexesInfo from "../../config/indexes.json"
import networksConfig from "../../config/networks.json"

import { PoolData } from "../dashboard/DashboadModel"
import { InvestTokens, PoolInfo } from "../../utils/pools"



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
    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]

    return (
        <div className={classes.container}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>Invest</Typography>
            </Breadcrumbs>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}} />

            <PoolExplorer chainId={chainId} account={account} depositToken={depositToken} />
        </div>
    )
}



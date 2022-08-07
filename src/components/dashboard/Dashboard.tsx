
import { useState, useEffect } from "react"

import { makeStyles, Link, Box, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { useLocation } from "react-router-dom"

import { useTokensInfo } from "../../hooks/usePoolInfo"

import networksConfig from "../../config/networks.json"

import { Link as RouterLink } from "react-router-dom"
import { Token } from "../../types/Token"

import { fromDecimals, round} from "../../utils/formatter"



interface DashboardProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    }
}))


export const Dashboard = ({ chainId, depositToken, investTokens, account} : DashboardProps) => {
    
    // const location = useLocation();
    const classes = useStyles()
  
    const poolsBalances = useTokensInfo(chainId, [depositToken, ...investTokens], account)
    //const indexBalances = useTokensInfo(chainId, [depositToken, ...investTokens], account, true)


    const tokens = [depositToken, ...investTokens] 

    const poolsInfos = tokens.map( token => {
       return {
            symbol: token.symbol,
            balance: fromDecimals( poolsBalances.tokenBalances[token.symbol.toUpperCase()], token.decimals, 6),
            value: fromDecimals( poolsBalances.tokenValues[token.symbol.toUpperCase()], depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
       }
    })

    const poolsTotalFormatted = fromDecimals( poolsBalances.totalPortfolioValue, depositToken.decimals, 2)

    // useEffect(() => {
    //     if (account) {

    //        const balances = useTokensInfo(investTokens, account)
    //        console.log(">>> Dashboard balances: ", balances)
    //     }
    // }, [chainId, account])
    
    

    return (
        <div className={classes.container}>
                Pools balances 

            {
                poolsInfos && poolsInfos.map( token => {
                    return <div key={token.symbol}> {token.symbol} := {token.balance}  value: { token.value } {token.depositTokenSymbol}</div>
                })
            }

            Total Portfolio Value Invested: {poolsTotalFormatted} USDC


        </div>
    )
}





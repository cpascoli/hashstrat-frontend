

import { makeStyles, Box, Typography, Breadcrumbs } from "@material-ui/core"
import { useTokensInfoForPools } from "../../hooks/usePoolInfo"

import { Token } from "../../types/Token"
import { fromDecimals, round} from "../../utils/formatter"
import { BigNumber } from "ethers"
import { PoolSummary } from "./PoolSummary"
import { Horizontal } from "../Layout"

import { TitleValueBox } from "../TitleValueBox"
import { PieChartWithLabels } from "../shared/PieChartWithLabels"


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
    },
    portfolioSummary: {
        maxWidth: 700,
        margin: "auto"
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


export const Dashboard = ({ chainId, depositToken, investTokens, account} : DashboardProps) => {
    
    // const location = useLocation();
    const classes = useStyles()
    const poolsBalances = useTokensInfoForPools(chainId, [depositToken, ...investTokens], account)

    const tokens = [depositToken, ...investTokens] 

    const portfolioInfo = tokens.map( token => {
       return {
            symbol: token.symbol,
            balance: fromDecimals( poolsBalances.tokenBalances[token.symbol.toUpperCase()], token.decimals, 4),
            value: fromDecimals( poolsBalances.tokenValues[token.symbol.toUpperCase()], depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
            decimals: token.decimals
       }
    })

    const chartData = portfolioInfo.map( tokens => {
        return {
            name: tokens.symbol,
            value: Number(tokens.value),
        }
    })


    //  pool info for the pools the account has some tokens (e.g. LP > 0)
    const poolsInfo = Object.values( poolsBalances.pools ).map( pool => {

        const lpBalance = pool.lpBalance ?  BigNumber.from(pool.lpBalance) : undefined
        const lpSupply = pool.lpSupply ? BigNumber.from(pool.lpSupply) : undefined
        
        const percPrecision = BigNumber.from(10000)
        // the % of the value in the pool belonging to the account
        const havePerc = lpSupply && lpBalance && lpSupply.isZero() == false
        const accountPerc = havePerc ? percPrecision.mul(lpBalance).div(lpSupply) : undefined

        // console.log("accountPerc >> ",  pool.poolId, "perc: ", Number( accountPerc?.toString() ) / 10000 , "lpSupply: ", lpSupply?.toString(), "lpBalance", lpBalance?.toString())

        const tokensInfos = pool.tokens.map( (info: any) => {
            const balance =  info.balance ? BigNumber.from(info.balance) : undefined
            const value =  info.tokenValue ? BigNumber.from(info.tokenValue) : undefined

            return {
                balance: balance,
                value: value,
                accountBalance: accountPerc && balance ? balance.mul(accountPerc).div(percPrecision) : undefined,
                accountValue: accountPerc && value ? value.mul(accountPerc).div(percPrecision) : undefined,
                accountPerc: accountPerc && Number(accountPerc.toString() ) / 10000,
                decimals: info.tokenDecimals,
                symbol: info.tokenSymbol,
            }
        })

        return {
            poolId: pool.poolId,
            lpBalance: lpBalance,
            lpSupply: lpSupply,
            tokensInfos
        }

    }).filter( pool => pool.lpBalance && pool.lpBalance.isZero() === false )


    const poolSummaryViews = poolsInfo.map( pool => {
        return <PoolSummary key={pool.poolId} chainId={chainId} poolId={pool.poolId} tokens={pool.tokensInfos} depositToken={depositToken}/>
    })

    const poolsTotalFormatted = fromDecimals( poolsBalances.totalPortfolioValue, depositToken.decimals, 2)
 
    
    return (
        <div className={classes.container}>
         
            <Typography variant="h4" align="center" >
                    Portfolio Summary
            </Typography>
            <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                Your assets across all Pools
            </Typography>

            <div className={classes.portfolioSummary} > 

            <Horizontal align="center">
                <Box className={classes.portfolioInfo} >
                {
                    portfolioInfo && portfolioInfo.map( token => {
                        const valueFormatted = `${token.balance} (${token.value} ${depositToken.symbol})`
                        return  <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted}  mode="small" />
                    })
                }
                    <TitleValueBox title="Total Invested" value={`${poolsTotalFormatted} ${depositToken.symbol}` }  />
                </Box>
                <PieChartWithLabels data={chartData} title="Pie Chart"/>

            </Horizontal>

            </div>

            <Box my={4} >
                <Typography variant="h4" align="center" >
                    Assets Allocation
                </Typography>

                <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                    Your assets allocation in the different Pools
                </Typography>


                <Horizontal align="center" > 
                    { poolSummaryViews }
                </Horizontal>
            </Box>

        </div>
    )
}





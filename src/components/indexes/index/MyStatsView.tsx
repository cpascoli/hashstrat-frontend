import { makeStyles, Box, Accordion, AccordionDetails, AccordionSummary, Typography } from  "@material-ui/core"

import { TitleValueBox } from "../../TitleValueBox"
import { Token } from  "../../../types/Token"
import { useMultiPoolValue, useGetDeposits, useGetWithdrawals } from "../../../hooks/useIndex"
import { useTokenBalance, useTokenTotalSupply } from "../../../hooks/useErc20Tokens"

import { fromDecimals, round } from "../../../utils/formatter"
import { BigNumber } from "ethers"
import { InvestTokens } from "../../../utils/pools"
import { useTokensInfoForIndexes }  from "../../../hooks/usePoolInfo"
import { ExpandMore } from "@material-ui/icons"


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


interface MyStatsViewProps {
    chainId: number,
    poolId: string,
    account: string,
    depositToken: Token
}


export const MyStatsView = ( { chainId, poolId, account, depositToken } : MyStatsViewProps ) => {

    console.log("MyStatsView - index'", poolId, "account", account)

    const multiPoolValue = useMultiPoolValue(chainId, poolId)
    
    const lpBalance = useTokenBalance(chainId, poolId, "pool-lp", account)
    const lpTotalSupply = useTokenTotalSupply(chainId, poolId, "pool-lp")
    
    const lpPerc =  (lpBalance && lpTotalSupply > 0) ? lpBalance * 10000 / lpTotalSupply : 0
    const lpPercFormatted = `${round( lpPerc / 100)}`


    // show non zero asset balances
    const tokens =  [depositToken, ... InvestTokens(chainId)]
    const indexBalances = useTokensInfoForIndexes(chainId, [poolId], tokens)

    const lpBalanceNumber = lpBalance && BigNumber.from(lpTotalSupply)
    const lpTotalSupplyNumber = lpTotalSupply && BigNumber.from(lpTotalSupply)
    const haveBalance = lpBalanceNumber && lpTotalSupplyNumber && !lpTotalSupplyNumber.isZero()

    const assetViews = haveBalance && Object.keys(indexBalances[poolId]).map( symbol => {

        const amount = indexBalances[poolId][symbol].amount.mul(lpBalanceNumber).div(lpTotalSupplyNumber)
        const value = indexBalances[poolId][symbol].value.mul(lpBalanceNumber).div(lpTotalSupplyNumber)
       
        const decimals = tokens.find( t => t.symbol === symbol)?.decimals ?? 2
        const accountBalanceFormatted =  fromDecimals(amount, decimals, 4 ) as any
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any

        const valueFormatted = `${accountBalanceFormatted} (${accountValueFormatted} ${ depositToken.symbol }) `

        return { symbol, valueFormatted, amount, value }
        // return <TitleValueBox key={symbol} title={symbol} value={valueFormatted}  />

    }).filter(it => it.amount && !it.amount.isZero() )
        .map( it => <TitleValueBox key={it.symbol} title={it.symbol} value={it.valueFormatted} /> )

  

    
    const portfolioValue = (lpTotalSupply && lpTotalSupply > 0) ? BigNumber.from(multiPoolValue).mul(lpBalance).div(lpTotalSupply) : undefined
    const deposits = useGetDeposits(chainId, poolId, account)
    const withdrawals = useGetWithdrawals(chainId, poolId, account)
    
    const formattedPortfolioValue = portfolioValue ? fromDecimals(portfolioValue, depositToken.decimals, 2) : "0"
    const formattedDeposits = deposits ? fromDecimals(deposits, depositToken.decimals, 2) : ""
    const formattedWithdrawals = withdrawals ? fromDecimals(withdrawals, depositToken.decimals, 2) : ""
    const roiFormatted = (portfolioValue && deposits && withdrawals && parseFloat(formattedDeposits) > 0) ? String(Math.round( 10000 * (parseFloat(formattedWithdrawals) + parseFloat(formattedPortfolioValue) - parseFloat(formattedDeposits)) / parseFloat(formattedDeposits)) / 100 ) : "0"

    const classes = useStyle()

    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >

                { assetViews }

                <div style={{marginBottom: 20}} />

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                        <Typography > My Index Info </Typography>
                    </AccordionSummary>
                    <AccordionDetails >
                        <Box>
                            <TitleValueBox mode="small" title="My Portfolio Value" value={formattedPortfolioValue} suffix={depositToken.symbol} />
                            <TitleValueBox mode="small" title="My Index share" value={lpPercFormatted} suffix="%" />
                            <TitleValueBox mode="small" title="My Deposits" value={formattedDeposits} suffix={depositToken.symbol} />
                            <TitleValueBox mode="small" title="My Withdrawals" value={formattedWithdrawals} suffix={depositToken.symbol} />
                            <TitleValueBox mode="small" title="ROI" value={roiFormatted} suffix="%" />
                        </Box>
                    </AccordionDetails>
                </Accordion>
              
            </Box>
        </Box>
    )
}


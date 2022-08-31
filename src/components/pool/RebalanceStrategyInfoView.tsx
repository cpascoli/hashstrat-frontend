import { Box, makeStyles, Typography } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from "../../types/Token"
import { fromDecimals, round} from "../../utils/formatter"
import { PoolAddress } from "../../utils/network"
import { BigNumber } from 'ethers'


import { 
    useFeedDecimals,
    useFeedLatestPrice,
    useFeedLatestTimestamp,
    useTokenBalance,
} from "../../hooks"

import { 
    useStrategyName, 
    useStrategyDescription,
    useStrategyTargetInvestPerc, 
    useStrategyRebalancingThreshold,
} from "../../hooks/useRebalancingStrategy"

import { 
    useInvestedTokenValue,
    useTotalPortfolioValue,
} from "../../hooks/usePool"

const useStyle = makeStyles( theme => ({
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


interface StrategyInfoViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}



export const RebalanceStrategyInfoView = ( { chainId, poolId, depositToken, investToken } : StrategyInfoViewProps ) => {
    
    const poolAddress = PoolAddress(chainId, poolId)

    const name = useStrategyName(chainId, poolId)
    const description = useStrategyDescription(chainId, poolId)
    const targetInvestPerc = useStrategyTargetInvestPerc(chainId, poolId)
    const rebalancingThreshold = useStrategyRebalancingThreshold(chainId, poolId)
    const latestFeedPrice = useFeedLatestPrice(chainId, poolId)
    const feedDecimals = useFeedDecimals(chainId, poolId)
    const feedLatestTimestamp = useFeedLatestTimestamp(chainId, poolId)

    const depositTokenBalance = useTokenBalance(chainId, poolId, depositToken.symbol, poolAddress)
    const investTokenBalance = useTokenBalance(chainId, poolId, investToken.symbol, poolAddress)



    const targetAllocationPerc =  targetInvestPerc && `${targetInvestPerc}% / ${(100 - targetInvestPerc )}%`
    const targetPercUp =  (parseInt(targetInvestPerc) + parseInt(rebalancingThreshold) ) / 100
    const targetPercDown =  (parseInt(targetInvestPerc) - parseInt(rebalancingThreshold) ) / 100


    const depositTokens = depositTokenBalance ? parseFloat(fromDecimals( BigNumber.from(depositTokenBalance), depositToken.decimals, 2)) : undefined
    const investTokens = investTokenBalance ? parseFloat(fromDecimals( BigNumber.from(investTokenBalance), investToken.decimals, 6)) : undefined

    const rebalancingUpperBandPrice = (depositTokens && investTokens) ? round( targetPercUp  * depositTokens / (investTokens - targetPercUp  * investTokens)) : undefined
    const rebalancingLowerBandPrice = (depositTokens && investTokens) ? round( targetPercDown  * depositTokens / (investTokens - targetPercDown  * investTokens)) : undefined
    const rebalancingText = (rebalancingUpperBandPrice && rebalancingLowerBandPrice) ? `${investToken.symbol} ≤ ${rebalancingLowerBandPrice} ; ${investToken.symbol} ≥ ${rebalancingUpperBandPrice} ` : ''

    const formattedPriceTimestant = new Date(feedLatestTimestamp * 1000).toLocaleTimeString()

    const formattedPrice = latestFeedPrice ? fromDecimals( BigNumber.from(latestFeedPrice), parseInt(feedDecimals), 2) : ''
    const feedPriceText = `${formattedPrice} ${depositToken.symbol} at ${formattedPriceTimestant}`

    const investedTokenValue = useInvestedTokenValue(chainId, poolId)
    const totalPortfolioValue = useTotalPortfolioValue(chainId, poolId)

    const investedTokenValueFloat = investedTokenValue ? parseFloat(fromDecimals( BigNumber.from(investedTokenValue), depositToken.decimals, 2)) : undefined
    const totalPortfolioValueFloat = totalPortfolioValue ? parseFloat(fromDecimals( BigNumber.from(totalPortfolioValue), depositToken.decimals, 2)) : undefined

    const riskAssetdWeight = investedTokenValueFloat && totalPortfolioValueFloat && round( 100 * investedTokenValueFloat / totalPortfolioValueFloat, 1)
    const stableAssetWeight = riskAssetdWeight && ( 100 - riskAssetdWeight)
    const currentAllocationPerc = `${riskAssetdWeight}% / ${stableAssetWeight}%`

    const classes = useStyle()

    return (
        <Box>
            <Box className={classes.portfolioInfo} >
                <Box mb={2}>
                    <Typography variant="h6" align="center"> {name}</Typography> 
                    <Typography variant="body2" align="center"> {description}</Typography> 
                </Box>

                <TitleValueBox title="Current Allocation" value={currentAllocationPerc} mode="small" />
                <TitleValueBox title="Target Allocation" value={targetAllocationPerc} mode="small" />
                <TitleValueBox title="Rebalancing Band" value={`± ${rebalancingThreshold}%`} mode="small" />
                <TitleValueBox title="Rebalancing Targets" value={rebalancingText} mode="small"  />
                <TitleValueBox title={`${investToken.symbol} price`} value={feedPriceText} mode="small" />
            </Box>

        </Box>
    )
}

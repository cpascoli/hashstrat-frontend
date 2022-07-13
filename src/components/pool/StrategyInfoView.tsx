import { Box, makeStyles, Typography } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from "../../types/Token"
import { fromDecimals, round} from "../../utils/formatter"
import { NetworkExplorerHost, PoolAddress } from "../../utils/network"
import { BigNumber } from 'ethers'


import { 
    useStrategyName, 
    useStrategyDescription,
    useStrategyDepositTokenAddress, 
    useStrategyInvestTokenAddress, 
    useStrategyFeedAddress, 
    useStrategyTargetInvestPerc, 
    useStrategyRebalancingThreshold,
    useFeedDecimals,
    useFeedLatestPrice,
    useFeedLatestTimestamp,
    useTokenBalance,
    
} from "../../hooks"


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


interface StrategyInfoViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}



export const StrategyInfoView = ( { chainId, poolId, depositToken, investToken } : StrategyInfoViewProps ) => {

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

    const investPercText =  targetInvestPerc && <span> {targetInvestPerc} %  / {(100 - targetInvestPerc )}%  </span>
    const targetPercUp =  (parseInt(targetInvestPerc) + parseInt(rebalancingThreshold) ) / 100
    const targetPercDown =  (parseInt(targetInvestPerc) - parseInt(rebalancingThreshold) ) / 100


    const depositTokens = depositTokenBalance ? parseFloat(fromDecimals( BigNumber.from(depositTokenBalance), depositToken.decimals, 2)) : undefined
    const investTokens = investTokenBalance ? parseFloat(fromDecimals( BigNumber.from(investTokenBalance), investToken.decimals, 6)) : undefined

    const rebalancingUpperBandPrice = (depositTokens && investTokens) ? round( targetPercUp  * depositTokens / (investTokens - targetPercUp  * investTokens)) : undefined
    const rebalancingLowerBandPrice = (depositTokens && investTokens) ? round( targetPercDown  * depositTokens / (investTokens - targetPercDown  * investTokens)) : undefined
    const rebalancingText = (rebalancingUpperBandPrice && rebalancingLowerBandPrice) ? `${investToken.symbol} ≤ ${rebalancingLowerBandPrice} or ${investToken.symbol} ≥ ${rebalancingUpperBandPrice} ` : ''

    console.log("rebalancingUpperBandPrice : ", investTokenBalance, depositTokenBalance, targetPercUp, targetPercDown)

    const formattedPriceTimestant = new Date(feedLatestTimestamp * 1000).toLocaleTimeString()
    const formattedPrice = latestFeedPrice ? fromDecimals( BigNumber.from(latestFeedPrice), parseInt(feedDecimals), 2) : ''
    const feedPriceText = `${formattedPrice} ${depositToken.symbol} at ${formattedPriceTimestant}`

    const classes = useStyle()

    return (
        <Box className={classes.container}>
            <Typography align="center" >
                Strategy Info
            </Typography>

            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="Name" value={name} mode="small" />
                <TitleValueBox title="Description" value={description} mode="small" />
                <TitleValueBox title="Target Pool Allocation" value={investPercText} mode="small"  />
                <TitleValueBox title="Rebalancing Band" value={`± ${rebalancingThreshold}%`} mode="small"  />
                <TitleValueBox title="Rebalancing Prices" value={rebalancingText} mode="small"  />
                <TitleValueBox title={`${investToken.symbol} price`} value={feedPriceText} mode="small"  />
            </Box>

        </Box>
    )
}

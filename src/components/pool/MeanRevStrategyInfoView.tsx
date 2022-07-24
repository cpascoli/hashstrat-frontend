import { Box, makeStyles, Typography } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from "../../types/Token"
import { fromDecimals, round} from "../../utils/formatter"
import { NetworkExplorerHost, PoolAddress } from "../../utils/network"
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
    useStrategyMovingAverage,
    useStrategyMovingAveragePeriod,
    useStrategyTargetPricePercUp,
    useStrategyTargetPricePercDown,
    useStrategyTokensToSwapPerc,
    useStrategyMinAllocationPerc

} from "../../hooks/useMeanRevStrategy"


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



export const MeanRevStrategyInfoView = ( { chainId, poolId, depositToken, investToken } : StrategyInfoViewProps ) => {

    const poolAddress = PoolAddress(chainId, poolId)

    const name = useStrategyName(chainId, poolId)
    const description = useStrategyDescription(chainId, poolId)
    const latestFeedPrice = useFeedLatestPrice(chainId, poolId)
    const feedDecimals = useFeedDecimals(chainId, poolId)
    const feedLatestTimestamp = useFeedLatestTimestamp(chainId, poolId)

    const movingAverage = useStrategyMovingAverage(chainId, poolId)
    const movingAveragePeriod = useStrategyMovingAveragePeriod(chainId, poolId)
    const tokensToSwapPerc = useStrategyTokensToSwapPerc(chainId, poolId)


    const formattedPriceTimestant = new Date(feedLatestTimestamp * 1000).toLocaleTimeString()
    const formattedPrice = latestFeedPrice ? fromDecimals( BigNumber.from(latestFeedPrice), parseInt(feedDecimals), 2) : ''
    const feedPriceText = `${formattedPrice} ${depositToken.symbol} at ${formattedPriceTimestant}`

    // moving average
    const formattedMovingAverage = movingAverage ? fromDecimals( BigNumber.from(movingAverage), parseInt(feedDecimals), 2) : ''
    const movingAverageText = `${formattedMovingAverage} ${depositToken.symbol}`

    // strategy parameters
    const deltaPricePerc = round((latestFeedPrice - movingAverage) / movingAverage, 4)
    const targetPricePercUp = useStrategyTargetPricePercUp(chainId, poolId)
    const targetPricePercDown = useStrategyTargetPricePercDown(chainId, poolId)
    const minAllocationPerc = useStrategyMinAllocationPerc(chainId, poolId)


    const depositTokenBalance = useTokenBalance(chainId, poolId, depositToken.symbol, poolAddress)
    const investTokenBalance = useTokenBalance(chainId, poolId, investToken.symbol, poolAddress)

    const targetPriceUp =  parseInt(formattedMovingAverage) *  (1 +  parseInt(targetPricePercUp) / 100)
    const targetPriceDown =  parseInt(formattedMovingAverage) *  (1 - parseInt(targetPricePercDown) / 100)
    
    const depositTokens = depositTokenBalance ? parseFloat(fromDecimals( BigNumber.from(depositTokenBalance), depositToken.decimals, 2)) : undefined
    const investTokens = investTokenBalance ? parseFloat(fromDecimals( BigNumber.from(investTokenBalance), investToken.decimals, 6)) : undefined

    const downTradeTargetText = (targetPriceDown) ? `Buy ${investToken.symbol} when ≤ ${targetPriceDown}` : ''

    const upTradeTargetText = (targetPriceUp) ? `Sell  ${investToken.symbol} when ≥ ${targetPriceUp} ` : ''

    const classes = useStyle()

    return (
        <Box className={classes.container}>
            <Typography align="center" style={{textTransform: "uppercase"}} >
                Strategy Info
            </Typography>

            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="Name" value={name} mode="small" />
                <TitleValueBox title="Description" value={description} mode="small" />
                <TitleValueBox title={`${investToken.symbol} price`} value={feedPriceText} mode="small"  />
                <TitleValueBox title={`Trend (${movingAveragePeriod}D MA)`} value={movingAverageText} mode="small"  />
                <TitleValueBox title="Deviation From Trend" value={`${round(deltaPricePerc * 100)}`} mode="small"  suffix="%" />
                <TitleValueBox title="Upper Target Price %" value={`${targetPricePercUp}`} mode="small"  suffix="%" />
                <TitleValueBox title="Lower Target Price %" value={`- ${targetPricePercDown}`} mode="small"  suffix="%" />
                <TitleValueBox title="Trade Size" value={`${tokensToSwapPerc}`} mode="small"  suffix="%" />
                <TitleValueBox title="Min allocation" value={`${minAllocationPerc}`} mode="small"  suffix="%" />
                
                <TitleValueBox title="De-risking Target" value={`${upTradeTargetText}`} mode="small"  />
                <TitleValueBox title="Accumulation Target" value={`${downTradeTargetText}`} mode="small"  />
            </Box>

        </Box>
    )
}

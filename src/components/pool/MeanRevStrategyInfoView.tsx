import { Box, makeStyles, Typography } from "@material-ui/core"
import { TitleValueBox } from "../TitleValueBox"
import { Token } from "../../types/Token"
import { fromDecimals, round} from "../../utils/formatter"
import { NetworkExplorerHost, PoolAddress } from "../../utils/network"
import { BigNumber } from 'ethers'


import { 
    useStrategyName, 
    useStrategyDescription,
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



export const MeanRevStrategyInfoView = ( { chainId, poolId, depositToken, investToken } : StrategyInfoViewProps ) => {

    const poolAddress = PoolAddress(chainId, poolId)

    const name = useStrategyName(chainId, poolId)
    const description = useStrategyDescription(chainId, poolId)
    const latestFeedPrice = useFeedLatestPrice(chainId, poolId)
    const feedDecimals = useFeedDecimals(chainId, poolId)
    const feedLatestTimestamp = useFeedLatestTimestamp(chainId, poolId)

    const formattedPriceTimestant = new Date(feedLatestTimestamp * 1000).toLocaleTimeString()
    const formattedPrice = latestFeedPrice ? fromDecimals( BigNumber.from(latestFeedPrice), parseInt(feedDecimals), 2) : ''
    const feedPriceText = `${formattedPrice} ${depositToken.symbol} at ${formattedPriceTimestant}`

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
            </Box>

        </Box>
    )
}

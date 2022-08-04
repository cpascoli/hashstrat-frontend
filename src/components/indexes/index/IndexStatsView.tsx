import { Box, Typography, makeStyles } from "@material-ui/core"
import { TitleValueBox } from "../../TitleValueBox"
import { Token } from "../../../types/Token"
import { fromDecimals } from "../../../utils/formatter"

import { IndexInfo } from "../../../utils/pools"

import { useTotalDeposited, useTotalWithdrawn, useMultiPoolValue } from "../../../hooks/useIndex"


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


interface IndexStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
}



export const IndexStatsView = ( { chainId, poolId, depositToken } : IndexStatsViewProps ) => {

    const { name, description, investTokens } = IndexInfo(chainId, poolId)

    const multiPoolValue = useMultiPoolValue(chainId, poolId)
    const totalDeposited = useTotalDeposited(chainId, poolId)
    const totalWithdrawn = useTotalWithdrawn(chainId, poolId)

    const formattedMultiPoolValue =  (multiPoolValue) ? fromDecimals(multiPoolValue, depositToken.decimals, 2) : ""
    const formattedDeposited =  (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn =  (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""
 
    const classes = useStyle()

    return (
        <Box className={classes.container}>
            <Box className={classes.portfolioInfo} >
                <TitleValueBox title="Name" value={name} />
                <TitleValueBox title="Description" value={description} />
                <TitleValueBox title="Risk Assets" value={ investTokens.join(',') } />
               
                <TitleValueBox title="Total Value" value={formattedMultiPoolValue} suffix={depositToken.symbol} />
                <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>

            </Box>


        </Box>
    )
}

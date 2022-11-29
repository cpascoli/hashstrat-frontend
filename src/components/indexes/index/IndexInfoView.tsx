import { Box, makeStyles, Typography } from "@material-ui/core"
import { Token } from "../../../types/Token"
import { IndexRoiChart } from "../../pool/RoiChart"



interface IndexInfoViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,

}


export const IndexInfoView = ( { chainId, poolId, depositToken } : IndexInfoViewProps ) => {
  
    return (
        <Box  >

            INDEX PERFORMANCE

            <IndexRoiChart chainId={chainId} indexId={poolId} depositToken={depositToken}  />

        </Box>
    )
}

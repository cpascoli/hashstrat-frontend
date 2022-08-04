import { Box, Divider, makeStyles, Typography, Link } from "@material-ui/core"
import { IndexSummaryView } from "./IndexSummaryView"
import { Horizontal } from "../Layout"
import networksConfig from "../../config/networks.json"
import { IndexInfo } from "../../types/IndexInfo"
import indexesInfo from "../../config/indexes.json"
import { Token } from "../../types/Token"

interface IndexesViewProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))


export const IndexesView = ({ chainId, account, depositToken } : IndexesViewProps) => {

    const classes = useStyles()
    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const indexes : Array<IndexInfo> = indexesInfo[networkName as keyof typeof indexesInfo]

    const indexexView = indexes.map( index => {
        return (
            <div key={index.poolId}>
                <IndexSummaryView chainId={chainId} poolId={index.poolId} account={account} depositToken={depositToken} />
            </div>
        )
    })


    return (
        <Box mt={2}>
 
            <Divider variant="middle"  style={{marginTop: 20, marginBottom: 0}}/>
            <div className={classes.container}> 
                <Typography >
                    HashStrat Indexes allow to invest on a basket of HashSttap Pools and their assocaited strategies. <br/>
                    When users deposit funds into an Index, these funds get allocated to the corresponding pools proportionally to the pools' weights within the Index. <br/>
                    Indexes allow to easily invest into a combination of strategies and assets held withing multiple pools for smoother risk/return profiles.
                </Typography>
            </div>

            <Horizontal align="center"> 
                  { indexexView }
            </Horizontal>
        </Box>
    )
}



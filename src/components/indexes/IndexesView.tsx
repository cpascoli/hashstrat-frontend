import { Box, Divider, makeStyles, Typography, Link } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import { IndexSummaryView } from "./IndexSummaryView"
import { Horizontal } from "../Layout"
import networksConfig from "../../config/networks.json"
import { PoolInfo } from "../../types/PoolInfo"
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
    const indexes : Array<PoolInfo> = indexesInfo[networkName as keyof typeof indexesInfo] as any

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
                    HashStrat Indexes represent a weighted basket of <Link component={RouterLink} to="/pools" style={{ textDecoration: 'none' }} >HashSttap Pools </Link> and 
                    their assocaited <Link component={RouterLink} to="/strategies" >Strategies</Link>. <br/>
                    Indexes allow to easily invest into a combination of strategies and assets for improved risk/return profiles.
                </Typography>
            </div>

            <Horizontal align="center"> 
                  { indexexView }
            </Horizontal>
        </Box>
    )
}



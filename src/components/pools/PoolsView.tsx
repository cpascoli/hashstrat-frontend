import { makeStyles } from "@material-ui/core"
import { PoolSummaryView } from "./PoolSummaryView"

import helperConfig from "../../helper-config.json"
import { PoolInfo } from "../../types/PoolInfo"
import poolsInfo from "../../chain-info/pools.json"
import { Token } from "../../types/Token"


interface PoolsViewProps {
    chainId: number,
    account: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        flexFlow: "row wrap",
        columnGap: "1rem",
        rowGap: "1rem",
    }
}))


export const PoolsView = ({ chainId, account, depositToken } : PoolsViewProps) => {
    const classes = useStyles()
    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]
    const pools : Array<PoolInfo> = poolsInfo[networkName as keyof typeof poolsInfo]

    const poolsView = pools.map( pool => {
        return (
            <div key={pool.poolId}>
                <PoolSummaryView chainId={chainId} poolId={pool.poolId} account={account} depositToken={depositToken} />
            </div>
        )
    })


    return (
        <div className={classes.container}>
            { poolsView }
        </div>
    )
}



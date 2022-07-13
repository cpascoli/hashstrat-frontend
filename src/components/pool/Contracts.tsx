


import { makeStyles, Link } from  "@material-ui/core"
import { NetworkExplorerHost, PoolAddress, PoolLPTokenAddress, StrategyAddress } from "../../utils/network"


const useStyle = makeStyles( theme => ({
    contracts: {
        padding: theme.spacing(1),
        display: "flex",
        gap: theme.spacing(2),
    },
}))


export interface ContractsProps {
    chainId: number,
    poolId: string
}


export const Contracts = ( { chainId, poolId } : ContractsProps ) => {

    const classes = useStyle()

    const explorerHost = NetworkExplorerHost(chainId) ?? "polygonscan.com"
    const poolAddress = PoolAddress(chainId, poolId)
    const strategyAddress = StrategyAddress(chainId, poolId)
    const lpTokenAddress = PoolLPTokenAddress(chainId, poolId)

    const poolLink = `https://${explorerHost}/address/${poolAddress}#code` 
    const strategyLink = `https://${explorerHost}/address/${strategyAddress}#code` 
    const lpTokenLink = `https://${explorerHost}/address/${lpTokenAddress}#code` 

    console.log("Contracts - poolLink", poolLink)

    return (
        <div>
            <div className={classes.contracts}>
                <Link href={poolLink} target="_blank">Pool</Link>
                <Link href={strategyLink} target="_blank">Rebalancing Strategy</Link>
                <Link href={lpTokenLink} target="_blank">LP Token</Link>
            </div>
        </div>
    )
}
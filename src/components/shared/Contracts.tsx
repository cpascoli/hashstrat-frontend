


import { makeStyles, Link, Typography } from  "@material-ui/core"
import { NetworkExplorerHost, PoolAddress, PoolLPTokenAddress, 
     StrategyAddress, FeedAddress, HstTokenAddress, FarmAddress, GovernanceAddress } from "../../utils/network"
import { Horizontal } from "../Layout"

const useStyle = makeStyles( theme => ({
    contracts: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10

    },
}))


export interface ContractsProps {
    chainId: number,
    poolId?: string,
}


export const Contracts = ( { chainId, poolId } : ContractsProps ) => {

    const classes = useStyle()

    const explorerHost = NetworkExplorerHost(chainId) ?? "polygonscan.com"
    const hstAddress = HstTokenAddress(chainId)
    const farmAddress = FarmAddress(chainId)
    const governanceAddress = GovernanceAddress(chainId)

    const poolAddress = poolId && PoolAddress(chainId, poolId)
    const lpTokenAddress = poolId && PoolLPTokenAddress(chainId, poolId)
    const isIndex = poolId && poolId.startsWith("index")
    const strategyAddress = poolId && !isIndex && StrategyAddress(chainId, poolId)
    const feedAddress = poolId && !isIndex && FeedAddress(chainId, poolId)

    

    return (

        <div className={classes.contracts}>
            <Horizontal>
                <Typography variant="body2">Contracts:</Typography>

                <Link href={`https://${explorerHost}/address/${hstAddress}` } target="_blank">HST Token</Link>
                <Link href={`https://${explorerHost}/address/${farmAddress}` } target="_blank">HST Farm</Link>
                <Link href={`https://${explorerHost}/address/${governanceAddress}` } target="_blank">Governance</Link>

                { poolAddress && <Link href={`https://${explorerHost}/address/${poolAddress}` } target="_blank">Pool</Link> }
                { lpTokenAddress && <Link href={`https://${explorerHost}/address/${lpTokenAddress}` } target="_blank">LP Token</Link> }

                { strategyAddress && <Link href={`https://${explorerHost}/address/${strategyAddress}` } target="_blank">Strategy</Link> }
                { feedAddress && <Link href={`https://${explorerHost}/address/${feedAddress}` } target="_blank">Price feed</Link> }

                {/* <Link href={`https://${explorerHost}/address/${depositToken?.address}#code` } target="_blank">{depositToken?.symbol}</Link>
                <Link href={`https://${explorerHost}/address/${investToken?.address}#code` } target="_blank">{investToken?.symbol}</Link> */}
            </Horizontal>
        </div>

    )
}
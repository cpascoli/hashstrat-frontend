


import { makeStyles, Link, Typography } from  "@material-ui/core"
import { NetworkExplorerHost, PoolAddress, PoolLPTokenAddress,  StrategyAddress, FeedAddress } from "../../utils/network"
import { Horizontal } from "../Layout"

import { PoolInfo, Tokens} from "../../utils/pools"


const useStyle = makeStyles( theme => ({
    contracts: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10

    },
}))


export interface ContractsProps {
    chainId: number,
    poolId: string,
}


export const Contracts = ( { chainId, poolId } : ContractsProps ) => {

    const classes = useStyle()

    const explorerHost = NetworkExplorerHost(chainId) ?? "polygonscan.com"

    const poolAddress = PoolAddress(chainId, poolId)
    const lpTokenAddress = PoolLPTokenAddress(chainId, poolId)
    
    const isIndex = poolId.startsWith("index")
    const strategyAddress = !isIndex && StrategyAddress(chainId, poolId)
    const feedAddress = !isIndex && FeedAddress(chainId, poolId)


    return (

        <div className={classes.contracts}>
            <Horizontal>
                <Typography variant="body2">Contracts:</Typography>
                <Link href={`https://${explorerHost}/address/${poolAddress}#code` } target="_blank">Pool</Link>
                <Link href={`https://${explorerHost}/address/${lpTokenAddress}#code` } target="_blank">LP Token</Link>

                { strategyAddress && <Link href={`https://${explorerHost}/address/${strategyAddress}#code` } target="_blank">Strategy</Link> }
                { feedAddress && <Link href={`https://${explorerHost}/address/${feedAddress}#code` } target="_blank">Price feed</Link> }

                {/* <Link href={`https://${explorerHost}/address/${depositToken?.address}#code` } target="_blank">{depositToken?.symbol}</Link>
                <Link href={`https://${explorerHost}/address/${investToken?.address}#code` } target="_blank">{investToken?.symbol}</Link> */}
            </Horizontal>
        </div>

    )
}
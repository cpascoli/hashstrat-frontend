


import { makeStyles, Link, Typography } from  "@material-ui/core"
import { NetworkExplorerHost, PoolAddress, PoolLPTokenAddress,  StrategyAddress, FeedAddress, 
    UsdcTokenAddress, DaiTokenAddress, WethTokenAddress, WbtcTokenAddress
} from "../../utils/network"
import { Horizontal } from "../Layout"


const useStyle = makeStyles( theme => ({
    contracts: {
        marginTop: 20
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
    const feedAddress = FeedAddress(chainId, poolId)
  
    const depositToken = (chainId == 42) ?  { address: DaiTokenAddress(chainId), symbol: "DAI"} : 
                         (chainId == 137) ? { address: UsdcTokenAddress(chainId), symbol: "USDC"} : undefined

    const investToken1 = { address: WbtcTokenAddress(chainId), symbol: "WBTC"}
    const investToken2 =  { address: WethTokenAddress(chainId), symbol: "WETH"}
    const investToken = (poolId === 'pool01') ? investToken1 :
                         (poolId === 'pool02') ? investToken2 : undefined


    return (

        <div className={classes.contracts}>
            <Horizontal>
                <Typography variant="body2">Contracts:</Typography>
                <Link href={`https://${explorerHost}/address/${poolAddress}#code` } target="_blank">Pool</Link>
                <Link href={`https://${explorerHost}/address/${strategyAddress}#code` } target="_blank">Strategy</Link>
                <Link href={`https://${explorerHost}/address/${lpTokenAddress}#code` } target="_blank">LP Token</Link>
                <Link href={`https://${explorerHost}/address/${feedAddress}#code` } target="_blank">Datafeed</Link>

                <Link href={`https://${explorerHost}/address/${depositToken?.address}#code` } target="_blank">{depositToken?.symbol}</Link>
                <Link href={`https://${explorerHost}/address/${investToken?.address}#code` } target="_blank">{investToken?.symbol}</Link>
            </Horizontal>
        </div>

    )
}
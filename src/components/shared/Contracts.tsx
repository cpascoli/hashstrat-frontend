


import { makeStyles, Link, Typography, Box } from  "@material-ui/core"
import { NetworkExplorerHost, PoolAddress, PoolLPTokenAddress, 
     StrategyAddress, FeedAddress, HstTokenAddress, FarmAddress, GovernanceAddress } from "../../utils/network"
import { Horizontal } from "../Layout"

const useStyle = makeStyles( theme => ({
    root: {
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
    },
    gridList: {
        minWidth: 700,
        transform: 'translateZ(0)',
      }
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
        <Box mt={1} px={1}>
            <div className={classes.root}>
                    <div className={classes.gridList}>
                    <Typography variant="body2" style={{paddingBottom:5}}>Contracts</Typography>
                    <Horizontal>

                        {/* { !poolId &&  <Link href={`https://${explorerHost}/address/${depositToken?.address}#code` } target="_blank">{depositToken?.symbol}</Link> }
                        { !poolId &&  <Link href={`https://${explorerHost}/address/${investToken?.address}#code` } target="_blank">{investToken?.symbol}</Link> } */}

                        { poolAddress && <Link href={`https://${explorerHost}/address/${poolAddress}` } target="_blank">Pool</Link> }
                        { lpTokenAddress && <Link href={`https://${explorerHost}/address/${lpTokenAddress}` } target="_blank">LP Token</Link> }
                        { strategyAddress && <Link href={`https://${explorerHost}/address/${strategyAddress}` } target="_blank">Strategy</Link> }
                        { feedAddress && <Link href={`https://${explorerHost}/address/${feedAddress}` } target="_blank">Price feed</Link> }

                        <Link href={`https://${explorerHost}/address/${hstAddress}` } target="_blank">HST Token</Link>
                        <Link href={`https://${explorerHost}/address/${farmAddress}` } target="_blank">HST Farm</Link>
                        <Link href={`https://${explorerHost}/address/${governanceAddress}` } target="_blank">Governance</Link>

                    </Horizontal>
                </div>
            </div>
        </Box>




    )
}
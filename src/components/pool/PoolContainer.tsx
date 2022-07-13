
import { makeStyles, Link, Box, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { useLocation } from "react-router-dom"

import { PoolTabs } from "./PoolTabs"
import { Token } from "../../types/Token"

import helperConfig from "../../helper-config.json"
import poolsInfo from "../../chain-info/pools.json"
import { Contracts } from "./Contracts"

interface PoolContainerProps {
    poolId: string,
    chainId: number,
    account: string,
    tokens: Array<Token>,
    investToken: Token,
}


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))


export const PoolContainer = ({ chainId, poolId, account, tokens, investToken } : PoolContainerProps) => {
    
    const location = useLocation();
    console.log("pathname: ", location.pathname);
    const classes = useStyles()


    const networkName = helperConfig[chainId.toString() as keyof typeof helperConfig]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]

    const infos = pools.filter( pool =>  { return (pool.poolId === poolId) })
    const { name, description } = infos[0]
 

    return (
        <div className={classes.container}>
            
            <Breadcrumbs aria-label="breadcrumb">
                <Link href="/">Home</Link>
                <Link href={'/pools/'}>Pools</Link>
                <Typography>{name}</Typography>
            </Breadcrumbs>

            <PoolTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investToken={investToken} />

            <Contracts chainId={chainId} poolId={poolId}/>


        </div>
    )
}





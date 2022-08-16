
import { makeStyles, Link, Box, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { useLocation } from "react-router-dom"

import { PoolTabs } from "./PoolTabs"
import { Token } from "../../types/Token"

import { PoolInfo } from "../../utils/pools"
import { Contracts } from "../shared/Contracts"

import { Link as RouterLink } from "react-router-dom"


interface PoolContainerProps {
    poolId: string,
    chainId: number,
    account?: string,
    tokens: Token[],
    investToken: Token,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: theme.spacing(2),
        // paddingBottom: theme.spacing(2),
       
    }
}))


export const PoolContainer = ({ chainId, poolId, account, tokens, investToken } : PoolContainerProps) => {
    
    const location = useLocation();
    console.log("pathname: ", location.pathname);
    const classes = useStyles()

    const { name } = PoolInfo(chainId, poolId)

    return (
        <div className={classes.container}>
            <Breadcrumbs aria-label="breadcrumb" style={{paddingLeft: 10, paddingRight: 10}}>
                <Link component={RouterLink} to="/home"> Home </Link>
                <Link component={RouterLink} to="/pools"> Pools </Link>
                <Typography>{name}</Typography>
            </Breadcrumbs>

            <PoolTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investToken={investToken} />
            <Contracts chainId={chainId} poolId={poolId} />
        </div>
    )
}





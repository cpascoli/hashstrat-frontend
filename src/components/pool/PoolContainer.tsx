
import { Link, Box, Typography, Breadcrumbs } from "@material-ui/core"

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



export const PoolContainer = ({ chainId, poolId, account, tokens, investToken } : PoolContainerProps) => {
    
    const { name } = PoolInfo(chainId, poolId)

    return (
        <Box px={2} >
            <Breadcrumbs aria-label="breadcrumb" >
                <Link component={RouterLink} to="/home"> Home </Link>
                <Link component={RouterLink} to="/pools"> Pools </Link>
                <Typography>{name}</Typography>
            </Breadcrumbs>

            <PoolTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investToken={investToken} />
            <Contracts chainId={chainId} poolId={poolId} />
        </Box>
    )
}





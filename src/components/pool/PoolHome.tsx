
import { Link, Box, Typography, Breadcrumbs, Divider } from "@material-ui/core"

import { PoolTabs } from "./PoolTabs"
import { Token } from "../../types/Token"

import { PoolInfo } from "../../utils/pools"
import { Contracts } from "../shared/Contracts"

import { Link as RouterLink } from "react-router-dom"


interface PoolHomeProps {
    poolId: string,
    chainId: number,
    account?: string,
    tokens: Token[],
    investToken: Token,
}



export const PoolHome = ({ chainId, poolId, account, tokens, investToken } : PoolHomeProps) => {
    
    const { name, description } = PoolInfo(chainId, poolId)

    return (
        <Box px={0} pt={2}>
            <Breadcrumbs aria-label="breadcrumb" style={{paddingLeft: 10, paddingRight: 10}} >
                <Link component={RouterLink} to="/home"> Home </Link>
                <Link component={RouterLink} to="/invest"> Invest </Link>
                <Typography>{name}</Typography>
            </Breadcrumbs>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>

            <Box mt={2}>
                <Typography align="center">{description}</Typography>
            </Box>

            <PoolTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investToken={investToken} />
            <Contracts chainId={chainId} poolId={poolId} />
        </Box>
    )
}






import { makeStyles, Link, Box, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { useLocation } from "react-router-dom"

import { PoolInfo } from "../../../utils/pools"

import { IndexTabs } from "./IndexTabs"
import { Token } from "../../../types/Token"

import { Contracts } from "../../shared/Contracts"

import { Link as RouterLink } from "react-router-dom"


interface IndexHomeProps {
    poolId: string,
    chainId: number,
    account?: string,
    tokens: Token[],
    investTokens: Token[],
}


export const IndexHome = ({ chainId, poolId, account, tokens, investTokens } : IndexHomeProps) => {
    
    const { name, description } = PoolInfo(chainId, poolId)

    return (
        <Box px={2}>
            <Breadcrumbs aria-label="breadcrumb" style={{paddingLeft: 10, paddingRight: 10}}>
                <Link component={RouterLink} to="/home"> Home </Link>
                <Link component={RouterLink} to="/invest"> Invest </Link>
                <Typography>{name}</Typography>
            </Breadcrumbs>

            <Box mt={2}>
                <Typography align="center">{description}</Typography>
            </Box>

            <IndexTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investTokens={investTokens} />
            <Contracts chainId={chainId} poolId={poolId} />
        </Box>
    )
}





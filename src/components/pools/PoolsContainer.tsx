import { Box, Link, Typography, Breadcrumbs } from "@material-ui/core"
import { PoolsView } from "./PoolsView"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"


interface PoolsContainerProps {
    chainId: number,
    account?: string,
    depositToken: Token
}



export const PoolsContainer = ({ chainId, account, depositToken } : PoolsContainerProps) => {

    return (
        <Box px={2} >
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>Pools</Typography>
            </Breadcrumbs>

            <PoolsView chainId={chainId} account={account} depositToken={depositToken} />
        </Box>
    )
}



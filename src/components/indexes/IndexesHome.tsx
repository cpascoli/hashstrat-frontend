import { makeStyles, Link, Typography, Breadcrumbs, Box } from "@material-ui/core"
import { IndexesView } from "./IndexesView"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"


interface IndexesHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}


export const IndexesHome = ({ chainId, account, depositToken } : IndexesHomeProps) => {

    return (
        <Box px={2} >
            
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>Indexes</Typography>
            </Breadcrumbs>

            <IndexesView chainId={chainId} account={account} depositToken={depositToken} />
        </Box>
    )
}



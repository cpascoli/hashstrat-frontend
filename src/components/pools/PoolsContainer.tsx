import { makeStyles, Link, Typography, Breadcrumbs } from "@material-ui/core"
import { useLocation } from "react-router-dom"
import { PoolsView } from "./PoolsView"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"


interface PoolsContainerProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))


export const PoolsContainer = ({ chainId, account, depositToken } : PoolsContainerProps) => {
    const classes = useStyles()
    const location = useLocation();

    return (
        <div className={classes.container}>
            
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>Pools</Typography>
            </Breadcrumbs>

            <PoolsView chainId={chainId} account={account} depositToken={depositToken} />
        </div>
    )
}



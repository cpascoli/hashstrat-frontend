import { makeStyles, Link, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { useLocation } from "react-router-dom"
import { PoolsView } from "./PoolsView"
import { Token } from "../../types/Token"


interface PoolsContainerProps {
    chainId: number,
    account: string,
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
    console.log("pathname: ", location.pathname);

    return (
        <div className={classes.container}>
            
            <Breadcrumbs aria-label="breadcrumb">
                <Link href="/">Home</Link>
                <Typography>Pools</Typography>
            </Breadcrumbs>

            <PoolsView chainId={chainId} account={account} depositToken={depositToken} />
        </div>
    )
}



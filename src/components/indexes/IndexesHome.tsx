import { makeStyles, Link, Typography, Breadcrumbs } from "@material-ui/core"
import { IndexesView } from "./IndexesView"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"


interface IndexesHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))


export const IndexesHome = ({ chainId, account, depositToken } : IndexesHomeProps) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>Indexes</Typography>
            </Breadcrumbs>

            <IndexesView chainId={chainId} account={account} depositToken={depositToken} />
        </div>
    )
}



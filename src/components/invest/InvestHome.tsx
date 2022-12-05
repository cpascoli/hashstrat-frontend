import { makeStyles, Link, Typography, Breadcrumbs, Divider } from "@material-ui/core"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"
import { PoolExplorer } from "./PoolExprorer"

import { InvestTokens } from "../../utils/pools"

interface InvestHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        // backgroundColor: theme.palette.type === 'light' ?  theme.palette.grey[100]: theme.palette.grey[900],
    }
}))


export const InvestHome = ({ chainId, account, depositToken }: InvestHomeProps) => {

    const classes = useStyles()
    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]

    return (
        <div className={classes.container}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/home"> Home </Link>
                <Typography>Invest</Typography>
            </Breadcrumbs>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}} />
            <PoolExplorer chainId={chainId} account={account} depositToken={depositToken} />
        </div>
    )
}



import { makeStyles, Link, Typography, Breadcrumbs, Divider, Box } from "@material-ui/core"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"
import { PoolExplorer } from "./PoolExprorer"


interface InvestHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    }
}))


export const InvestHome = ({ chainId, account, depositToken }: InvestHomeProps) => {

    const classes = useStyles()

    return (
        <div className={classes.container}>

            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/home"> Home </Link>
                    <Typography>Invest</Typography>
                </Breadcrumbs>
            </Box>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}} />
            <PoolExplorer chainId={chainId} account={account} depositToken={depositToken} />
            
        </div>
    )
}



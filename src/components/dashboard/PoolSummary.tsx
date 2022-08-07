
import { makeStyles, Link, Box, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { PoolInfo } from "../../utils/pools"
import { Link as RouterLink } from "react-router-dom"
import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { BigNumber } from "ethers"
import { TitleValueBox } from "../TitleValueBox"


interface PoolSummaryProps {
    chainId: number,
    poolId: string,
    tokens: Array<any>,
    depositToken: Token
}


const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    pool: {
        width: 320,
        color: theme.palette.text.secondary,
        textTransform: "none"
    }
}))


export const PoolSummary = ({ chainId, poolId, tokens, depositToken } : PoolSummaryProps ) => {
    
    const classes = useStyles()

    const totalPoolValue = tokens.reduce( (acc, val) => {
        return val.accountValue ? acc.add(BigNumber.from(val.accountValue)) : acc

    }, BigNumber.from(0))

    const totalAccountValueFormatted = fromDecimals(totalPoolValue, depositToken.decimals, 2 ) as any

    const { name, description } = PoolInfo(chainId, poolId)

    const tokenViews = tokens && tokens.filter( token => token.balance && !token.balance.isZero() ).map( token => {
        const accountBalanceFormatted =  fromDecimals(token.accountBalance, token.decimals, 4 ) as any
        const accountValueFormatted = fromDecimals(token.accountValue, depositToken.decimals, 2 ) as any

        const valueFormatted = `${accountBalanceFormatted} (${accountValueFormatted} ${ depositToken.symbol }) `

        return <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted} mode="small" />
    })


    return (
        <div className={classes.container} >
            <Link component={RouterLink} to={`/pools/${poolId}`} style={{ textDecoration: 'none' }} > 
                <Button variant="outlined" color="primary" >
                    <Box className={classes.pool}>

                        <Typography variant="h5" align="center"> {name} </Typography>
                        <Typography variant="body2"> {description} </Typography>

                        <Divider variant="fullWidth" style={{marginTop: 20, marginBottom: 20}} />

                        { tokenViews }
                        <TitleValueBox title="Total Value" value={totalAccountValueFormatted} suffix={depositToken.symbol} />

                    </Box>
                </Button>
            </Link>
        </div>
    )
}





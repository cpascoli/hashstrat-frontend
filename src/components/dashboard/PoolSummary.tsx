
import { makeStyles, Link, Box, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { utils } from "ethers"

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

    const haveBalance = ( (t : any) => t.accountValue !== undefined && t.accountBalance !== undefined )

    const tokenViews = tokens && tokens.map( token => {

        // console.log("PoolSummary tokens: ", poolId, ">>", token.accountBalance, token.accountValue, "token", token)

        const accountBalanceFormatted = token.accountBalance && fromDecimals(token.accountBalance ?? BigNumber.from(0), token.decimals, 4 )
        const accountValueFormatted = token.accountValue && fromDecimals(token.accountValue ?? BigNumber.from(0), depositToken.decimals, 2 )

        const valueFormatted = `${accountBalanceFormatted} (${accountValueFormatted} ${ depositToken.symbol }) `

        return <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted} mode="small" />
    })

    const link = poolId.startsWith("index") ? `/indexes/${poolId}` : `/pools/${poolId}`


    return (
        <div className={classes.container} >
            <Link component={RouterLink} to={link} style={{ textDecoration: 'none' }} > 
                <Button variant="outlined" color="primary" >
                    <Box className={classes.pool}>

                        <Typography variant="h5" align="center"> {name} </Typography>
                        <Typography variant="body2"> {description} </Typography>

                        <Divider variant="fullWidth" style={{marginTop: 20, marginBottom: 20}} />

                        { tokenViews }
                        <TitleValueBox title="Total Value" value={ utils.commify(totalAccountValueFormatted) } suffix={depositToken.symbol} />

                    </Box>
                </Button>
            </Link>
        </div>
    )
}





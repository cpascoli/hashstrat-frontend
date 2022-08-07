
import { makeStyles, Link, Box, Divider, Typography, Button, Breadcrumbs } from "@material-ui/core"
import { useLocation } from "react-router-dom"

import { IndexInfo } from "../../../utils/pools"

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


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    }
}))


export const IndexHome = ({ chainId, poolId, account, tokens, investTokens } : IndexHomeProps) => {
    
    const location = useLocation();
    console.log("IndexHome: ", location.pathname, "chainId: ", chainId, "tokens: ", tokens);
    const classes = useStyles()
  
    const { name, description } = IndexInfo(chainId, poolId)
 

    return (
        <div className={classes.container}>
            <Breadcrumbs aria-label="breadcrumb" style={{paddingLeft: 10, paddingRight: 10}}>
                <Link component={RouterLink} to="/"> Home </Link>
                <Link component={RouterLink} to="/indexes"> Indexes </Link>
                <Typography>{name}</Typography>
            </Breadcrumbs>

            <IndexTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investTokens={investTokens} />
            <Contracts chainId={chainId} poolId={poolId} />
        </div>
    )
}





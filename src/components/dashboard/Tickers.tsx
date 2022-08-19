
import { Box, makeStyles, Typography, Link, ImageList, ImageListItem } from "@material-ui/core"
import { utils } from "ethers"

import { InvestTokens } from "../../utils/pools"

import { useStakedLP, useClaimableRewards  } from "../../hooks/useFarm"
import { useTokenBalance } from "../../hooks"
import { fromDecimals } from "../../utils/formatter"

import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"
import { NetworkExplorerHost, HstTokenAddress } from "../../utils/network"
import { TickerInfo } from "./TickerInfo"


interface DaoHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    root: {
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
    },
    gridList: {
        minWidth: 700,
        transform: 'translateZ(0)',
      }
}))


export const Tickers = ({ chainId, account, depositToken } : DaoHomeProps ) => {

    const classes = useStyles()
    const investTokens = InvestTokens(chainId)

    // LP token staked
    const tokenStakedBalance = useStakedLP(chainId, account)
    const claimableRewards = useClaimableRewards(chainId, account)

    // token balances
    const hstBalance = useTokenBalance(chainId, "", "HST", account)
    const depositTokenBalance = useTokenBalance(chainId, "", depositToken.symbol, account)
    const investTokenBalance0 = useTokenBalance(chainId, "", investTokens[0].symbol, account)
    const investTokenBalance1 = useTokenBalance(chainId, "", investTokens[1].symbol, account)

    const formattedHstBalance = hstBalance? fromDecimals(hstBalance, 18, 2) : ""
    const formattedDpositTokenBalance = depositTokenBalance? fromDecimals(depositTokenBalance, depositToken.decimals, 2) : ""

    const formattedToken0Balance = investTokenBalance0 ? fromDecimals(investTokenBalance0, investTokens[0].decimals, 2) : ""
    const formattedToken1Balance = investTokenBalance1 ? fromDecimals(investTokenBalance1, investTokens[1].decimals, 2) : ""

    return (
    
        <Box my={1} px={1}>
            <div className={classes.root}>
                    <div className={classes.gridList}>
                        <Typography variant="body2" style={{paddingBottom:5}}>In your wallet</Typography>
                        <Horizontal>
                            <TickerInfo symbol={depositToken.symbol} value={ utils.commify(formattedDpositTokenBalance) } />
                            <TickerInfo symbol="HST" value={ utils.commify(formattedHstBalance) } />
                            <TickerInfo symbol={investTokens[0].symbol} value={ utils.commify( formattedToken0Balance )} />
                            <TickerInfo symbol={investTokens[1].symbol} value={ utils.commify( formattedToken1Balance )}  />
                        </Horizontal>
                   </div>
            </div>
        </Box>
    )
}



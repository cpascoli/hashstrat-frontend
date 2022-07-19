import { useState, useEffect } from "react";
import { Box,Typography, makeStyles } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { TokensForPool, PoolIds, DepositToken } from "../utils/pools"

import { Home } from "./Home"
import { Header } from '../components/Header';
import { PoolContainer } from "./pool/PoolContainer";
import { PoolsContainer } from "../components/pools/PoolsContainer"
import { Socials } from "./Socials"

import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";


interface MainProps {
    toggleDark: boolean,
    setToggleDark: (dark: boolean) => void
}

const useStyle = makeStyles( theme => ({
    container: {
        margin: "auto",
        padding: 0,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    },
    footer: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        textAlign: "center",
        padding: theme.spacing(2)
    }
}))


export const Main = ( { toggleDark, setToggleDark } : MainProps  ) =>  { 
  
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState<number>();
    const [account, setAccount] = useState<string>();

    const classes = useStyle()

    useEffect(() => {
        if (chainId && account) {
            setConnected(true)
        }else {
            setConnected(false)
        }
    }, [chainId, account])


    const poolIds = chainId && PoolIds(chainId)
    const depositToken = chainId && DepositToken(chainId)

    return (
        <Box className={classes.container} >

           <Header toggleDark={toggleDark} setToggleDark={setToggleDark} setChainId={setChainId} setAccount={setAccount} />
           
           {(!chainId && account) &&
                <Alert severity="warning" style={{textAlign: "center", margin: 20}} > 
                    <AlertTitle>Wrong Network</AlertTitle>
                    Connect to the <strong>Polygon</strong> or <strong>Kovan</strong> networks to use the dapp
                </Alert>
            }

            { (!chainId && !account) &&
                <Alert severity="info" style={{textAlign: "center", margin: 20}} > 
                    <AlertTitle>No account connected</AlertTitle>
                    Connect an account to the Polygon or Kovan networks to use the dapp
                </Alert>
            }

            { (chainId && !account) &&
                <Alert severity="info" style={{textAlign: "center", margin: 20}} > 
                    <AlertTitle>No account connected</AlertTitle>
                    Connect an account to use the dapp
                </Alert>
            }

            
           
            <Box style={{marginTop: 2}}>

                <BrowserRouter>
                    <Routes>
                        <Route path="/"  element={<Home chainId={chainId!}/>} />
                        <Route path="/pools" element={ connected && depositToken &&
                                <PoolsContainer chainId={chainId!} account={account!} depositToken={depositToken} />
                           }
                         />

                         {
                             poolIds && poolIds.map( (poolId: string) => {
                                const tokens = TokensForPool(chainId, poolId)
                                const supportedTokens = [tokens.depositToken, tokens.lpToken]
                                const investToken = tokens.investToken
                                return (
                                    <Route key={`${poolId}`} path={`/pools/${poolId}`} 
                                            element={ connected && 
                                                <PoolContainer chainId={chainId!} poolId={`${poolId}`} account={account!} tokens={supportedTokens} investToken={investToken} />
                                            }
                                    />
                                )
                             })
                         }

                    </Routes>
                </BrowserRouter>
            </Box>

            <footer className={classes.footer}>
                <Socials />
                <Typography variant="body2"> Copyright © 2022 HashStrat </Typography>
            </footer>
        
        </Box>
    )

}
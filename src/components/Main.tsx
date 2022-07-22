import { useState, useEffect } from "react";
import { Box,Typography, makeStyles } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { TokensForPool, PoolIds, DepositToken } from "../utils/pools"

import { Home } from "./Home"
import { Header } from '../components/Header';
import { PoolContainer } from "./pool/PoolContainer";
import { PoolsContainer } from "../components/pools/PoolsContainer"
import { Socials } from "./Socials"
import { ConnectButton } from '../main/ConnectButton'

import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import { Horizontal } from "./Layout";
import { FaqHome } from "./faq/FaqHome";
import { StrategiesHome } from "./strategies/StrategiesHome";



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
    const [chainId, setChainId] = useState<number | undefined>(137); // default to Polygon Network
    const [account, setAccount] = useState<string | undefined>();

    const classes = useStyle()

    const [demoChainId, setDemoChainId] = useState<number>(137);


    useEffect(() => {
        if (account) {
            setConnected(true)
        } else {
            setConnected(false)
        }

        if (!chainId) {
            setDemoChainId(137)
        } else {
            setDemoChainId(chainId)
        }
        
    }, [chainId, account])


    const poolIds = chainId ?  PoolIds(chainId) : PoolIds(demoChainId)
    const depositToken = chainId ? DepositToken(chainId) : DepositToken(demoChainId)

    return (
        <Box className={classes.container} >
           
           {(!chainId && account) &&
                <Alert severity="info" style={{textAlign: "center", marginBottom: 20}} > 
                    <AlertTitle>Wrong Network</AlertTitle>
                    Connect to the <strong>Polygon</strong> or <strong>Kovan</strong> networks to use the dapp
                </Alert>
            }

            { !account &&
                <Alert severity="info" style={{textAlign: "center", marginBottom: 20}} > 
                    <Horizontal align="center">
                        <div>
                             <AlertTitle>No account connected</AlertTitle>
                             Connect an account to the Polygon or Kovan networks to use the dapp
                        </div>
                        <div style={{padding: 10}}>
                            <ConnectButton setAccount={setAccount} setChainId={setChainId} />
                        </div>
                    </Horizontal>
                </Alert>
            }


            <Box>
                <BrowserRouter>
                    <Routes>
                        <Route path="/"  element={
                            <Box>
                                <Header toggleDark={toggleDark} setToggleDark={setToggleDark} />
                                <Home chainId={demoChainId}/> 
                            </Box>
                        } />
                        <Route path="/pools" element={
                                <Box>  
                                    <Header toggleDark={toggleDark} setToggleDark={setToggleDark} />
                                    <PoolsContainer chainId={demoChainId} account={account} depositToken={depositToken!} />
                                </Box>
                           }
                         />

                        <Route path="/strategies" element={
                                <Box>  
                                    <Header toggleDark={toggleDark} setToggleDark={setToggleDark} />
                                    <StrategiesHome />
                                </Box>
                           }
                         />


                        <Route path="/faq" element={
                                <Box>  
                                    <Header toggleDark={toggleDark} setToggleDark={setToggleDark} />
                                    <FaqHome  />
                                </Box>
                           }
                         />

                         {
                            poolIds && poolIds.map( (poolId: string) => {
                                const tokens = TokensForPool(demoChainId, poolId)
                                const supportedTokens = [tokens.depositToken, tokens.lpToken]
                                const investToken = tokens.investToken
                                return (
                                    <Route key={`${poolId}`} path={`/pools/${poolId}`} 
                                            element={
                                            <Box>
                                                <Header toggleDark={toggleDark} setToggleDark={setToggleDark} />
                                                <PoolContainer chainId={demoChainId} poolId={`${poolId}`} account={account} tokens={supportedTokens} investToken={investToken} />
                                            </Box>
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
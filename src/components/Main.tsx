import { useState, useEffect } from "react";
import { Box,Typography, makeStyles } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { TokensForPool, TokensForIndex, PoolIds, IndexesIds, DepositToken } from "../utils/pools"

import { Home } from "./Home"
import { Header } from '../components/Header';
import { PoolContainer } from "./pool/PoolContainer";
import { IndexesHome } from '../components/indexes/IndexesHome'
import { PoolsContainer } from "../components/pools/PoolsContainer"
import { Socials } from "./Socials"
import { ConnectButton } from '../main/ConnectButton'
import { IndexHome } from "./indexes/index/IndexHome"

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

    // the chain to show to the user. 
    // use default chain (Polygon) if no account is connected from a supported chain.
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
    const indexesIds = chainId ?  IndexesIds(chainId) : IndexesIds(demoChainId)

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

            <BrowserRouter>
                <Header toggleDark={toggleDark} setToggleDark={setToggleDark} />
                <main>
                    <Routes>
                        <Route path="/"  element={
                            <Home chainId={demoChainId}/> 
                        } />
                        <Route path="/indexes" element={
                            <IndexesHome chainId={demoChainId} account={account} depositToken={depositToken!} />
                        } />
                        <Route path="/pools" element={
                            <PoolsContainer chainId={demoChainId} account={account} depositToken={depositToken!} />
                        } />
                        <Route path="/strategies" element={
                            <StrategiesHome />
                        } />
                        <Route path="/faq" element={
                             <FaqHome  />
                        } />
                        {
                            poolIds && poolIds.map( (poolId: string) => {
                                const tokens = TokensForPool(demoChainId, poolId)
                                const supportedTokens = [tokens.depositToken, tokens.lpToken]
                                const investToken = tokens.investToken
                                return (
                                    <Route key={`${poolId}`} path={`/pools/${poolId}`} element={
                                        <PoolContainer chainId={demoChainId} poolId={`${poolId}`} account={account} tokens={supportedTokens} investToken={investToken} />
                                    } />
                                )
                             })
                         }

                        {
                            indexesIds && indexesIds.map( (indexId: string) => {
                                const tokens = TokensForIndex(demoChainId, indexId)
                                const supportedTokens = [tokens.depositToken, tokens.lpToken]
                                const investTokens = tokens.investTokens
                                return (
                                    <Route key={`${indexId}`} path={`/indexes/${indexId}`} element={
                                        <IndexHome chainId={demoChainId} poolId={`${indexId}`} account={account} tokens={supportedTokens} investTokens={investTokens} />
                                    } />
                                )
                             })
                         }
                    </Routes>
            </main>
            </BrowserRouter>

            <footer className={classes.footer}>
                <Socials />
                <Typography variant="body2"> © 2022 HashStrat. All rights reserved </Typography>
            </footer>
        
        </Box>
    )

}
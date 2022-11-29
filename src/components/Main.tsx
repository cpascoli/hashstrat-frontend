import { useState, useEffect } from "react";
import { BrowserRouter, Routes,Route, useLocation } from "react-router-dom";
import { Polygon } from '@usedapp/core';
import { Box,Typography, makeStyles } from "@material-ui/core"

import { TokensForPool, PoolIds, IndexesIds, DepositToken } from "../utils/pools"
import { InvestTokens } from "../utils/pools"
import { Home } from "./Home"
import { Header } from './Header';
import { Dashboard } from './dashboard/Dashboard'
import { Tickers } from "./dashboard/Tickers"
import { InvestHome } from "./invest/InvestHome"

import { IndexHome } from "./indexes/index/IndexHome"
import { PoolHome } from "./pool/PoolHome";
import { Socials } from "./Socials"
import { FaqHome } from "./faq/FaqHome";
import { StrategiesHome } from "./strategies/StrategiesHome";
import { DaoHome } from './dao/DaoHome'
import { MainWithTitle } from "./MainWithTitle"
import { UsersHome } from "./users//UsersHome"



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
  
  

    // the chain to show to the user. 
    // use default chain (Polygon) if no account is connected from a supported chain.
    //const [demoChainId, setDemoChainId] = useState<number>(137);
    const defaultChainId = Polygon.chainId

    const classes = useStyle()

    // const { chainId  : initialChainId }  = useEthers()

    // chainId can be undefined when the user is connected to a non supported network 
    // when no account is connected it defaults to Polygon
    const [chainId, setChainId] = useState<number | undefined>(defaultChainId); 
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState<string | undefined>();

    const poolIds = PoolIds(chainId || defaultChainId)
    const indexesIds = IndexesIds(chainId || defaultChainId)
    const depositToken = DepositToken(chainId || defaultChainId) 
    const investTokens = InvestTokens(chainId || defaultChainId)
    
    useEffect(() => {
        if (account) {
            setConnected(true)
        } else {
            setConnected(false)
        }
    }, [chainId, account])


    return (
        <Box className={classes.container} >

            <BrowserRouter>

                <Header toggleDark={toggleDark} setToggleDark={setToggleDark} setAccount={setAccount} setChainId={setChainId} />
                <MainWithTitle>
                    <Routes>
                        <Route path="/"  element={
                            <Home chainId={chainId || defaultChainId} /> 
                        } />
                        <Route path="/home"  element={
                            <>
                                <Tickers chainId={chainId || defaultChainId} depositToken={depositToken!} account={account} />
                                <Dashboard chainId={chainId || defaultChainId} account={account} depositToken={depositToken!} investTokens={investTokens}  /> 
                            </>
                        } />
                        <Route path="/invest" element={
                            <>
                                <Tickers chainId={chainId || defaultChainId} depositToken={depositToken!} account={account} />
                                <InvestHome chainId={chainId || defaultChainId} account={account} depositToken={depositToken!} />
                            </>
                        } />
                        <Route path="/strategies" element={
                            <StrategiesHome />
                        } />
                        <Route path="/faq" element={
                             <FaqHome  />
                        } />
                        <Route path="/dao" element={
                            <>
                                <Tickers chainId={chainId || defaultChainId} depositToken={depositToken!} account={account} />
                                <DaoHome chainId={chainId || defaultChainId} account={account} depositToken={depositToken!} />
                            </>
                        } />

                        <Route path="/users" element={
                             <UsersHome chainId={chainId || defaultChainId}  />
                        } />

                        {
                            poolIds && poolIds.map( (poolId: string) => {
                                const tokens = TokensForPool(chainId || defaultChainId, poolId)
                                const supportedTokens = [tokens.depositToken, tokens.lpToken]
                                const investToken = tokens.investTokens[0]
                                return (
                                    <Route key={`${poolId}`} path={`/pools/${poolId}`} element={
                                        <>
                                            <Tickers chainId={chainId || defaultChainId} depositToken={depositToken!} account={account} />
                                            <PoolHome chainId={chainId || defaultChainId} poolId={`${poolId}`} account={account} tokens={supportedTokens} investToken={investToken} />
                                        </>
                                    } />
                                )
                             })
                         }

                        {
                            indexesIds && indexesIds.map( (indexId: string) => {
                                const tokens = TokensForPool(chainId || defaultChainId, indexId)
                                const supportedTokens = [tokens.depositToken, tokens.lpToken]
                                const investTokens = tokens.investTokens
                                return (
                                    <Route key={`${indexId}`} path={`/indexes/${indexId}`} element={
                                        <>
                                            <Tickers chainId={chainId || defaultChainId} depositToken={depositToken!} account={account} />
                                            <IndexHome chainId={chainId || defaultChainId} poolId={`${indexId}`} account={account} tokens={supportedTokens} investTokens={investTokens} />
                                        </>
                                    } />
                                )
                             })
                         }
                    </Routes>
            </MainWithTitle>
            </BrowserRouter>

            <footer className={classes.footer}>
                <Socials />
                <Typography variant="body2"> © 2022 HashStrat. All rights reserved </Typography>
            </footer>
        
        </Box>
    )

}
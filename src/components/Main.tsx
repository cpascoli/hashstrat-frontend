import { useState } from "react";
import { BrowserRouter, Routes,Route } from "react-router-dom";

import { Polygon } from '@usedapp/core';
import { Box, makeStyles } from "@material-ui/core"

import { AppContext, initialContext } from "../context/AppContext"

import { TokensForPool, PoolIds, IndexesIds, DepositToken, InvestTokens } from "../utils/pools"
import { Home } from "./Home"
import { Header } from './Header';
import { Dashboard } from './dashboard/Dashboard'
import { InvestHome } from "./invest/InvestHome"

import { IndexHome } from "./invest/index/IndexHome"
import { PoolHome } from "./invest/pool/PoolHome";

import { FaqHome } from "./faq/FaqHome";
import { StrategiesHome } from "./strategies/StrategiesHome";
import { DaoHome } from './dao/DaoHome'
import { MainWithTitle } from "./MainWithTitle"
import { UsersHome } from "./users//UsersHome"
import { SimHome } from "./simulator/SimHome"

import { Footer } from "./Footer"

import background from "./img/homepage-bg.jpg"
import backgroundSmall from "./img/homepage-bg-small.jpg"
import backgroundDark from "./img/homepage-bg-dark.jpg"
import backgroundDarkSmall from "./img/homepage-bg-dark-small.jpg"

interface MainProps {
    toggleDark: boolean,
    setToggleDark: (dark: boolean) => void
}

const useStyle = makeStyles( theme => ({
    container: {
        margin: "auto",
        backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
        backgroundImage: theme.palette.type === 'light' ? `url( ${background} )` : `url( ${backgroundDark} )` ,

        [theme.breakpoints.down('xs')]: {
            backgroundImage: theme.palette.type === 'light' ? `url( ${backgroundSmall} )` :  `url( ${backgroundDarkSmall} )` ,
        },

    }
}))


export const Main = ( { toggleDark, setToggleDark } : MainProps  ) =>  { 
  
    // the chain to show to the user. 
    // use default chain (Polygon) if no account is connected from a supported chain.
    //const [demoChainId, setDemoChainId] = useState<number>(137);
    const defaultChainId = Polygon.chainId

    const classes = useStyle()

    // chainId can be undefined when the user is connected to a non supported network 
    // when no account is connected it defaults to Polygon
    const [chainId, setChainId] = useState<number | undefined>(defaultChainId); 

    // the chainId connected via the wallet (could be a wrong chain)
    const [connectedChainId, setConnectedChainId] = useState<number | undefined>(undefined); 
    
    const [account, setAccount] = useState<string | undefined>();

    const poolIds = PoolIds(chainId || defaultChainId)
    const indexesIds = IndexesIds(chainId || defaultChainId)
    const depositToken = DepositToken(chainId || defaultChainId) 
    const investTokens = InvestTokens(chainId || defaultChainId)

    console.log("Main >> ", chainId, account)
    

    const networkChangedHandler = (chainId: number) => {
        console.log(">>> Main networkChangedHandler:", chainId, account)
        setConnectedChainId(chainId)
        setChainId(defaultChainId)
        // initialContext.connectedChainId = chainId
    }


    return (
    <AppContext.Provider value={{
        chainId: initialContext.chainId,
        connectedChainId: connectedChainId,
        wrongNetwork: initialContext.wrongNetwork
    }}>  

        <Box className={classes.container} >
            <BrowserRouter>
                <Header toggleDark={toggleDark} setToggleDark={setToggleDark} setAccount={setAccount} setChainId={setChainId} networkChangedHandler={networkChangedHandler} />
                
                <MainWithTitle>
                    <Routes>
                        <Route path="/"  element={
                            <Home chainId={chainId || defaultChainId}  /> 
                        } />
                        <Route path="/home"  element={
                            <Dashboard chainId={chainId || defaultChainId} account={account} depositToken={depositToken!} investTokens={investTokens}  /> 
                        } />
                        <Route path="/invest" element={
                            <InvestHome chainId={chainId || defaultChainId} account={account} depositToken={depositToken!} />
                        } />
                        <Route path="/strategies" element={
                            <StrategiesHome />
                        } />
                        <Route path="/faq" element={
                             <FaqHome />
                        } />
                        <Route path="/dao" element={
                            <DaoHome chainId={chainId || defaultChainId} account={account} depositToken={depositToken!} />
                        } />

                        <Route path="/users" element={
                             <UsersHome chainId={chainId || defaultChainId}  />
                        } />

                        <Route path="/sim" element={
                             <SimHome chainId={chainId || defaultChainId} />
                        } />


                        {
                            poolIds && poolIds.map( (poolId: string) => {
                                const tokens = TokensForPool(chainId || defaultChainId, poolId)
                                const supportedTokens = [tokens.depositToken, tokens.lpToken]
                                const investToken = tokens.investTokens[0]
                                return (
                                    <Route key={`${poolId}`} path={`/pools/${poolId}`} element={
                                        <PoolHome chainId={chainId || defaultChainId} poolId={`${poolId}`} account={account} tokens={supportedTokens} investToken={investToken} />
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
                                        <IndexHome chainId={chainId || defaultChainId} poolId={`${indexId}`} account={account} tokens={supportedTokens} investTokens={investTokens} />
                                    } />
                                )
                             })
                         }
                    </Routes>
                </MainWithTitle>
            </BrowserRouter>
            
            <Footer />
        </Box>

    </AppContext.Provider>  
    )

}
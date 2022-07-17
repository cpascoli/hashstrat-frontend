import { useState, useEffect } from "react";
import { Box,Typography, makeStyles } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import weth from "./img/weth.png"
import usdc from "./img/usdc.png"
import dai from "./img/dai.png"
import poollp from "./img/pool_lp.png"
import { WbtcTokenAddress, WethTokenAddress, UsdcTokenAddress, DaiTokenAddress, PoolLPTokenAddress } from "../utils/network"

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

     // POOL01 (BTC/USD)
    const tokenMap01 = (chainId)? {
        "42" :
            [
                { image: dai, address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18 },
                { image: poollp, address: PoolLPTokenAddress(chainId, "pool01"), symbol: "POOL-LP", decimals: 18 },
            ],
        "137":
            [
                { image: usdc, address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6 },
                { image: poollp, address: PoolLPTokenAddress(chainId, "pool01"), symbol: "POOL-LP", decimals: 6 },
            ]
    } : undefined
    const investToken01 = (chainId)?  { image: weth, address: WbtcTokenAddress(chainId), symbol: "WBTC", decimals: 8 } : undefined


    // POOL02 (ETH/USD)
    const tokenMap02 = (chainId)? {
        "42" :
            [
                { image: dai, address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18 },
                { image: poollp, address: PoolLPTokenAddress(chainId, "pool02"), symbol: "POOL-LP", decimals: 18 },
            ],
        "137":
            [
                { image: usdc, address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6 },
                { image: poollp, address: PoolLPTokenAddress(chainId, "pool02"), symbol: "POOL-LP", decimals: 6 },
            ]
    } : undefined

    const investToken02 = (chainId)?  { image: weth, address: WethTokenAddress(chainId), symbol: "WETH", decimals: 18 } : undefined

    const depositToken = (chainId == 42) ?  { image: dai, address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18 } : 
                         (chainId == 137) ? { image: usdc, address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6 } : undefined


    // const isConnected = account !== undefined
    const supportedTokens01 = tokenMap01 && tokenMap01[chainId?.toString() as keyof typeof tokenMap01 || "137"]
    const supportedTokens02 = tokenMap02 && tokenMap02[chainId?.toString() as keyof typeof tokenMap02 || "137"]

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
                        <Route path="/pools" element={ connected && 
                                <PoolsContainer chainId={chainId!} account={account!} depositToken={depositToken!} />
                           }
                         />
                        <Route path="/pools/pool01" element={ connected && 
                                <PoolContainer chainId={chainId!} poolId="pool01" account={account!} tokens={supportedTokens01!} investToken={investToken01!} />
                           }
                         />
                        <Route path="/pools/pool02" element={ connected && 
                                <PoolContainer chainId={chainId!} poolId="pool02" account={account!} tokens={supportedTokens02!} investToken={investToken02!} />
                           }
                         />
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
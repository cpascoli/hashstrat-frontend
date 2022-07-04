import { useState, useEffect } from "react";
import { Box, makeStyles } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import weth from "./img/weth.png"
import usdc from "./img/usdc.png"
import dai from "./img/dai.png"
import poollp from "./img/pool_lp.png"


import { WethTokenAddress, UsdcTokenAddress, DaiTokenAddress, PoolLPTokenAddress } from "../utils/network"

import { Header } from '../components/Header';
import { PoolTabs } from "./pool/PoolTabs";


export type Token = {
    symbol: string,
    address: string,
    image: string,
    decimals: number
}

interface MainProps {
    toggleDark: boolean,
    setToggleDark: (dark: boolean) => void
}

const useStyle = makeStyles( theme => ({
    container: {
        margin: "auto",
        padding: 0,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        paddingBottom: theme.spacing(1),
    },
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


    const tokenMap = (chainId)? {
        "42" :
            [
                { image: dai, address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18 },
                { image: poollp, address: PoolLPTokenAddress(chainId), symbol: "POOL-LP", decimals: 18 },
            ],
        "137":
            [
                { image: usdc, address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6 },
                { image: poollp, address: PoolLPTokenAddress(chainId), symbol: "POOL-LP", decimals: 6 },
            ]
    } : undefined

    // WETH address
    const investToken = (chainId)?  { image: weth, address: WethTokenAddress(chainId), symbol: "WETH", decimals: 18 } : undefined

    // const isConnected = account !== undefined
    const supportedTokens = tokenMap && tokenMap[chainId?.toString() as keyof typeof tokenMap || "137"]
    console.log(">>> Main: chainId: ", chainId, "account", account, "connected", connected)

    return (
        <Box className={classes.container}>
           <Header toggleDark={toggleDark} setToggleDark={setToggleDark} setChainId={setChainId} setAccount={setAccount} />
           
           {(!chainId && account) &&
                <Alert severity="warning" style={{textAlign: "center", margin: 30}} > 
                    <AlertTitle>Wrong Network</AlertTitle>
                    Please connect to the <strong>Polygon</strong> or <strong>Kovan</strong> networks to use the dapp
                </Alert>
            }

            { (!chainId && !account) &&
                <Alert severity="info" style={{textAlign: "center", margin: 30}} > 
                    <AlertTitle>No account connected</AlertTitle>
                    Please connect an account to the Polygon or Kovan networks to use the dapp
                </Alert>
            }

            { (chainId && !account) &&
                <Alert severity="info" style={{textAlign: "center", margin: 30}} > 
                    <AlertTitle>No account connected</AlertTitle>
                    Please connect an account to use the dapp
                </Alert>
            }

           { connected && 
            <Box py={4}>
                <PoolTabs chainId={chainId!} account={account!} tokens={supportedTokens!} investToken={investToken!} />
            </Box>
           }

        </Box>
    )

}
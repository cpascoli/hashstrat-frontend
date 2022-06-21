import { useState, useEffect } from "react";
import { Box } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

import { ContentPanel } from "./panel"
import usdc from "./img/usdc.png"
import poollp from "./img/pool_lp.png"
import { UsdcTokenAddress, DaiTokenAddress, PoolLPTokenAddress } from "../utils/network"

import { Header } from '../components/Header';


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


export const Main = ( { toggleDark, setToggleDark } : MainProps  ) =>  { 
  
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState<number>();
    const [account, setAccount] = useState<string>();


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
                { image: usdc, address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18 },
                { image: poollp, address: PoolLPTokenAddress(chainId), symbol: "POOL-LP", decimals: 18 },
            ],
        "137":
            [
                { image: usdc, address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6 },
                { image: poollp, address: PoolLPTokenAddress(chainId), symbol: "POOL-LP", decimals: 6 },
            ]
    } : undefined


    // const isConnected = account !== undefined
    const supportedTokens = tokenMap && tokenMap[chainId?.toString() as keyof typeof tokenMap || "137"]
    console.log(">>> Main: chainId: ", chainId, "account", account, "connected", connected)

    return (
        <Box>
           <Header toggleDark={toggleDark} setToggleDark={setToggleDark} setChainId={setChainId} setAccount={setAccount} />
           { connected && 
            <Box py={4}>
                <ContentPanel chainId={chainId!} account={account!} tokens={supportedTokens!} /> 
            </Box>
           }
        </Box>
    )

}
import { useState, useEffect } from "react";
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

    // let chainId: number | undefined
    // let account: string | undefined

    const [connected, setConnected] = useState(false);

    const [chainId, setChainId] = useState<number>();
    const [account, setAccount] = useState<string>();
    // const [connected, setConnected] = useState(false);
  

    useEffect(() => {
        if (chainId && account) {
            setConnected(true)
        }else {
            setConnected(false)
        }
    }, [chainId, account])


    // const updateConnected = (_chainId: number, _account: string) => {
   
    //     if (chainId !== _chainId || account !== _account ) {
    //         console.log(">>> updateConnected 1: ", _chainId, _account)
    //         setChainId(_chainId)
    //         setAccount(_account)
    //         if (_account && _chainId) {
    //             console.log(">>> updateConnected 2: ", _chainId, _account)
    //             setConnected(true)
    //         }
          
    //     }
    //  }


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
        <>
           <Header toggleDark={toggleDark} setToggleDark={setToggleDark} setChainId={setChainId} setAccount={setAccount} />
           { connected && <ContentPanel chainId={chainId!} account={account!} tokens={supportedTokens!} /> }
        </>
    )

}
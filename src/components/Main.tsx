import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMappings from "../chain-info/deployments.json"
import { constants } from "ethers"
import usdc from "./img/usdc.png"
import poollp from "./img/pool_lp.png"
import { YourWallet } from "./yourWallet"

export type Token = {
    image: string,
    address: string,
    name: string
}

export const Main = () =>  { 

    const { chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId.toString() as keyof typeof helperConfig] : "local"

    const usdcTokenAddress = chainId ? networkMappings[networkName as keyof typeof networkMappings]["usdc"] : constants.AddressZero
    const poolLpTokenAddress = chainId ? networkMappings[networkName as keyof typeof networkMappings]["pool_lp"]  : constants.AddressZero

    const supportedTokens: Array<Token> = [
        { image: usdc, address: usdcTokenAddress, name: "USDC" },
        { image: poollp, address: poolLpTokenAddress, name: "POOL-LP" },
    ]

    return (
        <YourWallet tokens={supportedTokens} />
    )

}
import { useEthers, useTokenBalance } from "@usedapp/core"
import { Token } from "../Main"
import { BalanceMsg } from "./BalanceMsg"
import { fromDecimals } from "../../utils/formatter"


export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ( { token }: WalletBalanceProps ) => {

    const { symbol, image, address } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance = (tokenBalance) ? fromDecimals(tokenBalance, 6, 2) : ""

    console.log(">>> formattedTokenBalance", symbol, formattedTokenBalance)

    return (
        <BalanceMsg label={`Your available ${name} to deposit`} tokenImgSrc={image} amount={formattedTokenBalance} />
    )
}
import { useEthers, useTokenBalance } from "@usedapp/core"
import { Token } from "../Main"
import { BalanceMsg } from "./BalanceMsg"
import { formatAmount } from "../../utils/formatter"

import { format } from "path"

export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ( { token }: WalletBalanceProps ) => {

    const { image, address, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance = (tokenBalance) ?  formatAmount(tokenBalance, 6, 2) : ""

    console.log(">>> formattedTokenBalance", formattedTokenBalance)

    return (
        <BalanceMsg label={`Your available ${name} to deposit`} tokenImgSrc={image} amount={formattedTokenBalance} />
    )
}
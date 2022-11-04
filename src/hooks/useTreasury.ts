
import { useCall } from "@usedapp/core"
import { TreasuryContract } from "../utils/network"
import { useDebugValue } from "react"

export const useGetBalance = (chainId: number) => {

    const { value, error } = useCall({
        contract: TreasuryContract(chainId),
        method: 'getBalance',
        args:  [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0]
}


export const useGetPayments = (chainId: number) => {

    const { value, error } = useCall({
        contract: TreasuryContract(chainId),
        method: 'getPayments',
        args: [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0]
}


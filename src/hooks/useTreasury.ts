
import { useCall } from "@usedapp/core"
import { TreasuryContract } from "../utils/network"
import { useDebugValue } from "react"

export const useGetBalance = (chainId: number) => {

    const { value, error } = useCall({
        contract: TreasuryContract(chainId),
        method: 'getBalance',
        args:  [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0]
}


export const useGetPayments = (chainId: number) => {

    const { value, error } = useCall({
        contract: TreasuryContract(chainId),
        method: 'getPayments',
        args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0]
}



import { useCall } from "@usedapp/core"
import { FeedContract } from "../utils/network"
import { useDebugValue } from "react"


export const useFeedLatestPrice = (chainId: number) => {
    const contract = FeedContract(chainId)
    const { value, error } = useCall({
            contract: contract,
            method: 'getLatestPrice',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useFeedDecimals = (chainId: number) => {
    const contract = FeedContract(chainId)
    const { value, error } = useCall({
            contract: contract,
            method: 'decimals',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useFeedLatestTimestamp = (chainId: number) => {
    const contract = FeedContract(chainId)
    const { value, error } = useCall({
            contract: contract,
            method: 'getLatestTimestamp',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

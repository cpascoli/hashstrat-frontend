
import { useCall } from "@usedapp/core"
import { FeedContract } from "../utils/network"
import { useDebugValue } from "react"


export const useFeedLatestPrice = (chainId: number, poolId: string) => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'latestAnswer',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useFeedDecimals = (chainId: number, poolId: string) => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'decimals',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useFeedLatestTimestamp = (chainId: number, poolId: string) => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'latestTimestamp',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

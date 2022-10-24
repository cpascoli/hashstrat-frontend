
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

    if (!value) {
        console.warn("useFeedDecimals - feed decimals is: ", value, " feed contract: ", contract.address)
    }

    useDebugValue(value?.[0].toString())
    return value?.[0].toString() ?? 8
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

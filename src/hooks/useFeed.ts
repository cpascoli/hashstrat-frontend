
import { useCall, useCalls } from "@usedapp/core"
import { BigNumber } from 'ethers'

import { FeedContract, FeedContractForAddress, FeedAddressForToken } from "../utils/network"
import { fromDecimals, round } from "../utils/formatter"


export const useFeedLatestPrice = (chainId: number, poolId: string) => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'latestAnswer',
            args: [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
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

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString() ?? 8
}

export const useFeedLatestTimestamp = (chainId: number, poolId: string) => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'latestTimestamp',
            args: [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}


export const useLastPriceForTokens = (chainId: number, tokens: string[]) => {

    const feedAddresses = tokens.map( symbol => FeedAddressForToken(chainId, symbol) )

    // Price feed calls
    const priceCalls = tokens.map( (req, idx) => ({
        contract: FeedContractForAddress(feedAddresses[idx]),
        method: 'latestAnswer',
        args: [],
    })) ?? []

    const timestampCalls = tokens.map( (req, idx) => ({
        contract: FeedContractForAddress(feedAddresses[idx]),
        method: 'latestTimestamp',
        args: [],
    })) ?? []
  
    const decilamsCalls = tokens.map( (req, idx) => ({
        contract: FeedContractForAddress(feedAddresses[idx]),
        method: 'decimals',
        args: [],
    })) ?? []

    const priceResults = useCalls(priceCalls) ?? []
    const timestampResults = useCalls(timestampCalls) ?? []
    const decimalsResults = useCalls(decilamsCalls) ?? []

    return tokens.map( (symbol, idx) => {
        const price = priceResults.at(idx)?.value
        const timestamp = timestampResults.at(idx)?.value
        const decimals = decimalsResults.at(idx)?.value

        const formattedPrice = (price && decimals && price[0] && decimals[0]) ? fromDecimals( BigNumber.from( price[0] ), parseInt(decimals[0]), 2) : ''
        const formattedTimestamp = timestamp && timestamp[0] ? Number(timestamp[0].toString()) : 0

        return {
            symbol: symbol,
            price: formattedPrice ? Number(formattedPrice) : 0,
            timestamp: formattedTimestamp, 
        }
    })


}
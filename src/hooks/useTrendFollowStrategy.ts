
import { useCall } from "@usedapp/core"
import { StrategyContract } from "../utils/network"
import { useDebugValue } from "react"


export const useStrategyName = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'name',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyDescription = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'description',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyDepositTokenAddress = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'depositToken',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyInvestTokenAddress = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'investToken',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyFeedAddress = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'feed',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useStrategyMovingAveragePeriod = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'movingAveragePeriod',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyMovingAverage = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'movingAverage',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useStrategyTargetPricePercUp = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'targetPricePercUp',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyTargetPricePercDown = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'targetPricePercDown',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyTokensToSwapPerc = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'tokensToSwapPerc',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


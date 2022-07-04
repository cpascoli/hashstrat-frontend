
import { useContractFunction, useCall } from "@usedapp/core"
import { channel } from "diagnostics_channel"
import { StrategyContract } from "../utils/network"
import { BigNumber } from 'ethers'
import { useDebugValue } from "react"


export const useStrategyName = (chainId: number) => {
    const poolContract = StrategyContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'name',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyDescription = (chainId: number) => {
    const poolContract = StrategyContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'description',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyDepositTokenAddress = (chainId: number) => {
    const poolContract = StrategyContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'depositToken',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyInvestTokenAddress = (chainId: number) => {
    const poolContract = StrategyContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'investToken',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyFeedAddress = (chainId: number) => {
    const poolContract = StrategyContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'feed',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useStrategyRebalancingThreshold = (chainId: number) => {
    const poolContract = StrategyContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'rebalancingThreshold',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useStrategyTargetInvestPerc = (chainId: number) => {
    const poolContract = StrategyContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'targetInvestPerc',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

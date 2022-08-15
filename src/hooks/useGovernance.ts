
import { constants } from "ethers"

import { useContractFunction, useCall } from "@usedapp/core"
import { GovernanceContract } from "../utils/network"
import { useDebugValue } from "react"

export const useCollectableFees = (chainId: number) => {

    const governanceContract = GovernanceContract(chainId)
    const { value, error } = useCall({
        contract: governanceContract,
        method: 'collectableFees',
        args: [],
    }) ?? {}
    
    useDebugValue(value?.[0])
    return value?.[0]
}


export const useFeesBalance = (chainId: number) => {

    const governanceContract = GovernanceContract(chainId)
    const { value, error } = useCall({
        contract: governanceContract,
        method: 'feesBalance',
        args: [],
    }) ?? {}

    useDebugValue(value?.[0])
    return value?.[0]
}


export const useTotalFeesCollected = (chainId: number) => {

    const governanceContract = GovernanceContract(chainId)
    const { value, error } = useCall({
        contract: governanceContract,
        method: 'totalFeesCollected',
        args: [],
    }) ?? {}

    useDebugValue(value?.[0])
    return value?.[0]
}

export const useTotalFeesTransferred = (chainId: number) => {

    const governanceContract = GovernanceContract(chainId)
    const { value, error } = useCall({
        contract: governanceContract,
        method: 'totalFeesTransferred',
        args: [],
    }) ?? {}

    useDebugValue(value?.[0])
    return value?.[0]
}

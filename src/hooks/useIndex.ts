
import { useContractFunction, useCall } from "@usedapp/core"
import { PoolContract } from "../utils/network"
import { useDebugValue } from "react"

// Actions

export const useDeposit = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { send: depositSend, state: depositState } = useContractFunction(indexContract, "deposit", { 
        transactionName: "Deposit Tokens"
    })

    const deposit = (amount: string | number) => {
        return depositSend(amount)
    }

    return { deposit, depositState }
}


export const useWithdraw = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { send: withdrawSend, state: withdrawState } = useContractFunction(indexContract, "withdrawLP", { 
        transactionName: "Withdraw Tokens"
    })

    const withdraw = (amount: string | number) => {
        return withdrawSend(amount)
    }

    return { withdraw, withdrawState }
}



// Account Stats
export const useGetDeposits = (chainId: number, poolId: string, account: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'deposits',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useGetWithdrawals = (chainId: number, poolId: string, account: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'withdrawals',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}



// MultiPool Info

export const useMultiPoolValue = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'multiPoolValue',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}



export const useTotalDeposited = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'totalDeposited',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useTotalWithdrawn = (chainId: number, poolId: string) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'totalWithdrawn',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const usePoolInfo = (chainId: number, poolId: string, index: number) => {
    const indexContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: indexContract,
            method: 'pools',
            args: [index],
    }) ?? {}

    return { 
        name:  value?.['name'],
        poolAddress:  value?.['poolAddress'],
        lpTokenAddress:  value?.['lpTokenAddress'],
        weight:  value?.['weight']
    }
}



export const usePoolInfoArray = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)

    const { value, error } = useCall({
        contract: poolContract,
        method: 'getPoolsInfo',
        args: [],
    }) ?? {}

    const info = value?.[0].map( (data: any, idx: number) => {
        return {
            name:  value?.['name'],
            poolAddress:  value?.['poolAddress'],
            lpTokenAddress:  value?.['lpTokenAddress'],
            weight:  value?.['weight']
          }
    })
    return info
}




import { useContractFunction, useCall } from "@usedapp/core"
import { PoolContract } from "../utils/network"
import { useDebugValue } from "react"

export const useDeposit = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { send: depositSend, state: depositState } = useContractFunction(poolContract, "deposit", { 
        transactionName: "Deposit Tokens"
    })

    const deposit = (amount: string | number) => {
        return depositSend(amount)
    }

    return { deposit, depositState }
}


export const useWithdraw = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { send: withdrawSend, state: withdrawState } = useContractFunction(poolContract, "withdrawLP", { 
        transactionName: "Withdraw Tokens"
    })

    const withdraw = (amount: string | number) => {
        return withdrawSend(amount)
    }

    return { withdraw, withdrawState }
}


export const usePortfolioValue = (chainId: number, poolId: string, account: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'portfolioValue',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

// Account Stats
export const useGetDeposits = (chainId: number, poolId: string, account: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'deposits',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useGetWithdrawals = (chainId: number, poolId: string, account: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'withdrawals',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}



// Pool Stats

export const useTotalPortfolioValue = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalPortfolioValue',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useTotalDeposited = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalDeposited',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useTotalWithdrawn = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalWithdrawn',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useInvestedTokenValue = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'investedTokenValue',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useSwapInfo = (chainId: number, index: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'swaps',
            args: [index],
    }) ?? {}

    return { 
      timestamp:  value?.['timestamp'].toString(),
      side:  value?.['side'],
      feedPrice:  value?.['feedPrice'].toString(),
      bought:  value?.['bought'].toString(),
      sold:  value?.['sold'].toString(),
      depositTokenBalance: value?.['depositTokenBalance'].toString(),
      investTokenBalance: value?.['investTokenBalance'].toString(),
    }
}


export const useSwapInfoArray = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)

    const { value, error } = useCall({
        contract: poolContract,
        method: 'getSwapsInfo',
        args: [],
    }) ?? {}

    const info = value?.[0].map( (data: any, idx: number) => {
        return {
            timestamp: data['timestamp'].toString(),
            side: data['side'],
            feedPrice: data['feedPrice'].toString(),
            bought: data['bought'].toString(),
            sold: data['sold'].toString(),
            depositTokenBalance: data['depositTokenBalance'].toString(),
            investTokenBalance: data['investTokenBalance'].toString(),
          }

    })
    return info
}



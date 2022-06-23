
import { useContractFunction, useCall } from "@usedapp/core"
import { channel } from "diagnostics_channel"
import { PoolContract } from "../utils/network"
import { BigNumber } from 'ethers'
import { useDebugValue, useEffect, useState } from "react"

export const useDeposit = (chainId: number) => {

    const poolContract = PoolContract(chainId)

    const { send: depositSend, state: depositState } = useContractFunction(poolContract, "deposit", { 
        transactionName: "Deposit Tokens"
    })

    const deposit = (amount: string | number) => {
        return depositSend(amount)
    }

    return { deposit, depositState }
}


export const useWithdraw = (chainId: number) => {
    const poolContract = PoolContract(chainId)
    const { send: withdrawSend, state: withdrawState } = useContractFunction(poolContract, "withdrawLP", { 
        transactionName: "Withdraw Tokens"
    })

    const withdraw = (amount: string | number) => {
        return withdrawSend(amount)
    }

    return { withdraw, withdrawState }
}


export const usePortfolioValue = (chainId: number, account: string) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'portfolioValue',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

// Account Stats
export const useGetDeposits = (chainId: number, account: string) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'deposits',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useGetWithdrawals = (chainId: number, account: string) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'withdrawals',
            args: [account],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}



// Pool Stats

export const useTotalPortfolioValue = (chainId: number) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalPortfolioValue',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useTotalDeposited = (chainId: number) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalDeposited',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useTotalWithdrawn = (chainId: number) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalWithdrawn',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useDepositTokenBalance = (chainId: number) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'depositTokenBalance',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useInvestTokenBalance = (chainId: number) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'investTokenBalance',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useInvestedTokenValue = (chainId: number) => {
    const poolContract = PoolContract(chainId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'investedTokenValue',
            args: [],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}




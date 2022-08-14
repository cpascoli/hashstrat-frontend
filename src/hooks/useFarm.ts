
import { constants } from "ethers"

import { useContractFunction, useCall } from "@usedapp/core"
import { FarmContract, PoolLPTokenAddress } from "../utils/network"
import { useDebugValue } from "react"

export const useStakedTokenBalance = (chainId: number, poolId: string, account?: string) => {

    const farmContract = FarmContract(chainId)
    const lptokenAddress = PoolLPTokenAddress(chainId, poolId)

    const { value, error } = useCall({
        contract: farmContract,
        method: 'getStakedBalance',
        args:  account ? [account, lptokenAddress] : [constants.AddressZero, lptokenAddress],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


// the sum of the balance of all LP tokens staked
export const useStakedLP = (chainId: number, account?: string) => {

    const farmContract = FarmContract(chainId)
    const { value, error } = useCall({
        contract: farmContract,
        method: 'getStakedLP',
        args:  account ? [account] : [constants.AddressZero],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}


export const useClaimableRewards = (chainId: number, account?: string) => {

    const farmContract = FarmContract(chainId)
    const { value, error } = useCall({
        contract: farmContract,
        method: 'claimableReward',
        args: account ? [account] : [constants.AddressZero],
    }) ?? {}

    useDebugValue(value?.[0].toString())
    return value?.[0].toString()
}

export const useGetRewardPeriods = (chainId: number, account?: string) => {

    const farmContract = FarmContract(chainId)
    const { value, error } = useCall({
        contract: farmContract,
        method: 'getRewardPeriods',
        args: [],
    }) ?? {}

    useDebugValue(value?.[0])
    return value?.[0]
}





////// User Actions


export const useDepositAndStartStake = (chainId: number) => {
    const farmContract = FarmContract(chainId)

    const { send: depositSend, state: depositState } = useContractFunction(farmContract, "depositAndStartStake", { 
        transactionName: "Deposit Tokens"
    })

    const deposit = (lptokeAddress: string, amount: string | number) => {
        return depositSend(lptokeAddress, amount)
    }

    return { deposit, depositState }
}


export const useEndStakeAndWithdraw = (chainId: number) => {
    const farmContract = FarmContract(chainId)

    const { send: withdrawSend, state: withdrawState } = useContractFunction(farmContract, "endStakeAndWithdraw", { 
        transactionName: "Withdraw Tokens"
    })

    const withdraw = (lptokeAddress: string, amount: string | number) => {
        return withdrawSend(lptokeAddress, amount)
    }

    return { withdraw, withdrawState }
}


export const useClaimReward = (chainId: number) => {
    const farmContract = FarmContract(chainId)

    const { send: claimRewardSend, state: claimRewardState } = useContractFunction(farmContract, "claimReward", { 
        transactionName: "Claim Rewards"
    })

    const claimReward = () => {
        return claimRewardSend()
    }

    return { claimReward, claimRewardState }
}

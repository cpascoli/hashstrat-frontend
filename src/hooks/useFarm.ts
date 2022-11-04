
import { BigNumber, constants } from "ethers"

import { useContractFunction, useCall, useCalls } from "@usedapp/core"
import { FarmContract, PoolLPTokenAddress } from "../utils/network"
import { useDebugValue } from "react"

export const useStakedTokenBalance = (chainId: number, poolId: string, account?: string) => {

    const farmContract = FarmContract(chainId, poolId)
    const lptokenAddress = PoolLPTokenAddress(chainId, poolId)

    const { value, error } = useCall({
        contract: farmContract,
        method: 'getStakedBalance',
        args:  account ? [account, lptokenAddress] : [constants.AddressZero, lptokenAddress],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}


export type LPBalanceInfo = {
    lptoken: string,
    lpBalance: BigNumber | undefined,
}


// the sum of the balance of all LP tokens staked in the farm
export const useStakedLP = (chainId: number, account?: string) => {

    const { value, error } = useCall({
        contract: FarmContract(chainId),
        method: 'getLPTokens',
        args: [],
    }) ?? {}

    const lptokens = value?.[0] ?? []

    const stakedLpBalanceCalls = lptokens && (lptokens.map( (lptokenAddress: string ) => ({
        contract: FarmContract(chainId),
        method: 'getStakedBalance',
        args: account? [account, lptokenAddress] : [constants.AddressZero, constants.AddressZero]
    })) ?? [])

    const stakedLpBalanceResults = useCalls(stakedLpBalanceCalls) ?? []

    const totalBalance = lptokens && lptokens.map( (lptokenAddr : string, idx: number) => {
        const stakedBalance = stakedLpBalanceResults[idx]?.value && stakedLpBalanceResults[idx]?.value[0]
        return stakedBalance

    }).reduce( (total : BigNumber, balance? : BigNumber) => {
        total =  balance ? total.add(balance) : total
        return total
    }, BigNumber.from(0) )

    return totalBalance
}



export const useClaimableRewards = (chainId: number, account?: string) => {

    const farmContract = FarmContract(chainId)
    const { value, error } = useCall({
        contract: farmContract,
        method: 'claimableReward',
        args: account ? [account] : [constants.AddressZero],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0].toString()
}

export const useGetRewardPeriods = (chainId: number, account?: string) => {

    const farmContract = FarmContract(chainId)
    const { value, error } = useCall({
        contract: farmContract,
        method: 'getRewardPeriods',
        args: [],
    }) ?? {}

    error && console.error("error in custom hoock: ", error)
    return value?.[0]
}





////// User Actions


export const useDepositAndStartStake = (chainId: number, poolId?: string) => {
    const farmContract = FarmContract(chainId, poolId)

    const { send: depositSend, state: depositState } = useContractFunction(farmContract, "depositAndStartStake", { 
        transactionName: "Deposit and Stake Tokens"
    })

    const deposit = (lptokeAddress: string, amount: string | number) => {
        return depositSend(lptokeAddress, amount)
    }

    return { deposit, depositState }
}


export const useEndStakeAndWithdraw = (chainId: number, poolId?: string) => {
    const farmContract = FarmContract(chainId, poolId)

    const { send: withdrawSend, state: withdrawState } = useContractFunction(farmContract, "endStakeAndWithdraw", { 
        transactionName: "Unstake and Withdraw Tokens"
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

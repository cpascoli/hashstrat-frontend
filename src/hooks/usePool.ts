
import { useContractFunction, useCall } from "@usedapp/core"
import { channel } from "diagnostics_channel"
import { PoolContract } from "../utils/network"


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

    if(error) {
      console.error("Error getting portfolioValue: ", error.message)
      return undefined
    }
    console.log("portfolioValue: ", value?.toString());

    return value?.[0]
}



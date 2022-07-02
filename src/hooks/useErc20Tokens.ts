
import { useEthers, useContractFunction, useCall, ERC20Interface } from "@usedapp/core"
import { ERC20Contract, PoolAddress } from "../utils/network"


// Approve spending of 'symbol' by the Pool contract
export const useTokenApprove = (chainId: number, symbol: string) => {
    const tokenContract =  ERC20Contract(chainId, symbol) 
    const spenderAddress = PoolAddress(chainId)

    const { send: approveErc20Send, state: approveErc20State } = useContractFunction(tokenContract, "approve", { 
        transactionName: "Approve Token Transfer"
    })

    const approveErc20 = (amount: string) => {
        return approveErc20Send(spenderAddress, amount)
    }

    return { approveErc20, approveErc20State }
}


export const useTokenAllowance =  (chainId: number, symbol: string) => {
    console.log("useTokenAllowance () symbol: ", symbol)

    const tokenContract = ERC20Contract(chainId, symbol)
    const spenderAddress = PoolAddress(chainId)
    const { account : ownerAddress } = useEthers()

    const { value, error } = useCall({
            contract: tokenContract,
            method: 'allowance',
            args: [ownerAddress, spenderAddress],
      }) ?? {}

    if(error) {
      console.error("Error getting token allowance: ", error.message)
      return undefined
    }

    return value?.[0]
}



export const useTokenBalance = (chainId: number, symbol: string, address: string) => {
    const tokenContract =  ERC20Contract(chainId, symbol) 

    const { value, error } = useCall({
            contract: tokenContract,
            method: 'balanceOf',
            args: [address],
    }) ?? {}

    return value?.[0].toString()
}



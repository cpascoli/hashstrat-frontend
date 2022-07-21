
import { useEthers, useContractFunction, useCall } from "@usedapp/core"
import { ERC20Contract, PoolAddress } from "../utils/network"


// Approve spending of 'symbol' by the Pool contract
export const useTokenApprove = (chainId: number, poolId: string, symbol: string) => {
    const tokenContract =  ERC20Contract(chainId, poolId, symbol) 
    const spenderAddress = PoolAddress(chainId, poolId)

    const { send: approveErc20Send, state: approveErc20State } = useContractFunction(tokenContract, "approve", { 
        transactionName: "Approve Token Transfer"
    })

    const approveErc20 = (amount: string) => {
        return approveErc20Send(spenderAddress, amount)
    }

    return { approveErc20, approveErc20State }
}


export const useTokenAllowance =  (chainId: number, poolId: string, symbol: string) => {
    console.log("useTokenAllowance symbol: ", symbol, chainId, poolId)

    const tokenContract = ERC20Contract(chainId, poolId, symbol)
    const spenderAddress = PoolAddress(chainId, poolId)
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



export const useTokenBalance = (chainId: number, poolId: string, symbol: string, address: string = '0x0000000000000000000000000000000000000000') => {
    const tokenContract =  ERC20Contract(chainId, poolId, symbol) 
    const { value, error } = useCall({
            contract: tokenContract,
            method: 'balanceOf',
            args: [address],
    }) ?? {}

    return value?.[0].toString()
}

export const useTokenTotalSupply = (chainId: number, poolId: string, symbol: string) => {
    const tokenContract =  ERC20Contract(chainId, poolId, symbol) 

    const { value, error } = useCall({
            contract: tokenContract,
            method: 'totalSupply',
            args: [],
    }) ?? {}

    return value?.[0].toString()
}




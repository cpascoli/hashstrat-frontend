
import { useCall } from "@usedapp/core"
import { constants } from "ethers"

import { HstContract } from "../utils/network"


export const useTotalSupply = (chainId: number)  => {
    const tokenContract = HstContract(chainId) 
    const { value, error } = useCall({
            contract: tokenContract,
            method: 'totalSupply',
            args: [],
    }) ?? {}

    return value?.[0].toString()
}

export const useMaxSupply = (chainId: number) => {
    const tokenContract = HstContract(chainId) 

    const { value, error } = useCall({
            contract: tokenContract,
            method: 'maxSupply',
            args: [],
    }) ?? {}

    return value?.[0].toString()
}


export const useGetPastVotes = (chainId: number, from: number, account?: string) => {
    const tokenContract = HstContract(chainId) 

    const { value, error } = useCall({
            contract: tokenContract,
            method: 'getPastVotes',
            args: account ? [account, from] : [constants.AddressZero, 0],
        }) ?? {}

    return value?.[0].toString()
}

export const useGetPastTotalSupply = (chainId: number, from: number) => {
    const tokenContract = HstContract(chainId) 

    const { value, error } = useCall({
            contract: tokenContract,
            method: 'getPastTotalSupply',
            args: [ from ],
        }) ?? {}

    return value?.[0].toString()
}

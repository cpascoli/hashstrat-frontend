import { constants, BigNumber } from "ethers"
import { useContractFunction, useCall } from "@usedapp/core"
import { PoolContract, PoolLPContract } from "../utils/network"
import { SwapInfo } from "../types/SwapInfo"

//// User Actions ////

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


//// View Functions  ////


export const usePortfolioValue = (chainId: number, poolId: string, account: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'portfolioValue',
            args: [account],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}



//TODO 
// When the MultiPool contract will support lpTokensValue(), we should use that for both Pools & Indexes
// For now we need to calculate LP value on the client using pool/index value and from LP supply
export const useLpTokensValue = (chainId: number, poolId: string, amount: string) => {

    const poolContract = PoolContract(chainId, poolId)
    const poolLPPontract = PoolLPContract(chainId, poolId)

    const { value : portfolioValue, error : error0 } = useCall({
        contract: poolContract,
        method: /v3.?$/.test(poolId) ? 'totalValue' : 'totalPortfolioValue',
        args: [],
    }) ?? {}

    error0 && console.error("error in custom hook: ", error0)

    const { value : multiPoolValue, error : error1 } = useCall({
        contract: poolContract,
        method: /v3.?$/.test(poolId) ? 'totalValue' : 'multiPoolValue',
        args: [],
    }) ?? {}

    error1 && console.error("error in custom hook: ", error1)


    const totValue0 = portfolioValue?.[0]
    const totValue1 = multiPoolValue?.[0]
    const totValue = totValue0 ?  totValue0: totValue1

    const { value : totalSupply, error : error2 } = useCall({
            contract: poolLPPontract,
            method: 'totalSupply',
            args: [],
    }) ?? {}

    error2 && console.error("error in custom hook: ", error2)


    const totSupply = totalSupply?.[0]

    const lpValue = ( amount !== '' && totValue && totSupply && !totSupply.isZero()) ?  totValue.mul(BigNumber.from(amount)).div(totSupply) : undefined

    return lpValue?.toString()
}

// export const useLpTokensValue = (chainId: number, poolId: string, amount: string) => {
//     const poolContract = PoolContract(chainId, poolId)
//     const { value, error } = useCall({
//             contract: poolContract,
//             method: 'lpTokensValue',
//             args: amount !== '' ? [amount] : [],
//     }) ?? {}

//     useDebugValue(value?.[0].toString())
//     return value?.[0].toString()
// }


export const useGetDeposits = (chainId: number, poolId: string, account: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'deposits',
            args: [account],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useGetWithdrawals = (chainId: number, poolId: string, account: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'withdrawals',
            args: [account],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useTotalPortfolioValue = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: /v3.?$/.test(poolId) ? 'totalValue' : 'totalPortfolioValue',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useTotalDeposited = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalDeposited',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useTotalWithdrawn = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'totalWithdrawn',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useInvestedTokenValue = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: /v3.?$/.test(poolId) ? 'riskAssetValue' : 'investedTokenValue',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useDepositTokenValue = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: /v3.?$/.test(poolId) ? 'stableAssetValue' : 'depositTokenValue',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}




export const useSwapInfo = (chainId: number, index: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value } = useCall({
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

    const { value } = useCall({
        contract: poolContract,
        method: 'getSwapsInfo',
        args: [],
    }) ?? {}

    const info : SwapInfo[] | undefined = value?.[0].map( (data: any, idx: number) => {
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



export const useFeesForWithdraw = (chainId: number, poolId: string, lpTokensAmount: string, account?: string) => {
    const amount = lpTokensAmount.trim() === '' ? BigNumber.from(0) : BigNumber.from(lpTokensAmount)

    console.log("useFeesForWithdraw", poolId, lpTokensAmount, account)
    const poolContract = PoolContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'feesForWithdraw',
            args: account ? [amount, account] : [amount, constants.AddressZero],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useGetUsers = (chainId: number, poolId: string) => {
    const poolContract = PoolContract(chainId, poolId)
    const { value } = useCall({
            contract: poolContract,
            method: 'getUsers',
            args: [0],
    }) ?? {}

    return value
}





import { useCalls } from "@usedapp/core"

import { IndexesInfo, PoolsInfo } from "../utils/pools"
import { Token } from "../types/Token"
import { groupBy } from "../utils/formatter"

import { BigNumber } from "ethers"

// import { useFeedLatestPrice, useGetDeposits, useGetWithdrawals } from "../hooks/usePool"
import { FeedContract, ERC20Contract, PoolContract, PoolLPContract } from "../utils/network"


//  Returns the token balance for the account at every pool
//  indexPools params specifies either all regular pools or all index pools in a chain
export const useTokensInfo = (chainId: number, tokens: Token[], account?: string, indexPools : boolean = false) => {

 
    // get the pool addresses for all indexes or all regular pools in the chain
    const poolsInfo = indexPools ? IndexesInfo(chainId) : PoolsInfo(chainId) 

    const poolIds = poolsInfo.map( pool => { return pool.poolId })

    // get the prices for the invest tokens in each pool
    let poolPriceMap = usePoolPrices(chainId, poolsInfo)  // map of [ pool_id => token_price ]

    // get LP tokens balances and totalSupplies
    const lpBalanceResponses = useLPBalances(chainId, account, poolsInfo)
    const lpBalances = lpBalanceResponses.reduce( (map, balance ) => {
        map[ balance.poolId ] = balance
        return map;
    }, {} as { [x: string]: any } );


    const poolsPoolseResponse = useTokensPoolsBalances(chainId, tokens, poolsInfo)
    const balancesByPool = groupBy(poolsPoolseResponse, b => b.poolId)
    const poolBalances = Object.values(balancesByPool)

   
    // aggregate the token amounts (balances) across all pools by token symbol
    let initialBalanceValues = tokens.reduce( (map, token ) => {
        map[ token.symbol ] = BigNumber.from("0")
        return map;
    }, {} as { [x: string]: BigNumber } );

    const totalTokensBalances = poolBalances.reduce( (tot, pools) => {
         pools.forEach(pool => {
            if (pool.balance) {
                const balance = BigNumber.from(pool.balance)
                const lpBalance = BigNumber.from(lpBalances[pool.poolId].lpBalance)
                const lpSupply = BigNumber.from(lpBalances[pool.poolId].lpTotalSupply)
                const accountBalance = balance.mul(lpBalance).div(lpSupply)
              
                tot[pool.tokenSymbol] = tot[pool.tokenSymbol].add(accountBalance)
            } else {
                console.log("missing balance for pool: ", pool)
            }           
         })
         return tot
    }, initialBalanceValues )

    // aggregate the values (amount * price) of all tokens across all pools by token symbol
    let initialValueValues = tokens.reduce( (map, token ) => {
        map[ token.symbol ] = BigNumber.from("0")
        return map;
    }, {} as { [x: string]: BigNumber } );


    // Object.values(initialValueValues).forEach( (t , idx) => {
    //     console.log("initialValues value 0: ", idx, t.toString())

    // })
    
    /// build maap of { token_symbol => dollar_value } across all pools
    const feedPrecision = BigNumber.from("100000000") // price feed 8 digit precision  
    const totalTokensValues = poolBalances.reduce( (tot, pools) => {
        pools.forEach(pool => {

            if (pool.balance && poolPriceMap[pool.poolId]) {
                const isDepositToken = (pool.tokenSymbol == pool.depositToken?.symbol)
                const price = BigNumber.from(poolPriceMap[pool.poolId])  

                const balance = BigNumber.from(pool.balance)
                const lpBalance = BigNumber.from(lpBalances[pool.poolId].lpBalance) 
                const lpSupply = BigNumber.from(lpBalances[pool.poolId].lpTotalSupply)
                const tokenValue = isDepositToken ? adjustAmountDecimals( pool.depositToken!.decimals, pool.depositToken!.decimals, balance.mul(lpBalance).div(lpSupply)) : 
                                                    adjustAmountDecimals( pool.tokenDecimals, pool.depositToken!.decimals, balance.mul(lpBalance).mul(price).div(lpSupply).div(feedPrecision)  )// token_value := price * balance * LP%
                
                tot[pool.tokenSymbol] = tot[pool.tokenSymbol].add(tokenValue)

                //console.log("poolBalances poolId: ", pool.poolId, pool.tokenSymbol, "balance:", balance.toString(), "tokenDecimals", pool.tokenDecimals, "price:", price.div(feedPrecision).toString(), "prev: ", prev.toString(), " add:", tokenValue.toString(), " >> tot: ", tot[pool.tokenSymbol].toString() )

            } else {
                console.log("missing balance for pool: ", pool)
            }           
        })
        return tot
    }, initialValueValues )


    // sum the value across all tokens (and pools)
    let totalPortfolioValue = BigNumber.from(0)
    Object.keys(totalTokensValues).forEach( tokenSymbol => {
        totalPortfolioValue = totalPortfolioValue.add(totalTokensValues[tokenSymbol])
    })


    // array of token balance infos for each pool 
    const balanceInfoArray = poolIds.map ( (req, idx) => {
        const poolId = poolIds[idx]
        const supply = lpBalances[poolId].lpBalance // results1.at(idx)?.value.toString()
        const balance = lpBalances[poolId].lpTotalSupply // results0.at(idx)?.value.toString()
        return {
            poolId,
            tokens: balancesByPool[poolId],
            lpSupply: supply,
            lpBalance: balance
        }
    })
    // transform into a map { pool_id  => balanceInfo } 
    let pools = balanceInfoArray.reduce( (map, pool ) => {
        map[ pool.poolId ] = pool
        
        return map;
    }, {} as { [x: string]: any } );


   
    return {
        totalPortfolioValue: totalPortfolioValue,
        tokenBalances: totalTokensBalances,
        tokenValues: totalTokensValues,
        pools: pools,
    }


}


const useTokensPoolsBalances = (chainId : number, tokens: Token[],  poolsInfo: any[]) =>  {

        // Get the balanceOf all Invest Tokens in every Pool 
    // requests are [ Token x Pool ] combos
    const tokenPoolsRequestsParams = tokens.flatMap( token => {
        return poolsInfo.map( info => {
           return { 
                poolId: info.poolId, 
                poolAddress: info.pool,
                depositToken: info.depositToken,
                
                tokenSymbol: token.symbol,
                tokenAddress: token.address,
                tokenDecimals: token.decimals,
            }
        })
    })

    // ERC20 calls
    const calls = tokenPoolsRequestsParams.map(req => ({
        contract: ERC20Contract(chainId, req.poolId, req.tokenSymbol), // new Contract(req.tokenAddress, new utils.Interface(abi)),
        method: 'balanceOf',
        args: [req.poolAddress]
    })) ?? []
  
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'balanceOf' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    // process the token balances results
    return tokenPoolsRequestsParams.map( (req, idx) => {
        return {
            poolId: req.poolId,
            tokenSymbol: req.tokenSymbol,
            balance: results.at(idx)?.value.toString(),
            tokenDecimals: req.tokenDecimals,
            // price: poolPriceMap[req.poolId], //results4.at(idx)?.value.toString(),
            depositToken: req.depositToken,
        }
    })
}



// Retunrs the balance and totak supply for each pool in the poolsInfo array
const useLPBalances = (chainId : number, account: string | undefined, poolsInfo: any[] ) => {

    // Get the  LP balances of the account for every Pool
    const lptokensRequests = poolsInfo.map( pool => {
        return { 
            poolId: pool.poolId, 
            lptokenAddress: pool.lptoken, 
            account: account,
            depositToken: pool.depositToken,
        }
    })

    // get the LP balances
    const lpBalanceCalls = lptokensRequests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId), // new Contract(req.lptokenAddress, new utils.Interface(abi)),
        method: 'balanceOf',
        args: [req.account]
    })) ?? []

    const lpBalanceResults = useCalls(lpBalanceCalls) ?? []
    lpBalanceResults.forEach((result, idx) => {
        if(result && result.error) {
        console.error(`Error encountered calling 'totalSupply' on ${lpBalanceCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    // get the LP total supplies
    const lpTotalSupplyCalls = lptokensRequests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId), // new Contract(req.lptokenAddress, new utils.Interface(abi)),
        method: 'totalSupply',
        args: []
    })) ?? []

    const lpTotalSupplyResults = useCalls(lpTotalSupplyCalls) ?? []
    lpTotalSupplyResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'totalSupply' on ${lpTotalSupplyCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    
    const lpBalanceResponses = lptokensRequests.map( (req, idx) => {
        return {
            poolId: req.poolId,
            lpBalance: lpBalanceResults.at(idx)?.value.toString(),
            lpTotalSupply: lpTotalSupplyResults.at(idx)?.value.toString(),
        }
    })

    return lpBalanceResponses
}


const usePoolPrices = (chainId : number, poolsInfo: any[] )  => {

    const pricefeedCalls = poolsInfo.map(info => ({
        contract: FeedContract(chainId, info.poolId),
        method: 'latestAnswer',
        args: []
    })) ?? []
    const pricefeedResults = useCalls(pricefeedCalls) ?? []
    pricefeedResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'latestAnswer' on ${pricefeedCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    let poolPriceMap = {} as { [x: string]: string }
    poolsInfo.forEach((info, idx) => {
            poolPriceMap[info.poolId] = pricefeedResults.at(idx)?.value.toString()
    })

    return poolPriceMap
}

const adjustAmountDecimals = (tokenInDecimals: number, tokenOutDecimals: number, amountIn : BigNumber) : BigNumber => {

    const amountInAdjusted : BigNumber = (tokenOutDecimals >= tokenInDecimals) ?
            amountIn.mul( BigNumber.from(10 ** (tokenOutDecimals - tokenInDecimals))) :
            amountIn.div( BigNumber.from(10 ** (tokenInDecimals - tokenOutDecimals)))

    return amountInAdjusted;
}
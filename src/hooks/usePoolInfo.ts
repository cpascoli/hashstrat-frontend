
import { useCalls } from "@usedapp/core"

import { PoolIds, IndexesInfo, PoolsInfo, IndexesIds } from "../utils/pools"
import { Token } from "../types/Token"
import { groupBy } from "../utils/formatter"

import { BigNumber } from "ethers"

// import { useFeedLatestPrice, useGetDeposits, useGetWithdrawals } from "../hooks/usePool"
import { FeedContractsForTokens, ERC20Contract, PoolLPContract, PoolContract } from "../utils/network"



// price feed 8 digit precision  
const feedPrecision = BigNumber.from("100000000")


export const useTokensInfoForIndex = (chainId: number, indexId: string, tokens: Token[], account?: string) => {


    const indexes = useTokensInfoForIndexes(chainId, [indexId], tokens, account) as any

    console.log("useTokensInfoForIndex >>> : ", indexes)


    return indexes[indexId]
}


export const useTokensInfoForIndexes = (chainId: number,  indexIds: string[], tokens: Token[], account?: string) => {

    // array of indexes with their assocaited pools array
    const indexPools = useIndexPools(chainId, indexIds) 

    // array of poolIds for all indexes in indexPools array
    const poolIds = indexPools.flatMap( index => {
        return index.pools && index.pools.map( (pool : any) => {
            return pool.name.toLowerCase()
        })
    }).filter((item, pos, self) => {  // remove dups
        return self.indexOf(item) == pos;
    }).filter( item => {
        return item !== undefined
    }).sort()
        

    // get assets for all pools in these Indexes
    const poolsBalances = useTokensInfoForPools(chainId, poolIds, tokens)

    // get all LP token balances of all pools in the indexes (Pools LPs.balanceOf index address)
    const lpbalancesByIndexMap = useLPBalancesForIndexes(chainId, indexIds, poolIds)

    // process all poolsBalances determining the allocation of the index in those pool
    const allaBalances = indexPools.map( item  => {

        const indexId = item.indexId as string
        const poolids = item.pools && item.pools.map( (i: { name: string }) => i.name.toLowerCase() )
        const lpinfo = lpbalancesByIndexMap[indexId]

        let indexBalances = tokens.reduce( (map, token ) => {
            map[ token.symbol ] = { 
                amount: BigNumber.from(0),
                value: BigNumber.from(0),
            }
            return map;
        }, {} as { [x: string]: { amount: BigNumber, value: BigNumber } } );


        // for all pools in the index
        poolids && poolids.forEach( (pooliId : string) => {

            const poolTokens = poolsBalances.pools[pooliId]
            const poolId = poolTokens.poolId
            const poolLPInfo = lpinfo.find( el => el.poolId === poolId)
            const lpBalance = poolLPInfo && poolLPInfo.lpBalance 
            const lpTotalSupply = poolLPInfo && poolLPInfo.lpTotalSupply 
            // console.log(" poolTokens:", poolTokens, ">> ", lpBalance, lpTotalSupply)

            poolTokens.tokens.map( (token : any) => {
                const haveBalance = token.balance && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
                const balance = haveBalance && token.balance.mul(lpBalance).div(lpTotalSupply)
                if (balance) {
                    // console.log("balance  ", indexId, token.tokenSymbol, balance.toString())
                    indexBalances[token.tokenSymbol].amount = indexBalances[token.tokenSymbol].amount.add(balance)
                }

                const haveValue = token.tokenValue && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
                const value = haveValue && token.tokenValue.mul(lpBalance).div(lpTotalSupply)
                if (value) {
                    // console.log("value  ", indexId, token.tokenSymbol, value.toString())
                    indexBalances[token.tokenSymbol].value = indexBalances[token.tokenSymbol].value.add(value)
                }
            })
        })
        
        return {
            indexId: indexId,
            indexesBalances: indexBalances
        }

    }).reduce( (acc, val) => {
        acc[val.indexId] = val.indexesBalances
        return acc
    }, {} as { [x: string]: any } )

    console.log("allaBalances: ", allaBalances)

    return allaBalances
}



const useLPBalancesForIndexes = (chainId: number, indexIds: string[], poolIds: string[]) => {


    // poolsInfo for all pools in indexIds indexes
    const poolsInfo =  PoolsInfo(chainId, poolIds) 

    // get the balance of all Indexes of the LP tokens of all Pools
    const indexesInfo = IndexesInfo(chainId,  indexIds)

    // [ Index x Pool ] addresses
    const lpTokensRequests = indexesInfo.flatMap( index =>  {
        return poolsInfo.map( pool => { 
            return {
                indexId: index.poolId,
                indexAddress: index.pool,
                poolId: pool.poolId,
                poolAddress: pool.pool
            }
        })
    })


    const calls1 = lpTokensRequests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'balanceOf',
        args: [req.indexAddress]
    })) ?? []
  

    const results1 = useCalls(calls1) ?? []
    results1.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'balanceOf' on ${calls1[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    // LP tokens supply
    const calls2 = lpTokensRequests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'totalSupply',
        args: []
    })) ?? []
  

    const results2 = useCalls(calls2) ?? []
    results2.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'balanceOf' on ${calls2[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    const lpBalanceResponse = lpTokensRequests.map( (req, idx) => {
        const balance =  results1[idx]?.value[0]
        const supply =  results2[idx]?.value[0]
        const precision = BigNumber.from(10000)

        const perc = (balance && supply && !supply.isZero()) ? precision.mul(balance).div(supply).toNumber() / 10000 : undefined

        return {
            lpBalance: balance,
            lpTotalSupply: supply,
            indexId: req.indexId,
            poolId: req.poolId,
            indexPerc: perc,
        }
    })

    const lpBalanceResponseByIndex = groupBy(lpBalanceResponse, b => b.indexId)
    const lpBalancees = Object.values(lpBalanceResponseByIndex)

    console.log("lpBalanceResponseByIndex; ", lpBalanceResponseByIndex )
    //console.log("lpBalancees; ", lpBalancees )

    return lpBalanceResponseByIndex
}


const useIndexPools = (chainId: number, poodIds: string[]) => {

    const calls = poodIds.map(poodId => ({
        contract: PoolContract(chainId, poodId),
        method: 'getPoolsInfo',  //getPoolsInfo  // getUsers
        args: [] 
    })) ?? []

    const results = useCalls(calls) ?? []

    console.log("getPoolsInfo: ", results)

    results.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'balanceOf' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

   
    // array of Indexes with array of associated pools
    
    const poolsForIndexes =  poodIds.map( (poolId, idx) => {
        const poolInfo = results.at(idx)?.value
        return {
            indexId: poolId,
            pools: poolInfo && poolInfo[0].map( (info : any) => {
                    return {
                        name: info.name,
                        poolAddress: info.poolAddress,
                        lpTokenAddress: info.lpTokenAddress,
                        weight: info.weight
                    }
            }),
        }
    })

    console.log("poolsForIndexes", poolsForIndexes)

    return poolsForIndexes
}


//  Returns the token balance for the account at every pool
//  indexPools params specifies either all regular pools or all index pools in a chain
export const useTokensInfoForPools = (chainId: number, poolIds: string[], tokens: Token[], account?: string) => {
 
    // get the pool addresses for all indexes or all regular pools in the chain
    const poolsInfo =  PoolsInfo(chainId, poolIds) 

    // get the prices for each token
    let tokenPriceMap = useTokenPrices(chainId, tokens)  // map of [ symbol => price ]


    // get LP tokens balances and totalSupplies of the account for every pool in poolsInfo
    const lpBalanceResponses = useLPBalances(chainId, account, poolsInfo)
    const lpBalances = lpBalanceResponses.reduce( (map, balance ) => {
        map[ balance.poolId ] = balance
        return map;
    }, {} as { [x: string]: any } );


    // the the balance of all tokens in all pools
    const poolsBalancesResponse = useTokensPoolsBalances(chainId, tokens, poolsInfo)

    const poolsBalanceWithTokenValues = poolsBalancesResponse.map ( pool => {
       
        const isDepositToken = (pool.tokenSymbol == pool.depositToken?.symbol)
        const feedPrice = isDepositToken ? 1 : tokenPriceMap[pool.tokenSymbol]
        let tokenValue 
        const canHaveTokenValue = pool.balance && feedPrice
        if (canHaveTokenValue) {
            const price = BigNumber.from(feedPrice)  
            tokenValue = isDepositToken ? pool.balance.mul(price) : 
                                        adjustAmountDecimals( pool.tokenDecimals, pool.depositToken!.decimals, pool.balance.mul(price).div(feedPrecision)  )// token_value := price * balance * LP%
            //console.log("poolBalances poolId: ", pool.poolId, pool.tokenSymbol, "balance:", balance.toString(), "tokenDecimals", pool.tokenDecimals, "price:", price.div(feedPrecision).toString(), "prev: ", prev.toString(), " add:", tokenValue.toString(), " >> tot: ", tot[pool.tokenSymbol].toString() )
        }    

        return { 
            ...pool, 
            tokenValue: tokenValue
        }
    })


    const balancesByPool = groupBy(poolsBalanceWithTokenValues, b => b.poolId)
    const poolBalances = Object.values(balancesByPool)

 
    // aggregate the token amounts (balances) across all pools by token symbol
    let initialBalanceValues = tokens.reduce( (map, token ) => {
        map[ token.symbol ] = BigNumber.from(0)
        return map;
    }, {} as { [x: string]: BigNumber } );

    const totalTokensBalances = poolBalances.reduce( (tot, pools) => {
         pools.forEach( pool => {

            const lpBalance : BigNumber | undefined = lpBalances[pool.poolId].lpBalance && BigNumber.from(lpBalances[pool.poolId].lpBalance) 
            const lpSupply : BigNumber | undefined = lpBalances[pool.poolId].lpTotalSupply && BigNumber.from(lpBalances[pool.poolId].lpTotalSupply)
            //console.log("pool: ", pool.poolId, "balance: ", pool.balance, "lpBalance", lpBalances[pool.poolId].lpBalance, "supply", lpBalances[pool.poolId].lpTotalSupply)
            const canHaveBalance = pool.balance && lpSupply && !lpSupply.isZero()
            if (canHaveBalance && lpBalance && account) {
                // if have the account it means we need to return the account balance
                const accountBalance = BigNumber.from(pool.balance).mul(lpBalance).div(lpSupply)
                tot[pool.tokenSymbol] = tot[pool.tokenSymbol].add(accountBalance)
            } else if (canHaveBalance) {
                // othewrwise return the total balance 
                const balance = BigNumber.from(pool.balance)
                tot[pool.tokenSymbol] = tot[pool.tokenSymbol].add(balance)
            } 
         })
         return tot
    }, initialBalanceValues )


    // aggregate the values (amount * price) of all tokens across all pools by token symbol
    let initialValueValues = tokens.reduce( (map, token ) => {
        map[ token.symbol ] = BigNumber.from("0")
        return map;
    }, {} as { [x: string]: BigNumber } );

    
    /// build maap of { token_symbol => dollar_value } across all pools
  
    const totalTokensValues = poolBalances.reduce( (tot, pools) => {
        pools.forEach(pool => {

            const lpBalance : BigNumber | undefined = lpBalances[pool.poolId].lpBalance && BigNumber.from(lpBalances[pool.poolId].lpBalance) 
            const lpSupply : BigNumber | undefined = lpBalances[pool.poolId].lpTotalSupply && BigNumber.from(lpBalances[pool.poolId].lpTotalSupply)
            //console.log("pool: ", pool.poolId, "balance: ", pool.balance, "lpBalance", lpBalances[pool.poolId].lpBalance, "supply", lpBalances[pool.poolId].lpTotalSupply)
            const canHaveTokenValue = pool.tokenValue && lpSupply && !lpSupply.isZero()

            if (canHaveTokenValue && lpBalance && account) {
                // if have the account it means we need to return the token value for the account
                const accountValue = BigNumber.from(pool.tokenValue).mul(lpBalance).div(lpSupply)
                tot[pool.tokenSymbol] = tot[pool.tokenSymbol].add(accountValue)
            } else if (canHaveTokenValue) {
                 // othewrwise return the total token value 
                tot[pool.tokenSymbol] = tot[pool.tokenSymbol].add(BigNumber.from(pool.tokenValue))
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
        return {
            poolId,
            tokens: balancesByPool[poolId],
            lpSupply: lpBalances[poolId].lpTotalSupply,
            lpBalance: lpBalances[poolId].lpBalance
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





// Returns an array containing balance infos for all Tokens[] in every Pool 
//     the array returned contains [ Token x Pool ] entries
//     each entry contains { poolId, tokenSymbol, balance, tokenDecimals, depositToken }
const useTokensPoolsBalances = (chainId : number, tokens: Token[],  poolsInfo: any[]) =>  {

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
            balance: results.at(idx)?.value[0], // BigNumber
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
        contract: PoolLPContract(chainId, req.poolId),
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


// Returns a map of  { token_symbol => price }
const useTokenPrices = (chainId : number, tokens: Token[] )  => {

    const feedContracts = FeedContractsForTokens(chainId)
    const tokenSymbols = Object.keys(feedContracts)

    const pricefeedCalls = tokenSymbols.map( symbol => {
        const contract = feedContracts[symbol]
        return {
            contract:  contract,  // FeedContract(chainId, info.poolId),
            method: 'latestAnswer',
            args: []
        }
    })

    const pricefeedResults = useCalls(pricefeedCalls) ?? []
    pricefeedResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'latestAnswer' on ${pricefeedCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    let tokenPriceMap = {} as { [x: string]: string }
    tokenSymbols.forEach((symbol, idx) => {
        tokenPriceMap[symbol.toUpperCase()] = pricefeedResults.at(idx)?.value.toString()
    })

    return tokenPriceMap
}

const adjustAmountDecimals = (tokenInDecimals: number, tokenOutDecimals: number, amountIn : BigNumber) : BigNumber => {

    const amountInAdjusted : BigNumber = (tokenOutDecimals >= tokenInDecimals) ?
            amountIn.mul( BigNumber.from(10 ** (tokenOutDecimals - tokenInDecimals))) :
            amountIn.div( BigNumber.from(10 ** (tokenInDecimals - tokenOutDecimals)))

    return amountInAdjusted;
}
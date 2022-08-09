
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

    const indexes = useTokensInfoForIndexes(chainId, [indexId], tokens, account)
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
    const lpbalancesByIndexMap = usePoolsLPBalancesForIndexes(chainId, indexIds, poolIds)

    // process all poolsBalances determining the allocation of the index in those pool
    const allaBalances = indexPools.map( item  => {

        const indexId = item.indexId as string
        const poolids = item.pools && item.pools.map( (i: { name: string }) => i.name.toLowerCase() )
        const lpinfo = lpbalancesByIndexMap[indexId]

        let indexBalances = tokens.reduce( (map, token ) => {
            map[ token.symbol ] = { 
                amount: BigNumber.from(0),
                value: BigNumber.from(0),
                decimals: token.decimals,
            }
            return map;
        }, {} as {[x: string]: { decimals: number, amount: BigNumber, value: BigNumber } } );

        // for all pools in the index
        poolids && poolids.forEach( (poolId : string) => {

            const poolTokens = poolsBalances[poolId]
            //const poolId = poolTokens.poolId
            const poolLPInfo = lpinfo.find( el => el.poolId.toLowerCase() === poolId.toLowerCase())
            const lpBalance = poolLPInfo && poolLPInfo.lpBalance 
            const lpTotalSupply = poolLPInfo && poolLPInfo.lpTotalSupply 
            // console.log("BBBBB indexId:", indexId, "poolId:", poolId, "poolLPInfo", poolLPInfo,  ">> lpBalance: ", lpBalance, "lpTotalSupply: ", lpTotalSupply)

            Object.keys(poolTokens).forEach( symbol => {
                
                const tokenInfo = poolTokens[symbol]

                const haveBalance = tokenInfo.balance && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
                const balance = haveBalance && tokenInfo.balance.mul(lpBalance).div(lpTotalSupply)
                if (balance) {
                    // console.log("balance  ", indexId, token.tokenSymbol, balance.toString())
                    indexBalances[symbol].amount = indexBalances[symbol].amount.add(balance)
                }

                const haveValue = tokenInfo.value && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
                const value = haveValue && tokenInfo.value.mul(lpBalance).div(lpTotalSupply)
                if (value) {
                    // console.log("value  ", indexId, token.tokenSymbol, value.toString())
                    indexBalances[symbol].value = indexBalances[symbol].value.add(value)
                }
            })
        })
        
        return {
            indexId: indexId,
            indexesBalances: indexBalances   // { symbol => { value, balance, } } of the quota of tokens owner by the Index across its Pools
        }

    }).reduce( (acc, val) => {
        acc[val.indexId] = val.indexesBalances
        return acc
    }, {} as { [x: string]: any } )


    const lpBalancesByIndex = useAccountLPBalancesForIndexes(chainId, indexIds, account)

    const balances = Object.keys(allaBalances).map( indexId => {

        const lpBalance = lpBalancesByIndex[indexId].lpBalance
        const lpTotalSupply = lpBalancesByIndex[indexId].lpTotalSupply

        const tokensBalances = {} as {[ x : string] : any }

        Object.keys(allaBalances[indexId]).forEach( symbol => {

            const balance = allaBalances[indexId][symbol].amount
            const value = allaBalances[indexId][symbol].value
            const decimals = allaBalances[indexId][symbol].decimals

            const haveBalance =  balance && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
            const accountBalance = haveBalance ? balance.mul(lpBalance).div(lpTotalSupply) : undefined
        
            const haveValue = value && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
            const accountValue = haveValue ? value.mul(lpBalance).div(lpTotalSupply) : undefined

            tokensBalances[symbol] = {
                indexId: indexId,
                symbol: symbol,
                decimals: decimals,
                balance: balance,
                value: value,
                accountBalance: accountBalance,
                accountValue: accountValue
            }
        })

        // console.log("tokensBalances",indexId,  tokensBalances)
        
        return {
            indexId: indexId,
            tokensBalances: tokensBalances
        }

    }).reduce( (acc, val) => {
         acc[val.indexId] = val.tokensBalances
        return acc
    }, {} as { [x: string]: any } )

    // console.log("lpBalancesByIndex", balances)

    return balances
}



// Returns the Index LP balances for for each Index
const useAccountLPBalancesForIndexes = (chainId: number, indexIds: string[], account?: string) => {

        // get the balance of all Indexes of the LP tokens of all Pools
        const indexesInfo = IndexesInfo(chainId,  indexIds)

        // Indexes addresses
        const lpTokensRequests = indexesInfo.map( index =>  {
            return {
                indexId: index.poolId,
                indexAddress: index.pool,
            }
        })

        const calls1 = lpTokensRequests.map(req => ({
            contract: PoolLPContract(chainId, req.indexId),
            method: 'balanceOf',
            args: account? [account] : []
        })) ?? []
      
    
        const results1 = useCalls(calls1) ?? []
        results1.forEach((result, idx) => {
            if(result && result.error) {
                console.error(`Error encountered calling 'balanceOf' on ${calls1[idx]?.contract.address}: ${result.error.message}`)
            }
        })
    
        // LP tokens supply
        const calls2 = lpTokensRequests.map(req => ({
            contract: PoolLPContract(chainId, req.indexId),
            method: 'totalSupply',
            args: []
        })) ?? []
      

        const results2 = useCalls(calls2) ?? []
        results2.forEach((result, idx) => {
            if(result && result.error) {
                console.error(`Error encountered calling 'totalSupply' on ${calls2[idx]?.contract.address}: ${result.error.message}`)
            }
        })


        const lpBalancesByIndex = lpTokensRequests.map( (req, idx) => {
            const balance =  results1[idx]?.value[0]
            const supply =  results2[idx]?.value[0]
            const precision = BigNumber.from(10000)

            const perc = (balance && supply && !supply.isZero()) ? precision.mul(balance).div(supply).toNumber() / 10000 : undefined
            
            // console.log("lpTokensRequests ",  req.indexId, balance?.toString(), supply?.toString())

            return {
                indexId: req.indexId,
                lpBalance: balance,
                lpTotalSupply: supply,
                indexPerc: perc,
            }
        }).reduce( (acc, item) => {
            acc[item.indexId] = item
            return acc
        }, {  }  as  { [ x : string] : any} )

        return lpBalancesByIndex
}



// Returns the Pool LP balances that each Index has for their Pools, grouped by indexid
const usePoolsLPBalancesForIndexes = (chainId: number, indexIds: string[], poolIds: string[]) => {


    // poolsInfo for all pools in indexIds indexes
    const poolsInfo = PoolsInfo(chainId, poolIds) 

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
        args: req.indexAddress? [req.indexAddress] : []
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
            console.error(`Error encountered calling 'totalSupply' on ${calls2[idx]?.contract.address}: ${result.error.message}`)
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
    // const lpBalancees = Object.values(lpBalanceResponseByIndex)
 
    return lpBalanceResponseByIndex
}


const useIndexPools = (chainId: number, poodIds: string[]) => {

    const calls = poodIds.map(poodId => ({
        contract: PoolContract(chainId, poodId),
        method: 'getPoolsInfo',  //getPoolsInfo  // getUsers
        args: [] 
    })) ?? []

    const results = useCalls(calls) ?? []

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
       
        const lpBalance : BigNumber | undefined = lpBalances[pool.poolId].lpBalance && BigNumber.from(lpBalances[pool.poolId].lpBalance) 
        const lpSupply : BigNumber | undefined = lpBalances[pool.poolId].lpTotalSupply && BigNumber.from(lpBalances[pool.poolId].lpTotalSupply)

        const isDepositToken = (pool.tokenSymbol == pool.depositToken?.symbol)
        const feedPrice = isDepositToken ? 1 : tokenPriceMap[pool.tokenSymbol]

        const canHaveTokenValue = pool.balance && feedPrice
        const value = canHaveTokenValue && isDepositToken ? pool.balance.mul(BigNumber.from(feedPrice)) :
                                    (canHaveTokenValue) ? adjustAmountDecimals( pool.tokenDecimals, pool.depositToken!.decimals, pool.balance.mul(BigNumber.from(feedPrice)).div(feedPrecision)  ) : undefined

        const canHaveAccountBalance = pool.balance && lpBalance && lpSupply && !lpSupply.isZero()
        const accountBalance = canHaveAccountBalance && pool.balance.mul(lpBalance).div(lpSupply)

        const canHaveAccountValue = value && lpBalance && lpSupply && !lpSupply.isZero()
        const accountValue = canHaveAccountValue && value.mul(lpBalance).div(lpSupply)

        return {
            poolId: pool.poolId,
            symbol: pool.tokenSymbol,
            decimals: pool.tokenDecimals,
            balance: pool.balance,
            value: value,
            accountBalance: accountBalance,
            accountValue: accountValue,
        }
    })

    const balancesByPoolId = groupBy(poolsBalanceWithTokenValues, b => b.poolId)

    let poolBalances = {} as {[ x: string] : any}

    Object.keys(balancesByPoolId).forEach( poolId => {
        const tokenMap = balancesByPoolId[poolId].reduce ( (acc, val) => {
            acc[val.symbol] = val
            return acc
        }, {} as {[ x: string] : any} )
        
        poolBalances[poolId] = tokenMap
    })

    return poolBalances
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
        args: req.poolAddress? [req.poolAddress] : []
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
        args: req.account? [req.account] : []
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
import { Token } from "../../types/Token"
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { roiDataForPrices } from "./poolRoiCalculator"
import { RoiInfo, RoiInfoForPool } from "../../types/RoiInfo"
import { BigNumber } from "ethers"

/**
 * Given the PoolTokensSwapsInfo[] array containing info about all the trades for all the Pool in an Index,
 * returns the array RoiInfo[] containing aggregated data about the assets in the of the Index and its performance (e.g ROI)
 * at different point in time .
 * This allows to produce charts about the Index status and performance over time.
 * 
 * @param swapsInfo an array with the info about the trades for each Pool in the Index
 * @param depositToken 
 * @param investTokens 
 * @param initialInvestment 
 * @param maxItems 
 * 
 * @returns the array of RoiInfo[] with the Index information chronologically ordered 
 */

export const roiDataForSwaps = (
        swapsInfo : PoolTokensSwapsInfo[], 
        depositToken: Token, 
        investTokens: Token[],
        initialInvestment: number = 100,
        maxItems?: number
    ) : RoiInfo[] => {

    
    // the the roi data for each pool
    const poolsROI : RoiInfoForPool[][] = swapsInfo.map( (item : PoolTokensSwapsInfo) => {
        const investToken = investTokens.find( it => it.symbol.toLowerCase() === item.priceInfo?.symbol.toLowerCase())
        
        const poolROI = investToken && roiDataForPrices(item.swaps, item.priceInfo?.price ?? BigNumber.from("0"), item.priceInfo?.timestamp ?? 0, depositToken, investToken, initialInvestment)
        const respone = poolROI?.map( it => { 
            return { ...it, poolId: item.poolId } as RoiInfoForPool
        }) ?? []
        return respone
    })


    let indexROI : RoiInfo[] = []

    // the total weight of all pools in the Index
    const totalWeight = swapsInfo.map( it => it.weight )
                                 .reduce( (acc, val) => { return  acc + val } , 0)

    // list of swaps for the first timestamp (after ts 0) to use to calculate ROI
    let roiInfos = findNextROIInfo(poolsROI, 0)

    // a map of the last swap applied for each pool in the Index, identified by the idx in the swapsInfo array
    let poolIdToSwapInfoMap : { [poolId: string]: RoiInfoForPool } = {} 

    while (roiInfos.length > 0) {

        if (indexROI.length === 0) {
            // calculate first data point weighting contribution by each pool
            let first : RoiInfo = {
                date: 0,
                buyAndHoldValue: 0,
                buyAndHoldROI: 0,
                strategyROI: 0,
                strategyValue: 0,
                investTokenPerc: 0,
                depositTokenPerc: 0
            }

            let tot = 0

            roiInfos.forEach( (it, idx) => {  
               const poolWeight = (swapsInfo.find( el =>  el.poolId === it.poolId )?.weight ?? 0) / totalWeight
               tot += poolWeight
               
               first.date = it.date
               first.buyAndHoldROI += (it.buyAndHoldROI * poolWeight)
               first.buyAndHoldValue += (it.buyAndHoldValue * poolWeight)
               first.strategyROI += (it.strategyROI * poolWeight)
               first.strategyValue += (it.strategyValue * poolWeight)

               first.investTokenPerc += it.investTokenPerc * poolWeight
               first.depositTokenPerc += it.depositTokenPerc * poolWeight

               // remember the ROI info for pool of idx poolIndex
               poolIdToSwapInfoMap[ it.poolId ] = it
            })

            if (tot < 1) {
                const initialValueLeft = initialInvestment * (1 - tot)
                first.buyAndHoldValue += initialValueLeft
                first.strategyValue += initialValueLeft

                first.depositTokenPerc = 1 - first.investTokenPerc 
            }
            indexROI.push(first)

        } else {

            // calculate subsequent data points weighting contribution by each pool
            // starting from the prior data point

            // initialize next data point with the prior data point
            let next =  {
                date : indexROI[indexROI.length-1].date,
                buyAndHoldROI: indexROI[indexROI.length-1].buyAndHoldROI,
                buyAndHoldValue: indexROI[indexROI.length-1].buyAndHoldValue,
                strategyROI: indexROI[indexROI.length-1].strategyROI,
                strategyValue: indexROI[indexROI.length-1].strategyValue,

                investTokenPerc: indexROI[indexROI.length-1].investTokenPerc,
                depositTokenPerc: indexROI[indexROI.length-1].depositTokenPerc,
            }

            // process all roi data points for the next timestamp and update the roi info
            // replacing the previous roi values for a pool with the latest ones
            roiInfos.forEach( (it, idx) => {

                const poolWeight = (swapsInfo.find( el =>  el.poolId === it.poolId )?.weight ?? 0) / totalWeight

                // subtract the contribution of the current pool
                const prevSwaps = poolIdToSwapInfoMap[it.poolId]
                if (prevSwaps) {
                    next.buyAndHoldROI -= (prevSwaps.buyAndHoldROI * poolWeight)
                    next.buyAndHoldValue -= (prevSwaps.buyAndHoldValue * poolWeight)
                    next.strategyROI -= (prevSwaps.strategyROI * poolWeight)
                    next.strategyValue -= (prevSwaps.strategyValue * poolWeight)

                    next.investTokenPerc -= (prevSwaps.investTokenPerc * poolWeight)
                    next.depositTokenPerc -= (prevSwaps.depositTokenPerc * poolWeight)
                }

                // add the contribution of the current pool
                next.date = it.date
                next.buyAndHoldROI += (it.buyAndHoldROI * poolWeight)
                next.buyAndHoldValue += (it.buyAndHoldValue * poolWeight)
                next.strategyROI += (it.strategyROI  * poolWeight)
                next.strategyValue += (it.strategyValue  * poolWeight)

                next.investTokenPerc += (it.investTokenPerc  * poolWeight)
                next.depositTokenPerc += (it.depositTokenPerc  * poolWeight)

                // remember the ROI info for pool of idx poolIndex
                poolIdToSwapInfoMap[ it.poolId ] = it
             })
           
             indexROI.push(next)
        }

        // get next swaps
        const ts = roiInfos[0].date
        roiInfos = findNextROIInfo(poolsROI, ts)
    }


    let response : RoiInfo[] = []

    if (maxItems && indexROI.length > maxItems) {
        const skip = Math.round(indexROI.length / maxItems)
        indexROI.forEach((it, idx) => {
            if (idx % skip == 0) {
                response.push(it)
            }
        })
        // ensure the last ROI item is always included in the reposne
        if (indexROI.length % skip > 0) {
            response.push(indexROI[indexROI.length-1])
        }
    } else {
        response = [...indexROI]
    }
    
    return response
}


// Re-arrange the RoiInfoForPool[][] into a map of { timestamp =>  RoiInfoForPool[] }
// Returns an object having: 
// - as keys the timestamps of all RoiInfoForPool in input 
// - as values the RoiInfoForPool[] with that same timestamp chronologically ordered
const joinRoiInfoArrays = (infoArrays: RoiInfoForPool[][])  => {

    let res = {} as { [ x : number] : RoiInfoForPool[] }

    infoArrays.forEach( infoArray => {
        infoArray.forEach( it => {
            let v = res[ it.date ] ?? []
            v.push(it)
            res[it.date] = v
        })
    })

    return res
}



// Returns an array of RoiInfo for the trades happend after the provided 'timestamp'. 
const findNextROIInfo = (roiInfoArray: RoiInfoForPool[][], timestamp: number) : RoiInfoForPool[] => {
    const roiMap = joinRoiInfoArrays(roiInfoArray)
    const timestamps = Object.keys(roiMap).map(it => Number(it)).sort()
    const nextTimestamp = timestamps.find( it => (it > timestamp) )
   
    return nextTimestamp ? roiMap[nextTimestamp] : []
}
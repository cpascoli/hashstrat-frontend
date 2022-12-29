import { Token } from "../../types/Token"
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { roiDataForSwaps as poolRoiDataForSwaps} from "./poolRoiCalculator"


export type SwapInfo = {
    timestamp: string,
    side: "BUY" | "SELL",
    feedPrice: string,
    bought: string,
    sold: string,
    depositTokenBalance: string,
    investTokenBalance: string
}


type RoiInfo = {
    date: number;
    strategyROI: number;
    strategyValue: number;
    buyAndHoldROI: number;
    buyAndHoldValue: number;
    poolIndex?: number
}

export const roiDataForSwaps = (swapsInfo : PoolTokensSwapsInfo[],  depositToken: Token, investTokens: Token[] ) => {

    console.log("IndexRoiDataForSwaps - swapsInfo:", swapsInfo)

    // A model investment of $100
    const initialInvestment = 100 
    let riskAssetAmount = 0;
    let stableAssetAmount = initialInvestment

    // swaps: SwapInfo[], price: number, priceTimestamp: number, depositToken: Token, investToken: Token) => {

    const poolsROI : RoiInfo[][] = swapsInfo.map( item => {
        const investToken = investTokens.filter( it => it.symbol.toLowerCase() === item.priceInfo.symbol.toLowerCase())[0]
        const poolROI = poolRoiDataForSwaps(item.swaps, item.priceInfo.price, item.priceInfo.timestamp, depositToken, investToken )

        return poolROI
    })

    console.log("IndexRoiDataForSwaps - poolsROI:", poolsROI)

    let indexROI : RoiInfo[] = []

    const poolWeights = swapsInfo.map( it => it.weight )
    const totalWeight = poolWeights.reduce( (acc, val) => { return  acc + val} , 0)

    // list of swaps
    let swaps = findNextROIInfo(poolsROI, 0)

    // a map of the last swap applied for each poolIdx in the Index
    let poolIdToSwapInfoMap : { [poolId: number]: RoiInfo } = {} 

    while (swaps.length > 0) {

        if (indexROI.length === 0) {
            // calculate first data point weighting contribution by each pool
            let first = {
                date : 0,
                buyAndHoldValue: 0,
                buyAndHoldROI: 0,
                strategyROI: 0,
                strategyValue: 0
            }
            swaps.forEach( it => {            
               const poolWeight =  swapsInfo[it.poolIndex!].weight / totalWeight
               first.date = it.date
               first.buyAndHoldROI += (it.buyAndHoldROI * poolWeight)
               first.buyAndHoldValue += (it.buyAndHoldValue * poolWeight)
               first.strategyROI += (it.strategyROI  * poolWeight)
               first.strategyValue += (it.strategyValue  * poolWeight)

               // remember the ROI info for pool of idx poolIndex
               poolIdToSwapInfoMap[ it.poolIndex! ] = it
            })
    
            indexROI.push(first)
        } else {

            // calculate subsequent data points weighting contribution by each pool
            // stating from the prior data point

            // initialize next data point with the prior data point
            let next =  {
                date : indexROI[indexROI.length-1].date,
                buyAndHoldROI: indexROI[indexROI.length-1].buyAndHoldROI,
                buyAndHoldValue: indexROI[indexROI.length-1].buyAndHoldValue,
                strategyROI: indexROI[indexROI.length-1].strategyROI,
                strategyValue: indexROI[indexROI.length-1].strategyValue,
            }

            swaps.forEach( it => {
                const poolWeight =  swapsInfo[it.poolIndex!].weight / totalWeight

                // subtract the contribution of the current pool
                const prevSwaps = poolIdToSwapInfoMap[it.poolIndex!]
                if (prevSwaps) {
                    next.buyAndHoldROI -= (prevSwaps.buyAndHoldROI * poolWeight)
                    next.buyAndHoldValue -= (prevSwaps.buyAndHoldValue * poolWeight)
                    next.strategyROI -= (prevSwaps.strategyROI  * poolWeight)
                    next.strategyValue -= (prevSwaps.strategyValue  * poolWeight)
                }

                // add the contribution of the current pool
                next.date = it.date
                next.buyAndHoldROI += (it.buyAndHoldROI * poolWeight)
                next.buyAndHoldValue += (it.buyAndHoldValue * poolWeight)
                next.strategyROI += (it.strategyROI  * poolWeight)
                next.strategyValue += (it.strategyValue  * poolWeight)

                // remember the ROI info for pool of idx poolIndex
                poolIdToSwapInfoMap[ it.poolIndex! ] = it
             
             })

             indexROI.push(next)

        }

        // get next swaps
        const ts = swaps[0].date
        swaps = findNextROIInfo(poolsROI, ts)
    }

    return indexROI
}


const findNextROIInfo= (swaps: RoiInfo[][], timestamp: number) : RoiInfo[] => {

    // the ROI info for the trades happend aftr 'timestamp'. 
    // It can be more than one if they have the same timestamp (e.g, haappened on the same block)
    let nextSwaps : RoiInfo[] = []
    let found : number | undefined

    swaps.forEach( (poolSwaps, idx) => {
        poolSwaps.forEach( it => {
            if ( (nextSwaps.length === 0 && it.date > timestamp) || (found !== undefined && it.date === found) ) {
                nextSwaps.push({
                    ...it,
                    poolIndex: idx
                })
                found = it.date
            }
        })
    })

    return nextSwaps
}
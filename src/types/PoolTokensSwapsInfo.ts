import { SwapInfo } from "./SwapInfo"

export type PoolTokensSwapsInfo = {
    poolId: string,
    weight: number,
    priceInfo: {
        symbol: string,
        price: string,
        timestamp: number,
    },
    swaps: SwapInfo[]
}

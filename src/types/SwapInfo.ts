export type SwapInfo = {
    timestamp: string,
    side: "BUY" | "SELL",
    feedPrice: string,
    bought: string,
    sold: string,
    depositTokenBalance: string,
    investTokenBalance: string
}

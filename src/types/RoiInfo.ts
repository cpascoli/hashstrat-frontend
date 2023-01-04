export type RoiInfo = {
    date: number;
    strategyROI: number;
    strategyValue: number;
    buyAndHoldROI: number;
    buyAndHoldValue: number;
   
}

type PoolId = {
    poolId: string;
}

export type RoiInfoForPool =  RoiInfo & PoolId;




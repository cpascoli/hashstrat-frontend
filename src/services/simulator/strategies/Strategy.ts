
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo"


export interface Strategy {

    simulate(from: Date, to: Date, amount: number) : PoolTokensSwapsInfo | undefined 

}
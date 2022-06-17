


import { BigNumber } from 'ethers'

export const formatAmount = (amount: BigNumber, decimals: Number, precision: Number) => {

    const decimalsFactor =  BigNumber.from('10').pow( BigNumber.from(decimals) ); 
    const precisionFactor =  BigNumber.from('10').pow(BigNumber.from(precision)); 
    const number = BigNumber.from(amount).mul(precisionFactor).div(decimalsFactor).toNumber()
    const decimal = number / precisionFactor.toNumber()
    
    return decimal.toString()
}
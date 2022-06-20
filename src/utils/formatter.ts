


import { BigNumber } from 'ethers'

export const fromDecimals = (amount: BigNumber, decimals: Number, precision: Number) => {
    const decimalsFactor =  BigNumber.from('10').pow( BigNumber.from(decimals) ); 
    const precisionFactor =  BigNumber.from('10').pow(BigNumber.from(precision)); 
    const number = BigNumber.from(amount).mul(precisionFactor).div(decimalsFactor).toNumber()
    const decimal = number / precisionFactor.toNumber()
    
    return decimal.toString()
}

export const toDecimals = (amount: string | number, decimals: Number) => {
    const decimalsFactor =  BigNumber.from('10').pow( BigNumber.from(decimals) ); 
    const formatted = BigNumber.from(amount.toString()).mul(decimalsFactor)
    return formatted.toString()
}


export const shortenAccount = (account?: string) => {
    if (!account) return "n/a"
    return account.substring(0, 6) + "..." + account.substring(38)
}
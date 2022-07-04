


import { BigNumber, ethers } from 'ethers'

export const fromDecimals = (amount: BigNumber, decimals: Number, precision: Number) => {

    const decimalsFactor =  BigNumber.from('10').pow( BigNumber.from(decimals) ); 
    const precisionFactor =  BigNumber.from('10').pow(BigNumber.from(precision)); 
    const number = BigNumber.from(amount).mul(precisionFactor).div(decimalsFactor)
    const decimal = number.toNumber() / precisionFactor.toNumber()

    return decimal.toString()
}

export const toDecimals = (amount: string | number, decimals: number) => {

    console.log("toDecimals 1 ", amount, typeof amount, "decimals: ", decimals)
    const formatted = ethers.utils.parseUnits(amount.toString(), decimals)
    // const decimalsFactor =  BigNumber.from('10').pow( BigNumber.from(decimals) ); 
    // const formatted = BigNumber.from(Number(amount)).mul(decimalsFactor)
    console.log("toDecimals 2 ", amount, typeof amount, "decimals: ", decimals," >> ", formatted.toString())

    return formatted.toString()
}


export const shortenAccount = (account?: string) => {
    if (!account) return "n/a"
    return account.substring(0, 6) + "..." + account.substring(38)
}

export const round = (n : number, d=2) => {
    return Math.round(n * (10**d)) / (10**d)
}

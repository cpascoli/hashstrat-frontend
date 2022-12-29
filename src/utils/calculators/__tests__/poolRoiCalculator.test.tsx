
import {  roiDataForSwaps as poolRoiDataForSwaps  } from '../poolRoiCalculator';

import { Token } from '@src/types/Token';
import { SwapInfo } from '@src/types/SwapInfo';
import chai, {expect} from "chai";


import swaps_btc from "./swaps_btc.json"

describe("Testing poolRoiDataForSwaps", () => {

    const depositToken : Token = {
        "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "symbol": "USDC",
        "decimals": 6,
        "image": ""
    }
    
    const investToken : Token = {
        "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        "symbol": "WETH",
        "decimals": 18,
        "image": ""
    }


    describe("When no price move", () => {
        const firstTimestamp = 1666949934
        const latestTimestamp = 1671618365
        const roiInfo = poolRoiDataForSwaps(
            [{
                "timestamp": `${firstTimestamp}`,
                "side": "BUY",
                "feedPrice": "150000000000",
                "bought": "220763138745855471",
                "sold": "333333334",
                "depositTokenBalance": "1333333332",
                "investTokenBalance": "220763138745855471"
            }],

            "150000000000",
            latestTimestamp,
            depositToken,
            investToken
        )

        it('Has expected dates', () => {
            // expect(sum(2, 2)).toEqual(4);
            expect( roiInfo[0]['date'] ).to.be.equal( firstTimestamp );
            expect( roiInfo[1]['date'] ).to.be.equal( latestTimestamp );
        });

        it('Has zero ROI', () => {
            expect( roiInfo[1]['strategyROI'] ).to.be.equal( 0 );
            expect( roiInfo[1]['buyAndHoldROI'] ).to.be.equal( 0 );
        });

        it('Has $100 model investment', () => {
            expect( roiInfo[0]['strategyValue'] ).to.be.equal( 100 );
            expect( roiInfo[1]['buyAndHoldValue'] ).to.be.equal( 100 );
        });


    });

    describe("When price doubles", () => {
        describe("pool is all invested", () => {
            const firstTimestamp = 1666949934
            const latestTimestamp = 1671618365
            const roiInfo = poolRoiDataForSwaps(
                [{
                    "timestamp": `${firstTimestamp}`,
                    "side": "BUY",
                    "feedPrice": "150708740861",
                    "bought": "220763138745855471",
                    "sold": "333333334",
                    "depositTokenBalance": "0",
                    "investTokenBalance": "220763138745855471"
                }],

                "301417481722",
                latestTimestamp,
                depositToken,
                investToken
            )

            it('Has 100% ROI', () => {
                expect( roiInfo[1]['strategyROI'] ).to.be.equal( 100 );
                expect( roiInfo[1]['buyAndHoldROI'] ).to.be.equal( 100 );
            });

        });

        describe("pool is half cash", () => {
            const firstTimestamp = 1666949934
            const latestTimestamp = 1671618365
            const roiInfo = poolRoiDataForSwaps(
                [{
                    "timestamp": `${firstTimestamp}`,
                    "side": "BUY",
                    "feedPrice": "150708740861",
                    "bought": "220763138745855471",
                    "sold": "333333334",
                    "depositTokenBalance": "333333334",
                    "investTokenBalance": "220763138745855471"
                }],

                "301417481722",
                latestTimestamp,
                depositToken,
                investToken
            )

            it('Has 100% ROI', () => {
                expect( roiInfo[1]['strategyROI'] ).to.be.equal( 50 );
                expect( roiInfo[1]['buyAndHoldROI'] ).to.be.equal( 100 );
            });
        });

        describe("pool is all cash", () => {
            const firstTimestamp = 1666949934
            const latestTimestamp = 1671618365
            const roiInfo = poolRoiDataForSwaps(
                [{
                    "timestamp": `${firstTimestamp}`,
                    "side": "SELL",
                    "feedPrice": "150708740861",
                    "bought": "333333334",
                    "sold": "220763138745855471",
                    "depositTokenBalance": "333333334",
                    "investTokenBalance": "0"
                }],

                "301417481722",
                latestTimestamp,
                depositToken,
                investToken
            )

            it('Has 100% ROI', () => {
                expect( roiInfo[1]['strategyROI'] ).to.be.equal( 0 );
                expect( roiInfo[1]['buyAndHoldROI'] ).to.be.equal( 100 );
            });
        });
    });


    describe("When price halves", () => {
        describe("pool is all invested", () => {
            const firstTimestamp = 1666949934
            const latestTimestamp = 1671618365
            const roiInfo = poolRoiDataForSwaps(
                [{
                    "timestamp": `${firstTimestamp}`,
                    "side": "BUY",
                    "feedPrice": "150708740862",
                    "bought": "220763138745855471",
                    "sold": "333333334",
                    "depositTokenBalance": "0",
                    "investTokenBalance": "220763138745855471"
                }],

                "75354370431",
                latestTimestamp,
                depositToken,
                investToken
            )

            it('Has 100% ROI', () => {
                expect( roiInfo[1]['strategyROI'] ).to.be.equal( -50 );
                expect( roiInfo[1]['buyAndHoldROI'] ).to.be.equal( -50 );
            });

        });

        describe("pool is half cash", () => {
            const firstTimestamp = 1666949934
            const latestTimestamp = 1671618365
            const roiInfo = poolRoiDataForSwaps(
                [{
                    "timestamp": `${firstTimestamp}`,
                    "side": "BUY",
                    "feedPrice": "150708740862",
                    "bought": "220763138745855471",
                    "sold": "333333334",
                    "depositTokenBalance": "333333334",
                    "investTokenBalance": "220763138745855471"
                }],

                "75354370431",
                latestTimestamp,
                depositToken,
                investToken
            )

            it('Has 100% ROI', () => {
                expect( roiInfo[1]['strategyROI'] ).to.be.equal( -25 );
                expect( roiInfo[1]['buyAndHoldROI'] ).to.be.equal( -50 );
            });
        });

        describe("pool is all cash", () => {
            const firstTimestamp = 1666949934
            const latestTimestamp = 1671618365
            const roiInfo = poolRoiDataForSwaps(
                [{
                    "timestamp": `${firstTimestamp}`,
                    "side": "SELL",
                    "feedPrice": "150708740862",
                    "bought": "333333334",
                    "sold": "220763138745855471",
                    "depositTokenBalance": "333333334",
                    "investTokenBalance": "0"
                }],

                "75354370431",
                latestTimestamp,
                depositToken,
                investToken
            )

            it('Has 100% ROI', () => {
                expect( roiInfo[1]['strategyROI'] ).to.be.equal( 0 );
                expect( roiInfo[1]['buyAndHoldROI'] ).to.be.equal( -50 );
            });
        });
    });



    describe("When mutliple trades", () => {
        const latestTimestamp = 1665092506
        const roiInfo = poolRoiDataForSwaps(swaps_btc as SwapInfo[],
            "1993288000000",
            latestTimestamp,
            depositToken,
            investToken
        )

        it('Calculates all strategy ROI values', () => {
            const strategyROI = roiInfo.map( it => it.strategyROI ).slice(0, 9)
            expect( strategyROI ).to.eql( [-0, -0.28, -1.5, 2.13, -0.76, -2.96, -1.79, -1.44, -0.03] );
        });

        it('Calculates all buy and hold ROI values', () => {
            const buyAndHoldROI = roiInfo.map( it => it.buyAndHoldROI ).slice(0, 9)
            console.log("buyAndHoldROI: ", buyAndHoldROI)
            expect( buyAndHoldROI ).to.eql( [0, -1.41, -6.48, 6.43, -2.73, -9, -5.98, -5.16, -2.02] );
        });
    });

});




const depositToken : Token = {
    "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "symbol": "USDC",
    "decimals": 6,
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADQ0lEQVR4XtXZMW4UQRCFYY7AEZyZC3ABTsAFOAEJiSVHhKQEJISkXAGRI5AQQrLkAAmRmBCcEBAZjYVX8rdV3bUzs7PjX/qTfa97unqN2LXv3VuI45OPP45PPl0VvXT9nSMYapLuv1o8+Nz6vFWw44/3XK7jn0lwsEX1PIvhQQ6t59srPnwtes7Z8YFr1XPPgg9Zu55/Em6+q6dvv2+91vPxy7Orh88/b72+i84xCjetKuY9xbyq8+yEm1XMsNczw15F5yrjRi3fn/32rLew37PF+c8/W/2WzlXCTVr2sF+1h/2WztfExS1b2B1rC7stnTPFhZkZ9uYyw16mc4a4KDPDXqaYZ2bYy3TeW1S/1WXYaynmLTPsZTr3BouRGfZ6innPDHuRzr3BYmSEnYpiXjHCTuTRsy/3nX3R4aO9zKtG2Il0/lEXYN6ziut6innk5OEH7GSOwT1aRtiJnHQB5i3H4j4txTyyfAERdjIj7GTdJ6/PtzqZEXZ09AWYtxRzFfOWYq7/h+9/+BHzzOEdFDsq5i3FPLL77j998819tzqZr95duHSrM6cyfEW3o90LEPOeYj63Yq6LX8AN9uZSzPVgFxDh2jGKue79AqI9KrhHVTHXRS4g26uH6yuKuS56ATcOv/Ov4tqeYq4HuYDIi19/fdQ19nqKua7mAm6MsNNSzHV1FxD9fcFOSzHX4QIufVHFPFPMM8U8U8wj9/plSMwjI+xkirnu/dtghB0V85ZirqMvYMBOZoSdMV2NsKPlCxgU88xd/s8X92op5pGbC6hcQoSdlrvi+pYRdvTW8JULGBTznhVcU1HMI53/GksaYaeqmFeNsKMPTj8cOfs1FiMj7FQU84oRdiKde8Nx4UPRYISdnmLeM8JOpnPfwnJkhr2WYt4yw16k84a4KDLD3txm2IsM/yga4cLMFnan2sJupnM2cXFmD/u72sN+pvOVcJOWPez37PHoxdetNZnOVcaNeraw27OF3Z7OtRNuVjHCTs8IOxWdZxRuWnXK4aesvdE5JuHma9fzz4IPWauee3Z84Fr0nHvFhx9az7cYHmRpyx9v94mHWkrPcXCGd8NDzm36y4y14cGn6v53Dgfq6fp98Q/twpmau6HU4QAAAABJRU5ErkJggg=="
}

const investToken : Token = {
    "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    "symbol": "WETH",
    "decimals": 18,
    "image": "data:image/png;base64,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"
}

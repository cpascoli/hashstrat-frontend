


import { Button, Typography, makeStyles, Menu, MenuProps, MenuItem, Divider, Hidden } from  "@material-ui/core"
import { NetworkExplorerHost, PoolAddress, PoolLPTokenAddress, StrategyAddress, FeedAddress } from "../utils/network"
import { useMatch } from "react-router-dom"
import { Link } from "react-router-dom"

import brainDark from "./img/brain-dark.png"
import brainLignt from "./img/brain-light.png"


const useStyle = makeStyles( theme => ({
    container: {
        margin: "auto",
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        color: theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.grey[100],
        paddingBottom: theme.spacing(0),
        backgroundColor: theme.palette.type === 'light' ? '#ffffff' : '#333333',
    },

    topSection: {
        padding: theme.spacing(1),
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(0),
        minWidth: 300,
    },

    titleSection: {
        textAlign: "center",
        maxWidth: 480
    },
    banner: {
        margin:0,
        fontWeight: 200,
        fontSize: "2.2rem",
        textAlign: "center",
    },
    message: {
        fontWeight: 100,
        fontSize: "1.2rem",
        textAlign: "center",
        color: theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.grey[100],
    },
    imageLarge: {
        content:`url(  ${theme.palette.type === 'light' ? brainLignt : brainDark } )`,
        border: `1px solid ${theme.palette.type === 'light' ? 'black' : 'white' }`,
        maxWidth: 400,
        [theme.breakpoints.down('sm')]: {
            display: "none"
        },
    },
    imagePhone: {
        content:`url(  ${theme.palette.type === 'light' ? brainLignt : brainDark } )`,
        border: `1px solid ${theme.palette.type === 'light' ? 'black' : 'white' }`,
        maxWidth: '100%',
        marginBottom: 20,
        [theme.breakpoints.up('sm')]: {
            display: "none"
        },
    },
    contracts: {
        padding: theme.spacing(1),
        display: "flex",
        gap: theme.spacing(2),
        // justifyContent: "space-around",
        // maxWidth: 900

    },

}))


export interface HomeProps {
    chainId: number,
}


export const Home = ( { chainId } : HomeProps ) => {

    const classes = useStyle()
    const matchHome = useMatch("/")

    const explorerHost = NetworkExplorerHost(chainId) ?? "polygonscan.com"
    const poolAddress = PoolAddress(chainId)
    const strategyAddress = StrategyAddress(chainId)
    const lpTokenAddress = PoolLPTokenAddress(chainId)


    const poolLink = `https://${explorerHost}/address/${poolAddress}#code` 
    const strategyLink = `https://${explorerHost}/address/${strategyAddress}#code` 
    const lpTokenLink = `https://${explorerHost}/address/${lpTokenAddress}#code` 

    console.log("Home - poolLink", poolLink)


    return (
        <div className={classes.container}>

             <section className={classes.topSection}>
                
                <div className={classes.titleSection}> 
                    <div>
                        <p className={classes.banner}>
                            HashStrat, a crypto investment fund on the blockchain. 
                        </p>
                        <p className={classes.message}>
                            Decentralised, automated, investment strategies for different levels of risk <br/>
                        </p>
                    </div>
                    <Link to="/pool" style={{ textDecoration: 'none' }} > 
                        <Button variant="contained" color="secondary" style={{ width: 280, height: 40 }} >Start the dapp </Button>
                    </Link>
                 </div>

                <img className={classes.imageLarge} />
             </section>

             <Divider style={{marginTop: 30, marginBottom: 30}} />

            <section>
                <img className={classes.imagePhone} />
                <Typography variant="body1">
                    <strong> How does it work?</strong>
                </Typography>
           
                <br/>
                <Typography variant="body2">
                    HashStrat allows to allocate capital to transparent, immutable investment strategies executed on-chain. 
                </Typography>
                <br/>
                <Typography variant="body2">
                    Different strategies appeal to different levels of risk and it's possible to tweak our risk/reward further by allocating to an index over multiple strategies.  
                </Typography>
                <br/>
                <Typography variant="body2">
                    For example, a rebalancing strategy over a portfolio of a risky asset and a stable asset could target a 60%/40% allocation to each.
                    <br/>
                    When moves in the price of the risky assets determine a significant imbalance in the portfolio, the strategy would rebalance it to the target allocations.
                </Typography>
            </section>

            <Divider style={{marginTop: 30, marginBottom: 30}} />

            <section>
                <Typography variant="body1">
                    <strong> Contracts</strong>
                </Typography>

                <div className={classes.contracts}>
                    <a href={poolLink}>ETH/USDC Pool</a>
                    <a href={strategyLink}>Rebalancing Strategy</a>
                    <a href={lpTokenLink}>LP Token</a>
                </div>

            </section>

        </div>
    )
}
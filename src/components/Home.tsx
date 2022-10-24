


import { Button, Typography, makeStyles,  Divider, Link, Box, styled } from  "@material-ui/core"
import { Link as LinkRouter} from "react-router-dom"

import { InfoBox } from "./InfoBox"

import brainDark from "./img/brain-dark.png"
import brainLignt from "./img/brain-light.png"
import key from "./img/key.svg"
import automated from "./img/automated.svg"
import lock from "./img/lock.svg"
import dao from "./img/dao.svg"

const useStyle = makeStyles( theme => ({

    topSection: {
        marginTop: 20,
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
        display: "flex",
        justifyContent: "space-around",
    },

    midSection: {
        margin: "auto",
        paddingTop: 0,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 40,
        color: theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.grey[100],
    },

    bottomSecion: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: theme.spacing(0),
        // border: "1px solid black "

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: "1fr",
        },
    },


    titleSection: {
        textAlign: "center",
        maxWidth: 480,
        paddingLeft: 10,
        paddingRight: 10,
    },
    title: {
        margin: 0,
        fontWeight: 200,
        fontSize: "2.1rem",
        textAlign: "center",
    },
    subtitle: {
        fontWeight: 100,
        fontSize: "1.2rem",
        textAlign: "center",
        color: theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.grey[100],
    },
    imageLarge: {
        content:`url(  ${theme.palette.type === 'light' ? brainLignt : brainDark } )`,
        border: `1px solid ${theme.palette.type === 'light' ? 'black' : 'white' }`,
        maxWidth: 350,
        [theme.breakpoints.down('sm')]: {
            display: "none"
        },
    },
    imagePhone: {
        content:`url(  ${theme.palette.type === 'light' ? brainLignt : brainDark } )`,
        border: `1px solid ${theme.palette.type === 'light' ? 'black' : 'white' }`,
        maxWidth: "100%",
        paddingLeft: 80,
        paddingRight: 80,
        marginBottom: 20,
        [theme.breakpoints.up('sm')]: {
            display: "none"
        },
    }
}))


export interface HomeProps {
    chainId: number,
}


export const Home = ( { chainId } : HomeProps ) => {

    const classes = useStyle()

    return (
        <Box py={3}>
             <section className={classes.topSection}>
                <div className={classes.titleSection}> 
                    <div>
                        <p className={classes.title}>
                            Self-sovereign crypto fund 
                        </p>
                        <p className={classes.subtitle}>
                            Choose your transparent, autonomous, investment strategies for long term investing<br/>
                        </p>
                    </div>
                    <div style={{ marginTop: 40 }}>
                        <Link component={LinkRouter} to="/home" style={{ textDecoration: 'none' }} > 
                            <Button variant="contained" color="secondary" style={{ width: 280, height: 40 }} >Launch App</Button>
                        </Link>
                    </div>
                 </div>

                <img className={classes.imageLarge} />
             </section>

             <Divider style={{marginTop: 40, marginBottom: 40}} />

            <section className={classes.midSection}>

                <img className={classes.imagePhone} />
                <Typography variant="h5">What is HashStrat?</Typography>
                <br/>
                <Typography variant="body2">
                    HashStrat is a new DeFi protocol for long-term investing in BTC &amp; ETH through autonomous investment strategies executed on-chain. 
                </Typography>
                <Typography variant="body2">
                    HashStrat strategies are designed to reduce portfolio volatility and drawdowns, whilst being competitive with a simple holding strategy. 
                </Typography>
                <Typography variant="body2">
                    It's also possible to improve your risk/reward further by allocating to indexes over multiple strategies.  
                </Typography>
            </section>

            <section className={classes.bottomSecion}>
                <InfoBox title="Self-sovereign" image={key}>
                    <Typography variant="body2">
                        HashStrat crypto-funds are immutable smart contracts executed on the blockchain.
                        Nobody can stop them or change their behaviour.  <br/>
                        Users stay in control of their funds at all times.
                    </Typography>
                </InfoBox>

                <InfoBox title="DAO Governance" image={dao}>
                    <Typography variant="body2">
                        Users participate in protocol governance and revenue sharing through
                        the HashStrat DAO token. <br/>
                        <Link component={LinkRouter} to="/dao">HST</Link> has fixed supply and fair distribution.
                        It can only be earned by using of the protocol.
                    </Typography>
                </InfoBox>

                <InfoBox title="Autonomous" image={automated}>
                    <Typography variant="body2">
                        HashStrat uses <Link href="https://docs.chain.link/docs/chainlink-automation/introduction/" target="_blank">Chainlink Automation</Link> to automate
                        the execution of on-chain strategies.
                        This means you can trust the blockchain and a decentralised network of independent nodes to keep operating the fund.
                    </Typography>
                </InfoBox>

                <InfoBox title="Secure" image={lock}>
                    <Typography variant="body2">
                        All code is open source and smart contracts verified on-chain.
                        This means their behaviour is predictable and transparent. <br/>
                        Users interact directly with the blockchain through their digital wallets and no personal information is ever shared or leaked.
                    </Typography>
                </InfoBox>

            </section>

        </Box>
    )
}
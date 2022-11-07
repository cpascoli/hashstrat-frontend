


import { Button, Typography, makeStyles, Divider, Link, Box, styled } from "@material-ui/core"
import { Link as LinkRouter } from "react-router-dom"

import { InfoBox } from "./InfoBox"

import brainDark from "./img/brain-dark.png"
import brainLignt from "./img/brain-light.png"
import experienceDefiLight from "./img/experience-defi-light.png"
import experienceDefiDark from "./img/experience-defi-dark.png"

import key from "./img/key.svg"
import automated from "./img/automated.svg"
import lock from "./img/lock.svg"
import dao from "./img/dao.svg"
import { Horizontal } from "./Layout"

const useStyle = makeStyles(theme => ({

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
        fontSize: "3.2rem",
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            fontSize: "2.7rem",
        },
    },
    subtitle: {
        fontWeight: 100,
        fontSize: "1.2rem",
        textAlign: "center",
        color: theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.grey[100],
    },
    imageLarge: {
        content: `url(  ${theme.palette.type === 'light' ? brainLignt : brainDark} )`,
        maxWidth: 350,
        [theme.breakpoints.down('sm')]: {
            display: "none"
        },
    },
    imagePhone: {
        content: `url(  ${theme.palette.type === 'light' ? brainLignt : brainDark} )`,
        border: `1px solid ${theme.palette.type === 'light' ? 'black' : 'white'}`,
        maxWidth: "100%",
        paddingLeft: 80,
        paddingRight: 80,
        marginBottom: 20,
        [theme.breakpoints.up('sm')]: {
            display: "none"
        },
    },
    imageDeFi: {
        content: `url(  ${theme.palette.type === 'light' ? experienceDefiLight : experienceDefiDark} )`,
        maxWidth: "480px",
    }
}))


export interface HomeProps {
    chainId: number,
}


export const Home = ({ chainId }: HomeProps) => {

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
                            Choose your transparent, autonomous, investment strategies for long term investing<br />
                        </p>
                    </div>
                    <div style={{ marginTop: 40 }}>
                        <Horizontal align="center">
                            <Link component={LinkRouter} to="/home" style={{ textDecoration: 'none' }} >
                                <Button variant="contained" color="primary" style={{ width: 200, height: 40 }} >Launch App</Button>
                            </Link>
                            <Link href="https://medium.com/@hashstrat" target="_blank" style={{ textDecoration: 'none' }} >
                                <Button variant="outlined" color="primary" style={{ width: 200, height: 40 }} >Read Blog</Button>
                            </Link>
                        </Horizontal>
                    </div>
                </div>

                <img className={classes.imageLarge} />
            </section>

            <Divider style={{ marginTop: 40, marginBottom: 40 }} />

            <section className={classes.midSection}>
               
                <Horizontal align="center"  valign="center"> 
                    <img className={classes.imageDeFi} />
                    <Typography variant="h4" align="center" >
                        Experience the power of  <br/>
                        Decentralized Finance
                    </Typography>

                    </Horizontal>
            </section>


            <section className={classes.midSection}>
                <img className={classes.imagePhone} />
                <Typography variant="h5">What is HashStrat?</Typography>
                <ul>
                    <li>
                        <Typography variant="body1">
                            HashStrat is a new DeFi protocol for investing in BTC &amp; ETH with a long-term outlook.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            In HashStrat, users' funds are managed by transparent, autonomous strategies executed on-chain.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            HashStrat strategies are designed to reduce portfolio volatility &amp; drawdowns, and produce returns competitive with the benchmark buy-and-hold strategy.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            It's also possible to improve your risk/reward further by allocating capital to indexes over multiple strategies.
                        </Typography>
                    </li>
                </ul>
            </section>


            <section className={classes.midSection}>
                <Typography variant="h5">Who is it for?</Typography>
                <ul>
                    <li>
                        <Typography variant="body1">
                            <strong>Individual investors</strong> wanting to automate the management of their crypto-portfolios, improving returns and reducing volatility, whilst retaining control over their digital assets at all times.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            <strong>DAO treasuries</strong> wanting to protect the value of their stablecoin holdings from currency debasement, by getting some exposure to pristine crypto assets, like BTC or ETH, in a trustless and verifiable way.
                        </Typography>
                    </li>

                    <li>
                        <Typography variant="body1">
                            <strong>DeFi protocols</strong> wanting to safely offload some of their stablecoin liquidity and aim for high returns over the long term.
                        </Typography>
                    </li>
                </ul>
            </section>

            <section className={classes.bottomSecion}>
                <InfoBox title="Self-sovereign" image={key}>
                    <Typography variant="body2">
                        Users interact directly with the blockchain through their digital wallets.
                        Users stay in control of their funds at all times.<br />
                        No personal information is ever shared or leaked.
                    </Typography>
                </InfoBox>

                <InfoBox title="DAO Governance" image={dao}>
                    <Typography variant="body2">
                        Users can participate in protocol governance and revenue sharing through
                        the HashStrat DAO token (<Link component={LinkRouter} to="/dao">HST</Link>). <br />
                        HST has a fixed supply and fair distribution.
                        It can only be earned by using of the protocol.
                    </Typography>
                </InfoBox>

                <InfoBox title="Autonomous" image={automated}>
                    <Typography variant="body2">
                        HashStrat uses <Link href="https://docs.chain.link/docs/chainlink-automation/introduction/" target="_blank">Chainlink Automation</Link> to automate
                        the execution of its on-chain strategies.
                        This means you can trust the blockchain and a decentralised network of independent nodes, to keep operating the fund.
                    </Typography>
                </InfoBox>

                <InfoBox title="Secure" image={lock}>
                    <Typography variant="body2">
                        All code is open source and smart contracts verified on-chain.
                        This means their behaviour is predictable and transparent. <br />
                        HashStrat smart contracts are immutable. Nobody can stop them or change their behaviour.
                    </Typography>
                </InfoBox>

            </section>

        </Box>
    )
}
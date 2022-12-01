


import { Button, Typography, makeStyles, Divider, Link, Box, styled } from "@material-ui/core"
import { Link as LinkRouter } from "react-router-dom"

import { InfoBox } from "./InfoBox"

import experienceDefiLight from "./img/experience-defi-light.png"
import experienceDefiDark from "./img/experience-defi-dark.png"
import background from "./img/homepage-bg.jpg"

import key from "./img/key.svg"
import automated from "./img/automated.svg"
import lock from "./img/lock.svg"
import dao from "./img/dao.svg"
import { Horizontal } from "./Layout"
import { FaqContent } from "./faq/FaqContent"


const useStyle = makeStyles(theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
    },

    topSection: {
        paddingTop: 70,
        paddingBottom: 110,
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
        display: "flex",
        justifyContent: "space-around",
        backgroundImage: theme.palette.type === 'light' ? `url( ${background} )` : '',
        [theme.breakpoints.down('sm')]: {
            paddingTop: 50,
            paddingBottom: 50,
        },
    },
    actionButtons: {
        marginTop: 90, 
        marginBottom: 30,
        maxWidth: 500,
        margin: 'auto',
        [theme.breakpoints.down('sm')]: {
            marginTop: 60,
        },
    },
    midSection: {
        margin: "auto",
        paddingTop: 0,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 40,
        backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
        color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],
    },
    bottomSecion: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: theme.spacing(0),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: "1fr",
        },
        paddingBottom: 40
    },
    titleSection: {
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        [theme.breakpoints.down('sm')]: {
            maxWidth: 600,
        },
    },
    title: {
        margin: 0,
        fontWeight: 200,
        fontSize: "3.0rem",
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            fontSize: "2.1rem",
        },
    },
    subtitle: {
        fontWeight: 100,
        fontSize: "1.5rem",
        textAlign: "center",
        color: theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.grey[100],
        [theme.breakpoints.down('sm')]: {
            fontSize: "1.0rem",
        },
    },
    imageDeFi: {
        content: `url(  ${theme.palette.type === 'light' ? experienceDefiLight : experienceDefiDark} )`,
        maxWidth: "480px",
        [theme.breakpoints.down('sm')]: {
            maxWidth: "380px",
        },
    },
}))


export interface HomeProps {
    chainId: number,
}


export const Home = ({ chainId }: HomeProps) => {

    const classes = useStyle()

    return (
        <>
        <Box className={classes.container}>

        <Divider style={{ marginTop: 0, marginBottom: 0 }} />

            <section className={classes.topSection}>
                <div className={classes.titleSection}>
                    <div>
                        <p className={classes.title}>
                            Self-sovereign digital asset investments 
                        </p>
                        <p className={classes.subtitle}>
                            Automated management of digital asset portfolios<br/>
                            On-chain strategies for long-term investors
                        </p>
                    </div>
                    <div className={classes.actionButtons}>
                        <Horizontal align="center">
                            <Link component={LinkRouter} to="/home" style={{ textDecoration: 'none' }} >
                                <Button variant="contained" color="primary" style={{ width: 200, height: 40 }} >Launch App</Button>
                            </Link>
                            <Link href="./whitepaper.pdf" target="_blank" style={{ textDecoration: 'none' }} >
                                <Button variant="outlined" color="primary" style={{ width: 200, height: 40 }} >White paper</Button>
                            </Link>
                        </Horizontal>
                    </div>
                </div>
            </section>

            <Divider style={{ marginTop: 0, marginBottom: 40 }} />

            <section className={classes.midSection}>
            
                <Horizontal align="center"  valign="center"> 
                    <Typography variant="h4" align="center" >
                        Experience the Power of<br/>
                        Decentralized Finance
                    </Typography>
                    <img className={classes.imageDeFi} />
                </Horizontal>
            </section>

            <Divider style={{ marginTop: 0, marginBottom: 60 }} />

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
                        This means you can trust the blockchain and a decentralised network of independent nodes, to keep running the strategies.
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

            <Divider style={{ marginTop: 0, marginBottom: 40 }} />

            <section className={classes.midSection}  > 
                <Box>
                    <Box pb={3}>
                        <Typography variant="h4" align="center"> Frequently Asked Questions </Typography>
                    </Box>
                    <FaqContent />
                </Box>
                
            </section>

           

        </Box>

      

        </>

    )
}



import { Button, Typography, makeStyles, Divider, Link, Box, Paper } from "@material-ui/core"
import { Link as LinkRouter } from "react-router-dom"
import { InfoBox } from "./InfoBox"

import { Horizontal } from "./Layout"
import { FaqContent } from "./faq/FaqContent"
import { StrategyCarousel } from "./home/StrategyCarousel"

import key from "./img/key.svg"
import automated from "./img/automated.svg"
import lock from "./img/lock.svg"
import dao from "./img/dao.svg"
import experienceDefi from "./img/experience-defi.png"



const useStyle = makeStyles(theme => ({

    topSection: {
        paddingTop: 70,
        paddingBottom: 50,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 50,
            paddingBottom: 50,
        },
    },

    titleSection: {
        // backgroundColor: "yellow",
        margin: "auto",
        paddingLeft: 10,
        paddingRight: 10,
        [theme.breakpoints.down('sm')]: {
            maxWidth: 600,
        },
    },
    title: {
        margin: 0,
        maxWidth: 800,
        fontFamily: "Alexandria",
        fontWeight: 600,
        fontSize: "2.8rem",
        color:  theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.text.primary,

        [theme.breakpoints.down('xs')]: {
            fontSize: "1.9rem",
            textAlign: 'center'
        },
    },
    subtitle: {
        fontFamily: "Roboto",
        fontWeight: 300,
        maxWidth: 800,
        fontSize: "1.5rem",
        color: theme.palette.type === 'light' ? theme.palette.grey[700] : '#ffaf49',
        [theme.breakpoints.down('xs')]: {
            fontSize: "1.3rem",
            textAlign: 'center'
        },
    },


    actionButtons: {
        marginTop: 60, 
        marginBottom: 30,
        maxWidth: 500,
        margin: 'auto',
        [theme.breakpoints.down('sm')]: {
            marginTop: 60,
        },
    },
    carouselSection: {
        margin: "auto",
        paddingTop: 0,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 40,
        color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.grey[900] 
    },

    midSection: {
        margin: "auto",
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
        color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],

        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0,
            paddingRight: 0,
        },
    },

    faqSection: {
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],

        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0,
            paddingRight: 0,
        },
    },

    faqContent: {
         maxWidth: 1200,
         margin: "auto",

         [theme.breakpoints.down('sm')]: {
            maxWidth: 400,
        },
    },

    valuesSection: {
        backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],

        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: theme.spacing(0),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: "1fr",
        },
        paddingBottom: 0,
        maxWidth: 1024,
        margin: "auto"

    },

    infoSection: {
        paddingBottom: 10,
        [theme.breakpoints.down('md')]: {
            display: "none",
        },
    },
    imageDeFi: {
        content: `url( ${experienceDefi} )`,
        maxWidth: "320px",
        filter: theme.palette.type === 'light' ? "grayscale(0.6)" : "grayscale(0.6)",
    },
    brightnessFilter: {
        filter:  theme.palette.type === 'light' ? "brightness(1)" : "brightness(1)"
    },

    
}))


export interface HomeProps {
    chainId: number,
}


export const Home = ({ chainId }: HomeProps) => {

    const classes = useStyle()

    return (
    
        <Box>

        <Divider style={{ marginTop: 0, marginBottom: 0 }} />

            <section className={classes.topSection}>
                    
                        <div className={classes.titleSection} >
                            <Horizontal align="center">
                                <div>
                                    <div>
                                        <div className={classes.title}>
                                            Automate your digital asset investments
                                        </div>
                                        <div className={classes.subtitle}>
                                            <ul>
                                                <li>Use proven on-chain strategies to build your digital asset portfolio, capture volatility and manage risk in your investment. </li>
                                                <li>Stay in control of your assets and watch your portfolio grow. </li>
                                            </ul>
                                        </div>
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

                                <Paper>
                                    <div className={classes.infoSection}>
                                        <div className={classes.brightnessFilter}>
                                            <img className={classes.imageDeFi} alt="Info graphics"/>
                                        </div>
                                        <Horizontal> 
                                            <ol>
                                                <li>
                                                    <Typography variant="body2" >Build your digital asset portfolio</Typography> 
                                                </li>
                                                <li>
                                                <Typography variant="body2" >Earn DAO tokens</Typography> 
                                                </li>
                                                <li>
                                                <Typography variant="body2" >Participate in DAO Governance</Typography> 
                                                </li>
                                                <li>
                                                <Typography variant="body2" >Collect protocol dividends</Typography> 
                                                </li>
                                            </ol>
                                        </Horizontal>
                                    </div>
                                </Paper>

                            </Horizontal>
                        </div>
             

            </section>

            <section className={classes.carouselSection} >
                
                <Divider style={{ marginTop: 0, marginBottom: 40 }} />

                <Box pb={2}>
                    <Typography variant="h3" align="center">Our Strategies</Typography>
                </Box>
                <StrategyCarousel />
            </section>

            <section className={classes.midSection}>

                <Box pb={2}>
                    <Typography variant="h3" align="center">Our Values</Typography>
                </Box>

                <Box  className={classes.valuesSection} >

                    <InfoBox title="Self-sovereignty" image={key}>
                        <Typography variant="body2">
                            Users interact directly with the blockchain through their digital wallets.
                            Users stay in control of their funds at all times.<br />
                            No personal information is ever shared or leaked.
                        </Typography>
                    </InfoBox>

                    <InfoBox title="DAO Governance" image={dao}>
                        <Typography variant="body2">
                            Users can participate in protocol governance and revenue sharing through
                            the HashStrat DAO token (<Link component={LinkRouter} to="/dao">HST</Link>).
                            HST has a fixed supply and fair distribution.
                            It can only be earned by using of the protocol.
                        </Typography>
                    </InfoBox>

                    <InfoBox title="Autonomy" image={automated}>
                        <Typography variant="body2">
                            HashStrat uses <Link href="https://docs.chain.link/docs/chainlink-automation/introduction/" target="_blank">Chainlink Automation</Link> to automate
                            the execution of its on-chain strategies.
                            This means you can trust the blockchain and a decentralised network of independent nodes, to keep running the strategies.
                        </Typography>
                    </InfoBox>

                    <InfoBox title="Security" image={lock}>
                        <Typography variant="body2">
                            All code is open source and smart contracts verified on-chain.
                            This means their behaviour is predictable and transparent. <br />
                            HashStrat smart contracts are immutable. Nobody can stop them or change their behaviour.
                        </Typography>
                    </InfoBox>

                </Box>

                <Divider style={{ marginTop: 40, marginBottom: 0 }} />

            </section>

            <section className={classes.faqSection}  > 
                <Box>
                    <Box pb={3} >
                        <Typography variant="h3" align="center"> Frequently Asked Questions </Typography>
                    </Box>
                  
                    <Box className={classes.faqContent}>
                        <FaqContent />
                    </Box>
                  
                </Box>
            </section>
        </Box>

    )
}
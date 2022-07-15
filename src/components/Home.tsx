


import { Button, Typography, makeStyles, Menu, MenuProps, MenuItem, Divider, Hidden } from  "@material-ui/core"
import { Link } from "react-router-dom"

import brainDark from "./img/brain-dark.png"
import brainLignt from "./img/brain-light.png"


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

    titleSection: {
        textAlign: "center",
        maxWidth: 480
    },
    title: {
        margin:0,
        fontWeight: 200,
        fontSize: "2.2rem",
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
   
        marginBottom: 20,
        [theme.breakpoints.up('sm')]: {
            display: "none"
        },
    },
}))


export interface HomeProps {
    chainId: number,
}


export const Home = ( { chainId } : HomeProps ) => {

    const classes = useStyle()
  

    return (
        <div >
             <section className={classes.topSection}>
                <div className={classes.titleSection}> 
                    <div>
                        <p className={classes.title}>
                            HashStrat, self-sovereign crypto-funds on the blockchain
                        </p>
                        <p className={classes.subtitle}>
                            Choose your decentralised, investment strategies executed on-chain <br/>
                        </p>
                    </div>
                    <Link to="/pools" style={{ textDecoration: 'none' }} > 
                        <Button variant="contained" color="secondary" style={{ width: 280, height: 40 }} >Launch App</Button>
                    </Link>
                 </div>

                <img className={classes.imageLarge} />
             </section>

             <Divider style={{marginTop: 20, marginBottom: 20}} />

            <section className={classes.midSection}>

                <img className={classes.imagePhone} />
                <Typography variant="body1">
                    <strong> How does it work?</strong>
                </Typography>
           
                <br/>
                <Typography variant="body2">
                    HashStrat allows to allocate capital to transparent, permissionless investment strategies executed on-chain. 
                </Typography>
                <br/>
                <Typography variant="body2">
                    Different strategies offer different levels of risk and it's possible to tweak your risk/reward further by allocating to an index over multiple strategies.  
                </Typography>
                <br/>
                <Typography variant="body2">
                    For example, a rebalancing strategy over a 2 asset portfolio would target a 60%/40% allocation to each.
                    <br/>
                    When moves in the price of the assets produce a significant imbalance in the portfolio, the strategy would rebalance it to the target allocations.
                </Typography>
            </section>

        </div>
    )
}
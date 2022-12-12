import React from 'react';
import Carousel from 'react-material-ui-carousel'

import { makeStyles, Card, CardContent, CardActions, Button, Paper, Box, Typography, Link } from  "@material-ui/core"
import { Horizontal } from '../Layout';

type StrategyInfo = {
    name: string,
    description: string,
    goal: string,
    rule: string,
    returns: string,
    timeframe: string,
    link: string
}

const useStyle = makeStyles( theme => ({
    container: {
        maxWidth: 900,
        margin: "auto",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    },
    card: {
        border: "0px solid #999",
        backgroundColor: theme.palette.type === 'light' ? '#fff' : theme.palette.grey[800],
        color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],
        borderRadius: 10,
    },

    item: {
        marginLeft: 50,
        marginRight: 50,
        display: "grid",
        gridTemplateColumns: "4fr 2fr",
        gap: theme.spacing(0),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: "1fr",
            marginLeft: 0,
            marginRight: 0,
        },
    },

    itemDetail: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        [theme.breakpoints.down('sm')]: {
            display: "none"
        },
    },

    roi: {
        marginTop:  20,
        margin: "auto",
        // height: 200,
        maxWidth: 220,
        padding: theme.spacing(2),
        border: "1px solid #aaa",
        alignItems: "center",
        borderRadius: 12,
    }

}))

export const StrategyCarousel = () =>  { 

    const classes = useStyle()

    var items : StrategyInfo[] = [
        {
            name: "Mean Reversion",
            description: "A strategy to dollar-cost average in and out a risk asset according to its long term trend",
            goal: "Accumulate the risk asset when its price is significantly below its long term trend and progressively divest when it's significantly above.",
            rule: "",
            returns: "8.5x",
            timeframe: "From Jan 2019 to July 2022",
            link: "https://medium.com/@hashstrat/hashstrat-mean-reversion-strategy-b1a576b05d5f"
        },
        {
            name: "Rebalancing",
            description: "A strategy to rebalance a 2 asset portfolio",
            goal: "Capture volatility in the risk asset when the relative value of either asset in the portfolio deviates significantly from the portfolio's target allocation.",
            rule: "",
            returns: "6.4x",
            timeframe: "From Jan 2019 to July 2022",
            link: "https://medium.com/@hashstrat/hashstrat-rebalancing-strategy-f0bb6cf3152f"

        },
        {
            name: "Trend Following",
            description: "A momentum strategy trading in the direction of the underlying trend",
            goal: "Capture volatility in the risk asset when its price is moving in an uptrend and sell into stable assets when the trend reverses.",
            rule: "",
            returns: "18.9x",
            timeframe: "From Jan 2019 to July 2022",
            link: "https://medium.com/@hashstrat/trend-following-strategy-7dce9756eaa"

        }
    ]

    return (
        <Box className={classes.container}>
            <Carousel
                fullHeightHover={false}  
                navButtonsProps={{ 
                    style: {
                        // backgroundColor: 'cornflowerblue',
                        // borderRadius: 0
                    }
                }} 

                autoPlay={true}
                stopAutoPlayOnHover={true}
                navButtonsAlwaysVisible={true}
                cycleNavigation={false}
                swipe={true}
                indicators={true}
            >

                {
                    items.map( (item, i) => <Item key={i} data={item} /> )
                }
            </Carousel>
        </Box>
    )
}


export const Item = (props: {data: StrategyInfo}) =>  { 
    const classes = useStyle()

    return (
        <Card variant="elevation" className={classes.card}>
            <CardContent>
                <div className={classes.item}>
                    <Box>
                        <Typography variant="h5" align="center"> <strong> {props.data.name} </strong> </Typography>
                        <Box py={1}>  
                            <Typography variant="body2" align="center"> {props.data.description} </Typography>
                        </Box>
                        <Box className={classes.itemDetail}>
                            <Typography variant="body2" align="left"><strong>Goal:</strong> {props.data.goal} </Typography>
                        </Box>

                    </Box>

                    <Box className={classes.roi}>
                        <Typography variant="body1" align="center"><strong>Returns</strong></Typography>
                        <Box py={1}>
                            <Typography variant="h4" align="center" color="primary"> {props.data.returns}</Typography>
                        </Box>
                        <Typography variant="body2" align="center" color={'textSecondary'}> {props.data.timeframe}</Typography>
                    </Box>
                </div>

                <Horizontal align='center'> 
                    <Link href={props.data.link} target="_blank" style={{ paddingTop: 20 }} > Learn More </Link>
                </Horizontal>

            </CardContent>
            <CardActions >
            </CardActions>
        </Card>
    )
}




import { makeStyles, useTheme, Box } from  "@material-ui/core"
import { Horizontal } from "../Layout";

const useStyle = makeStyles( theme => ({
    strategies: {
        textAlign: "center",
        paddingTop: theme.spacing(2),
        minHeight: 300
    }
}))


export const StrategiesHome = () => {
    const classes = useStyle()
    const theme = useTheme();

    return (
        <Box className={classes.strategies}>
            <Box style={{marginTop: 50}}>
                Coming soon
            </Box>
        </Box>
    )
}

import { Box, Divider, makeStyles } from "@material-ui/core"


const useStyles0 = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(1),
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 12,
        minWidth: 300,
        color: theme.palette.text.primary
    },
    containerNoBorder: {
        padding: theme.spacing(1),
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(0),
        minWidth: 300,
    },
    label: {
        fontWeight: 100,
        fontSize: "1.1rem"
    },
    value: {
        fontWeight: 200,
        fontSize: "1.2rem"
    }
}))


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(1),
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 12,
        minWidth: 300,
        color: theme.palette.text.primary
    },
    containerNoBorder: {
        padding: theme.spacing(1),
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(0),
        minWidth: 300,
    },
    label: {
        fontWeight: 100,
        fontSize: "1.0rem"
    },
    value: {
        fontWeight: 200,
        fontSize: "0.9rem"
    }
}))

interface TitleValueBoxProps {
    title: string,
    value: string,
    suffix?: string,
    border?: boolean
    mode?: "small" | "regular"
}


export const TitleValueBox = ({ title, value, suffix="", border=false, mode="regular"} : TitleValueBoxProps ) => {

    const useStyles = makeStyles( theme => ({
        container: {
            padding: theme.spacing(2),
            display: "flex",
            justifyContent: "space-between",
            gap: theme.spacing(1),
            border: `1px solid ${theme.palette.secondary.main}`,
            borderRadius: 12,
            minWidth: 300,
            color: theme.palette.text.primary
        },
        containerNoBorder: {
            padding: theme.spacing(1),
            display: "flex",
            justifyContent: "space-between",
            gap: theme.spacing(0),
            minWidth: 300,
        },
        label: {
            fontWeight: 100,
            fontSize: mode === "regular" ? "1.1rem" : "0.9rem"
        },
        value: {
            marginLeft: 20,
            fontWeight: 200,
            fontSize: mode === "regular" ? "1.2rem" : "0.9rem"
        }
    }))

    const classes = useStyles()


    return (
        <>
            <Box className={border? classes.container : classes.containerNoBorder}>
                <div  className={classes.label}> {title} </div>
                <div  className={classes.value}> {value} {suffix} </div>
            </Box>
            {(!border) && <Divider variant="fullWidth"  /> }
        </>
  )}



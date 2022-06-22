
import { Box, Divider, makeStyles } from "@material-ui/core"


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(1),
        border: '1px dotted '+theme.palette.text.secondary,
        minWidth: 300,
        borderRadius: 6,
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


interface TitleValueBoxProps {
    title: string,
    value: string,
    tokenSymbol: string,
    border?: boolean
}


export const TitleValueBox = ({ title, value, tokenSymbol, border=true } : TitleValueBoxProps ) => {
    
    const classes = useStyles()
    
    return (
        <>
            <Box className={border? classes.container : classes.containerNoBorder}>
                <div  className={classes.label}> {title} </div>
                <div  className={classes.value}> {value} {tokenSymbol} </div>
            </Box>
            <Divider />
        </>
  )}



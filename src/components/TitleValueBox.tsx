
import { Button, Box, TextField, makeStyles } from "@material-ui/core"


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(1),
        border: '1px solid '+theme.palette.text.secondary,
        minWidth: 300,
        borderRadius: 6,
        color: theme.palette.text.primary
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
    tokenSymbol: string
}


export const TitleValueBox = ({ title, value, tokenSymbol } : TitleValueBoxProps ) => {
    
    const classes = useStyles()
    
    return (
        <div>
            <Box className={classes.container}>
                <div  className={classes.label}  > {title} </div>
                <div  className={classes.value} > {value} {tokenSymbol} </div>
            </Box> 
        </div>
  )}




import { makeStyles, Box, Typography, Divider } from "@material-ui/core"

interface InfoBoxProps {
    children: React.ReactNode,
    image?: string,
    title: string
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        border: "1px solid #aaa",
        margin: 10,
        alignItems: "center",
        borderRadius: 12,
        
        [theme.breakpoints.down('lg')]: {
            display: "grid",
            gap: theme.spacing(1),
            gridTemplateColumns: "1fr 3fr",
        },

        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: "1fr",
            gap: theme.spacing(1),
        },
    },
    image: {
        maxWidth: 120,
        margin: "auto",
        [theme.breakpoints.down('xs')]: {
            margin: "auto",
        },
    }
}))


export const InfoBox = ({ children, title, image,  } : InfoBoxProps) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            { image &&
                <div style={{textAlign: "center", alignItems: "center" }}>
                    <img src={image} className={classes.image} ></img> 
                </div>
            }
            <Box px={2} >
                <Box py={1}>
                    <Typography variant="h4" align="center"> {title} </Typography>
                </Box>
                {children} 
            </Box>
        </div>
    )
}



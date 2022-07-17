
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
    
        borderRadius: 12,
        [theme.breakpoints.down('sm')]: {
            display: "grid",
            gap: theme.spacing(1),
            gridTemplateColumns: "1fr 2fr",
        },

        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: "1fr",
            gap: theme.spacing(1),
        },
    },
    image: {
        maxWidth: 200,
        margin: "auto",
        [theme.breakpoints.down('xs')]: {
            margin: "auto",
            maxWidth: 150,
        },
    }
}))


export const InfoBox = ({ children, title, image,  } : InfoBoxProps) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            { image &&
                    <div style={{textAlign: "center"}}>
                        <img src={image} className={classes.image} ></img> 
                    </div>
            }
            <div>
                <Typography variant="h6" align="center"> {title} </Typography>
                <br/>
                {children}
            </div>
        </div>
    )
}



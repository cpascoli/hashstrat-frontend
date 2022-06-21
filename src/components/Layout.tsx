
import { makeStyles, Box } from "@material-ui/core"

interface ChildrenProps {
    children: React.ReactNode,
}

const useStyles = makeStyles( theme => ({
    container: {
        body: theme.spacing(1),
    },
    horizontal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        gap: theme.spacing(2),
    }
}))

export const Page = ({ children } : ChildrenProps) => {
    const classes = useStyles()
    return (
        <main className={classes.container}>
            <Box m={4} pt={3}>
                {children}
            </Box>
        </main>
    )
}


export const Horizontal = ({ children } : ChildrenProps) => {
    const classes = useStyles()
    return (
        <div className={classes.horizontal}>
            {children}
        </div>
    )
}



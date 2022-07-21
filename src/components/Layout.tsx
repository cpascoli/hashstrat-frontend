
import { makeStyles, Box } from "@material-ui/core"

interface ChildrenProps {
    children: React.ReactNode,
    align?: "center" | "left"
}

const useStyles = makeStyles( theme => ({
    container: {
        body: theme.spacing(1),
    },
    center: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        flexFlow: "row wrap",
        gap: theme.spacing(2),
    },
    left: {
        display: "flex",
        justifyContent: "left",
        alignItems: "top",
        flexDirection: "row",
        flexFlow: "row wrap",
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


export const Horizontal = ({ children, align = "left" } : ChildrenProps) => {
    const classes = useStyles()
    return (
        <div className={align === "center" ? classes.center : classes.left}>
            {children}
        </div>
    )
}



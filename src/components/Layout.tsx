
import { makeStyles, Box } from "@material-ui/core"

interface ChildrenProps {
    children: React.ReactNode,
    align?: "center" | "left"
    valign?: "center" | "top"
}

const useStyles = makeStyles( theme => ({
    container: {
        body: theme.spacing(1),
    },
    horizontalCenter: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        flexFlow: "row wrap",
        gap: theme.spacing(2),
    },
    horizontalLeft: {
        display: "flex",
        justifyContent: "left",
        alignItems: "top",
        flexDirection: "row",
        flexFlow: "row wrap",
        gap: theme.spacing(2),
    },
    horizontalVerticallyCentered: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        flexFlow: "row wrap",
        alignItems: "center",
        gap: theme.spacing(2)
      },
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


export const Horizontal = ({ children, align = "left" , valign} : ChildrenProps) => {
    const classes = useStyles()
    return (
        <div className={  valign === 'center' ? classes.horizontalVerticallyCentered :
                          align === "center" ? classes.horizontalCenter : classes.horizontalLeft 
                        } >
            {children}
        </div>
    )
}


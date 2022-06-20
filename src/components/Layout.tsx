
import { makeStyles, Box } from "@material-ui/core"

interface PageProps {
    children: React.ReactNode,
}

const useStyles = makeStyles( theme => ({
    container: {
        body: theme.spacing(1),
    }
}))

export const Page = ({ children } : PageProps) => {
    const classes = useStyles()
    return (
        <main className={classes.container}>
            <Box m={4} pt={3}>
                {children}
            </Box>
        </main>
    )
}



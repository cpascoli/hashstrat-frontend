import { Typography, makeStyles } from "@material-ui/core"

import { Socials } from "./Socials"

const useStyle = makeStyles( theme => ({
    footer: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        textAlign: "center",
        padding: theme.spacing(2)
    }
}))



export const Footer = () =>  {
    const classes = useStyle()
    return (
        <footer className={classes.footer}>
            <Socials />
            <Typography variant="body2"> © 2022 HashStrat. All rights reserved </Typography>
            <Typography variant='body2' color="textSecondary"> Version 0.5 (90d2e5a) </Typography>
        </footer>
    )
}
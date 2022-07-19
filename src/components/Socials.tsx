


import { makeStyles, useTheme, Box } from  "@material-ui/core"
import { Height } from "@material-ui/icons"


import { SocialIcon } from "react-social-icons"
import { Horizontal } from "./Layout"


const useStyle = makeStyles( theme => ({
    socials: {
        textAlign: "center",
        paddingBottom: theme.spacing(2),
        maxWidth: 200,
        margin: "auto"
    },
    icon: {
        bgcolor: theme.palette.type === 'light' ? 'black' : 'white'
    }
}))




export const Socials = () => {
    const classes = useStyle()
    const theme = useTheme();
    const bgcolor = theme.palette.type === 'light' ? '#555' : '#ccc'

    return (
        <Box className={classes.socials}>
            <Horizontal align="center">
                <SocialIcon url="https://t.me/hashstrat" style={{width: 30, height: 30}} target="_blank"  bgColor={bgcolor} />
                <SocialIcon url="https://github.com/cpascoli/hashstrat" style={{width: 30, height: 30}} target="_blank" bgColor={bgcolor} />
                <SocialIcon url="https://twitter.com/0xash1" style={{width: 30, height: 30}} target="_blank"  bgColor={bgcolor} />
                <SocialIcon url="https://www.linkedin.com/in/carlopascoli/" style={{width: 30, height: 30}} target="_blank" bgColor={bgcolor} />
            </Horizontal>
        </Box>
    )
}



import { makeStyles, useTheme, Box } from  "@material-ui/core"
import { SocialIcon } from "react-social-icons"
import { Horizontal } from "./Layout"


const useStyle = makeStyles( theme => ({
    socials: {
        textAlign: "center",
        paddingBottom: theme.spacing(2),
        maxWidth: 250,
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
                <SocialIcon url="https://medium.com/@hashstrat" style={{width: 30, height: 30}} target="_blank"  bgColor={bgcolor} />
                <SocialIcon url="https://github.com/orgs/hashstrat-labs/repositories" style={{width: 30, height: 30}} target="_blank" bgColor={bgcolor} />
                <SocialIcon url="https://www.linkedin.com/company/hashstrat" style={{width: 30, height: 30}} target="_blank" bgColor={bgcolor} />
                <SocialIcon url="mailto:carlo@hashstrat.com" style={{width: 30, height: 30}} target="_blank"  bgColor={bgcolor} />
                <SocialIcon url="https://t.me/hashstrat_public" style={{width: 30, height: 30}} target="_blank"  bgColor={bgcolor} />
            </Horizontal>
        </Box>
    )
}
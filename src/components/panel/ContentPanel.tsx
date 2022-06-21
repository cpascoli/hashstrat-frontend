
import { makeStyles, Box } from "@material-ui/core"
import { Token } from  "../Main"
import  ContentTabs from "./ContentTabs"


interface ContentPanelProps {
    chainId: number,
    account: string,
    tokens: Array<Token>
}

const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0
    },
}))


export const ContentPanel = ( { chainId, account, tokens } : ContentPanelProps) => {

    console.log(">>> ContentPanel () = chainId: ", chainId, account, tokens)
    const classes = useStyle()

    return ( 
        <Box className={classes.container}>
            <ContentTabs chainId={chainId} account={account} tokens={tokens} />
        </Box>
    )
}

import { useState, useEffect } from "react";

import { makeStyles, Box } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
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
        <div>
            {(!chainId && account) &&
                <Alert severity="warning" style={{textAlign: "center"}}> 
                    <AlertTitle>Wrong Network</AlertTitle>
                    Please connect an account to the <strong>Polygon</strong> or <strong>Kovan</strong> networks to use the dapp!
                </Alert>
            }

            { (!chainId || !account) &&
                <Alert severity="info" style={{textAlign: "center"}}> 
                    <AlertTitle>No account connected</AlertTitle>
                    Please connect an account to the Polygon or Kovan networks to use the dapp!
                </Alert>
            }

            <Box className={classes.container}>
                <ContentTabs chainId={chainId} account={account} tokens={tokens} />
            </Box>
        </div>
    )


}
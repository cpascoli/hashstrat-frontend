import { useEffect, useState } from "react";

import { useEthers, Polygon } from "@usedapp/core";
import { makeStyles, Box, Button, Typography } from "@material-ui/core"
import { AlertTitle } from "@material-ui/lab"

import { ConnectButton } from "../../main/ConnectButton"
import { StyledAlert } from "../shared/StyledAlert"


const useStyles = makeStyles( theme => ({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center", 
        maxWidth: 650,
        margin: 'auto', 
        marginBottom: 40,
        height: "100%",
    }
}))



interface ConnectAccountHelperProps {
    connectedChainId: number | undefined
    userMessage: string | undefined
}


export const ConnectAccountHelper = ( { connectedChainId, userMessage } : ConnectAccountHelperProps ) => {

    const classes = useStyles()
    const { switchNetwork, chainId, account } = useEthers()

    console.log("ConnectAccountHelper - chainId: ", chainId, account)

    const isPolygon = connectedChainId === Polygon.chainId

    const [showError, setShowError]= useState(false)

    const purposeMessage = userMessage ?? "interact with HashStrat"

    useEffect(() => {
        let timer = setTimeout( () => setShowError(true), 1000 )

        return () => {
            clearTimeout(timer)
        }

    }, [])


    return (
        <Box>
            { showError && <Box className={classes.container}>
                <StyledAlert severity={ isPolygon ? "info" : "warning"} >
                    <Box>
                            <AlertTitle>
                                {!isPolygon &&  <Box>Wrong Network</Box> }
                                { isPolygon && account === undefined &&  <Box> No Account connected</Box> }
                            </AlertTitle>

                            { isPolygon &&  <Typography> Please connect an account to the <strong>Polygon</strong> network to {purposeMessage}.</Typography> }
                            { !isPolygon && <Typography> Please connect to the <strong>Polygon</strong> network to {purposeMessage}.</Typography> }

                            <div style={{ marginTop: 30, marginBottom: 20 }} >
                                { !isPolygon && 
                                    <Button color="primary" variant="contained" fullWidth onClick={() => switchNetwork(Polygon.chainId)} disabled={chainId === Polygon.chainId}>
                                        Switch Network
                                    </Button>
                                }
                                { isPolygon &&
                                    <ConnectButton />
                                }
                            </div>
                    </Box>
                </StyledAlert>
            </Box>
            }
        </Box> 
    )
}



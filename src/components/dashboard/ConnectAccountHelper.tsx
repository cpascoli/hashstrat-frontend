
import { useState, useEffect } from 'react';
import { utils } from "ethers"


import { useEthers, Polygon, shortenAddress } from "@usedapp/core";
import { makeStyles, Box, Button, Typography, Link } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { ConnectButton } from "../../main/ConnectButton"
import { StyledAlert } from "../shared/StyledAlert"
import { Horizontal } from "../Layout"




const useStyles = makeStyles( theme => ({
    container: {
        padding: 10, 
        textAlign: "center", 
        maxWidth: 600,
        margin: 'auto', 
        height: "60vh",

        // height: 100%;
        display: "flex",
        flexCirection: "column"
        
    },

}))



interface ConnectAccountHelperProps {
    connectedChainId: number | undefined
}


export const ConnectAccountHelper = ( {connectedChainId} : ConnectAccountHelperProps ) => {

    const classes = useStyles()
    const { switchNetwork, chainId, account } = useEthers()
    const isPolygon = connectedChainId === Polygon.chainId
   
    return (
    
        <Box className={classes.container}>
            
                <StyledAlert severity={ isPolygon ? "info" : "warning"} >
                    <Box>
                            <AlertTitle>
                                {!isPolygon &&  <Box>Wrong Network</Box> }
                                { isPolygon && account === undefined &&  <Box> No Account connected</Box> }
                            </AlertTitle>

                            { isPolygon &&  <Typography> Please connect an account to the Polygon network to interact with HashStrat.</Typography> }
                            { !isPolygon && <Typography> Please connect to the Polygon network to interact with HashStrat.</Typography> }

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
    )
}



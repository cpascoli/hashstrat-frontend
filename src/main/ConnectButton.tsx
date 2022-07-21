import { useState, useEffect } from 'react';
import { useBlockNumber, shortenAddress } from "@usedapp/core"
import Switch from "@material-ui/core/Switch";
import { useEthers } from "@usedapp/core";
import { Button, makeStyles, Menu, MenuProps, MenuItem, Divider } from  "@material-ui/core"
import { styled } from "@material-ui/core/styles"
import { NetworkName } from "../utils/network"
import { KeyboardArrowDown } from "@material-ui/icons"
import home from "./img/home.png"



const useStyles = makeStyles( theme => ({
  container: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    padding: 0,
    margin: 0
  }
}))




export interface ConnectedInfo {
  chainId: number | undefined,
  account: string | undefined
}

interface ConnectButtonProps {
    setAccount: (account: string | undefined) => void
    setChainId: (chainId: number | undefined ) => void
}


export const ConnectButton = ( { setAccount, setChainId } : ConnectButtonProps ) => {

    const classes = useStyles()

    const { account, activateBrowserWallet, chainId }  = useEthers()

    useEffect(() => {
        setAccount(account)
    }, [account])

    useEffect(() => {
        setChainId(chainId)
    }, [chainId])

    const isConnected = account !== undefined && chainId !== undefined

    return (
        <div className={classes.container}>

        { !isConnected && 
            <Button color="primary" variant="contained" onClick={() => activateBrowserWallet() }>Connect</Button>
            /* <Web3ModalButton /> */
        }

      </div>
    )
}

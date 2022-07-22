import { useEffect } from 'react';
import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from  "@material-ui/core"



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

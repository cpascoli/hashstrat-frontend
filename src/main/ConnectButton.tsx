import { useEthers } from "@usedapp/core";
import { Button } from "@material-ui/core"


export const ConnectButton = () => {

	const { account, activateBrowserWallet, chainId } = useEthers()
	const isConnected = account !== undefined && chainId !== undefined

	return (
		<>
			{!isConnected &&
				<Button color="primary" variant="contained" onClick={() => activateBrowserWallet()} fullWidth >Connect</Button>
				/* <Web3ModalButton /> */
			}
		</>
	)
}

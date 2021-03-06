import { Button, makeStyles } from "@material-ui/core"


const useStyles = makeStyles( theme => ({

    formModal: {
         position: "fixed",
         left: "50%",
         top: "50%",
         transform: "translateX(-50%) translateY(-50%)",
         minWidth: "340px",
         backgroundColor: theme.palette.type == 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
         boxShadow: "0 1px 27px 0 rgba(0,0,0,0.19)",
         borderRadius: "10px",
         padding: "14px",
         zIndex: 120,
         color: theme.palette.text.primary,
     },
     overlay: {
         backgroundColor: "rgba(65,65,85,0.58)",
         position: "fixed",
         top: 0,
         bottom: 0,
         left: 0,
         right: 0,
         zIndex: 110
     },
}))
 

interface ModalProps {
    onClose: React.MouseEventHandler<HTMLDivElement>;
    children: React.ReactNode
}

export const Modal = ({ onClose, children } : ModalProps) => {
    const classes = useStyles()
    
    return (
        <div>
            <div 
            className={classes.overlay} 
            onClick={onClose} 
            />
            <div className={classes.formModal}>
            {children}
            </div>
        </div>
    )
}


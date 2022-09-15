import { styled } from "@material-ui/core/styles"
import { Alert } from "@material-ui/lab";


export const StyledAlert = styled(Alert)(({ theme }) => ({
    backgroundColor: theme.palette.type === 'light' ? '#e1eaeb' : '#384142',
    margin: "auto",
    maxWidth: 700,
    padding: 20,
}));

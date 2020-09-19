import React from 'react';
import { withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { blue } from '@material-ui/core/colors';



const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function SubmitBtn(props) {
  const classes = useStyles();

  return (
    <div>
      <ColorButton disabled={props.disabled} variant="contained" color="primary" type={props.type} className={classes.margin} onClick={props.handleSubmit}>
        {props.children}
      </ColorButton>
    </div>
  );
}

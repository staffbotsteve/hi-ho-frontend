import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function EditBtn(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
     
      <Button variant="contained" color="primary" type={props.type} onClick={props.handleOpen}>
  {props.children}
      </Button>
     
    </div>
  );
}

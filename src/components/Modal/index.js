import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import API from "../../utils/API";


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("")
  const [itemPrice, setItemPrice] = useState([]);
  const [costLiving, setCostLiving] = useState([]);

  const handleOpen = (event) => {
    setOpen(true);
    console.log("event", event.target)
    API.ItemPrices(event).then((res) => {
        setItemPrice(res)
        console.log("itemprices", res);
      });
  
      API.CostOfLiving(event.location).then((res) => {
        console.log("costofliving", res);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <a type="button" onClick={handleOpen} value={props.location}>
        {props.children}
      </a>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
    <h2 id="transition-modal-title">{props.children}</h2>
    <p id="transition-modal-description">{props.location}</p>
    <p>test?</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

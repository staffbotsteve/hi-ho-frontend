import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import SubmitBtn from "../SubmitBtn";
import { toast } from "react-toastify";
import {Button}  from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL;

  const dataToSend = {
    firstName : firstName || props.data.firstName,
    lastName : lastName || props.data.lastName,
    email : email || props.data.email,
    phone : phone || props.data.phone
  }

    fetch(`${url}/me/${props.data._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("editData", data);
          props.setData(dataToSend)
          toast.success("Profile successfully editted");
          handleClose();
        }
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Edit Profile
      </Button>
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
            <h2 id="transition-modal-title">Edit Profile</h2>
            <div>
              <TextField
                required
                id="outlined-required"
                label="First Name"
                placeholder={firstName}
                variant="outlined"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              <TextField
                required
                id="outlined-required"
                label="Last Name"
                placeholder={lastName}
                variant="outlined"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
            <div>
              <TextField
                required
                id="outlined-required"
                label="Email"
                placeholder={email}
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <TextField
                required
                id="outlined-required"
                label="Phone Number"
                placeholder={phone}
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
            <br></br>
            <SubmitBtn disabled={!phone && !email && !firstName && !lastName} type="submit" handleSubmit={handleSubmit}>
              Edit Profile
            </SubmitBtn>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

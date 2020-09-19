import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import SubmitBtn from "../SubmitBtn";
import { toast } from "react-toastify";

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

    // if (firstName === "") {
    //   setFirstName(props.data.firstName);
    // }
    // if (lastName === "") {
    //   setLastName(props.data.lastName);
    // }
    // if (email === "") {
    //   setEmail(props.data.email);
    // }
    // if (phone === "") {
    //   setPhone(props.data.phone);
    // }

    fetch(`${url}/me/${props.data._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("editData", data);
          toast.success("Profile successfully editted");
          handleClose();
        }
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button type="button" onClick={handleOpen}>
        Edit Profile
      </button>
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
            <SubmitBtn type="submit" handleSubmit={handleSubmit}>
              Edit Profile
            </SubmitBtn>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

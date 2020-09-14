import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import API from "../../utils/API";
import { DataContext } from "../APIInput";

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

const findPrice = (res, string) => {
  const price = res.find(obj => obj.item_name === string)
}

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [costLiving, setCostLiving] = useState("");
  const [gasPrice, setGasPrice] = useState({});
  const [beerPrice, setBeerPrice] = useState("");

  //const Context = useContext(DataContext);

  // useEffect(() => {
  //   console.log();
  // }, []);

  const handleOpen = (event) => {
    setOpen(true);
    const cityState = event.target.getAttribute("location");

    API.ItemPrices(cityState).then((res) => {
      setBeerPrice(JSON.stringify(res.prices[13].average_price));
    });

    API.CostOfLiving(cityState).then((res) => {
      setCostLiving(JSON.stringify(res));
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p onClick={handleOpen} location={props.location}>
        {props.children}
      </p>
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
            <p id="transition-modal-description">
              Cost of living index of {props.location} is {costLiving}
            </p>
            <p id="transition-modal-description"></p>
            <table>
              <tbody>
                <tr className="gasoline">
                  <td>Gasoline (1 liter)</td>
                  <td className="gasPrice"></td>
                </tr>
                <tr>
                  <td>Domestic Beer (0.5 liter draft)</td>
                  <td>{beerPrice}</td>
                </tr>
                <tr>
                  <td>Meal, Inexpensive Restaurant, Restaurants</td>
                  <td>$100</td>
                </tr>
                <tr>
                  <td>
                    Basic (Electricity, Heating, Cooling, Water, Garbage) for
                    85m2 Apartment, Utilities (Monthly)
                  </td>
                  <td>$100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import API from "../../utils/API";
import { DataContext } from "../APIInput";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

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
  const [open, setOpen] = useState(false);
  const [costLiving, setCostLiving] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [beerPrice, setBeerPrice] = useState("");
  const [mealPrice, setMealPrice] = useState("");
  const [basicPrice, setBasicPrice] = useState("");

  //const Context = useContext(DataContext);

  // useEffect(() => {
  //   console.log();
  // }, []);

  const findPrice = (res, string) => {
    const price = res.find((obj) => obj.item_name === string);
    return price;
  };

  const toTwoDigit = (num) => {
    return parseInt(num).toFixed(2)
  }

  const handleOpen = (event) => {
    setOpen(true);
    const cityState = event.target.getAttribute("location");
    const justCity = event.target.getAttribute("city");

    API.ItemPrices(cityState).then((res) => {
      if (res.error) {
        API.ItemPrices(justCity).then((res) => {
          setGasPrice(
            findPrice(res.prices, "Gasoline (1 liter), Transportation")
              .average_price / 0.264172
          );
          setBeerPrice(
            findPrice(res.prices, "Domestic Beer (0.5 liter bottle), Markets")
              .average_price
          );
          setMealPrice(
            findPrice(res.prices, "Meal, Inexpensive Restaurant, Restaurants")
              .average_price
          );
          setBasicPrice(
            findPrice(
              res.prices,
              "Basic (Electricity, Heating, Cooling, Water, Garbage) for 85m2 Apartment, Utilities (Monthly)"
            ).average_price
          );
        });
      } else if (res) {
        setGasPrice(
          findPrice(res.prices, "Gasoline (1 liter), Transportation")
            .average_price / 0.264172
        );
        setBeerPrice(
          findPrice(res.prices, "Domestic Beer (0.5 liter bottle), Markets")
            .average_price
        );
        setMealPrice(
          findPrice(res.prices, "Meal, Inexpensive Restaurant, Restaurants")
            .average_price
        );
        setBasicPrice(
          findPrice(
            res.prices,
            "Basic (Electricity, Heating, Cooling, Water, Garbage) for 85m2 Apartment, Utilities (Monthly)"
          ).average_price
        );
      }
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
      <p onClick={handleOpen} location={props.location} city={props.city}>
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
              {costLiving
                ? "Cost of living index of " +
                  props.location +
                  " is " +
                  toTwoDigit(costLiving)
                : "There is no Cost of Living Index available for this area."}
            </p>
            <p id="transition-modal-description"></p>
            <table>
              <tbody>
                <tr className="gasoline">
                  <td>Gasoline (1 Gallon)</td>
                  <td className="gasPrice">{formatter.format(gasPrice)}</td>
                </tr>
                <tr>
                  <td>Domestic Beer (0.5 liter draft)</td>
                  <td>{formatter.format(beerPrice)}</td>
                </tr>
                <tr>
                  <td>Meal, Inexpensive Restaurant, Restaurants</td>
                  <td>{formatter.format(mealPrice)}</td>
                </tr>
                <tr>
                  <td>
                    Basic (Electricity, Heating, Cooling, Water, Garbage) for
                    85m2 Apartment, Utilities (Monthly)
                  </td>
                  <td>{formatter.format(basicPrice)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

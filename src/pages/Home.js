import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import API from "../utils/API";
import SubmitBtn from "../components/SubmitBtn";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import ModalCard from "../components/Modal";
import Slider from "../components/Slider";
import Wrapper from "../components/Wrapper";

import { toast } from "react-toastify";

import { FullPercentiles } from "../utils/constant";
import "react-toastify/dist/ReactToastify.css";

import "./Home.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    table: {
      minWidth: 650,
    },
  },
  cellHidden: {
    display: "hidden",
  },
}));

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const toTwoDigit = (num) => {
  return parseInt(num).toFixed(2);
};

const binarySearch = (target) => {
  const array = Object.values(FullPercentiles);
  const underTenPercentage = "under 10";
  const upperNinetyPercentage = "upper 90";
  let startIndex = 0;
  let endIndex = array.length - 1;

  if (target < array[startIndex]) {
    return underTenPercentage;
  }
  if (target > array[endIndex]) {
    return upperNinetyPercentage;
  }
  while (startIndex <= endIndex) {
    let middleIndex = Math.floor((startIndex + endIndex) / 2);
    if (target >= array[middleIndex] && target < array[middleIndex + 1]) {
      return middleIndex + 10;
    }
    if (target > array[middleIndex]) {
      startIndex = middleIndex + 1;
    }
    if (target < array[middleIndex]) {
      endIndex = middleIndex - 1;
    }
  }
};

// (function () {
//   var cors_api_host = "cors-anywhere.herokuapp.com";
//   var cors_api_url = "https://" + cors_api_host + "/";
//   var slice = [].slice;
//   var origin = window.location.protocol + "//" + window.location.host;
//   var open = XMLHttpRequest.prototype.open;
//   XMLHttpRequest.prototype.open = function () {
//     var args = slice.call(arguments);
//     var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
//     if (
//       targetOrigin &&
//       targetOrigin[0].toLowerCase() !== origin &&
//       targetOrigin[1] !== cors_api_host
//     ) {
//       args[1] = cors_api_url + args[1];
//     }
//     return open.apply(this, args);
//   };
// })();

export default function Home(props) {
  const token = props.token;
  const classes = useStyles();

  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");
  const [result, setResult] = useState("");
  const [zipResult, setZipResult] = useState([]);
  const [saveJobArray, setSavedJobArray] = useState([]);

  const findPrice = (res, string) => {
    if (!res) return 0;
    const price = res.find((obj) => obj.item_name === string);
    return price;
  };

  const filterPrice = (res, string) => {
    if (findPrice(res.prices, string)) {
      return findPrice(res.prices, string).average_price;
    } else {
      return;
    }
  };

  const itemAPI = (item) => {
    const cityState = item.city + ", " + item.state;
    const justCity = item.city;
    return new Promise((resolve, reject) => {
      API.CostOfLiving(cityState)
        .then((res) => {
          const costLiving = JSON.stringify(res);
          const newItem = { ...item, costLiving };
          return newItem;
        })
        .then((item) => {
          API.ItemPrices(cityState).then((res) => {
            if (res.error) {
              API.ItemPrices(justCity).then((res) => {
                const gasPrice =
                  filterPrice(res, "Gasoline (1 liter), Transportation") /
                  0.264172;
                const beerPrice = filterPrice(
                  res,
                  "Domestic Beer (0.5 liter bottle), Markets"
                );
                const mealPrice = filterPrice(
                  res,
                  "Meal, Inexpensive Restaurant, Restaurants"
                );
                const rentPrice = filterPrice(
                  res,
                  "Apartment (1 bedroom) Outside of Centre, Rent Per Month"
                );
                const basicPrice = filterPrice(
                  res,
                  "Basic (Electricity, Heating, Cooling, Water, Garbage) for 85m2 Apartment, Utilities (Monthly)"
                );
                const newItem = {
                  ...item,
                  gasPrice,
                  beerPrice,
                  mealPrice,
                  rentPrice,
                  basicPrice,
                };
                resolve(newItem);
              });
            } else if (res) {
              const gasPrice =
                filterPrice(res, "Gasoline (1 liter), Transportation") /
                0.264172;
              const beerPrice = filterPrice(
                res,
                "Domestic Beer (0.5 liter bottle), Markets"
              );
              const mealPrice = filterPrice(
                res,
                "Meal, Inexpensive Restaurant, Restaurants"
              );
              const rentPrice = filterPrice(
                res,
                "Apartment (1 bedroom) Outside of Centre, Rent Per Month"
              );
              const basicPrice = filterPrice(
                res,
                "Basic (Electricity, Heating, Cooling, Water, Garbage) for 85m2 Apartment, Utilities (Monthly)"
              );
              const newItem = {
                ...item,
                gasPrice,
                beerPrice,
                mealPrice,
                rentPrice,
                basicPrice,
              };
              resolve(newItem);
            }
          });
        })
        .catch((err) => reject(err));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (job === "" && location === "" && range === "") {
      toast.success("Displaying most recently posted jobs in the USA");
    }

    const res = await API.usaJobs(job, location, range, result);
    const jobsPromises = res.jobs.map((job) => itemAPI(job));
    const items = await Promise.all(jobsPromises);
    setZipResult(items);
  };

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleJobSave = (data) => {
    const {
      id,
      name,
      hiring_company,
      location,
      snippet,
      job_age,
      url,
      city,
      state,
      posted_time,
    } = data;

    const company = hiring_company.name;

    const savedJobs = () => {
      fetch(`${backendUrl}/jobs`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jobId: id,
          userId: token.id,
          name,
          company,
          location,
          snippet,
          job_age,
          url,
          city,
          state,
          posted_time,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success("Job saved to profile");

          fetch(`${backendUrl}/jobs/${token.id}`)
            .then((res) => res.json())
            .then((response) => {
              const { data } = response;
              setSavedJobArray(data);
            });
        });
    };
    if (token) {
      savedJobs();
    } else {
      toast.error("Must be logged in to save");
    }
  };

  useEffect(() => {
    if (token) {
      console.log(`${backendUrl}/jobs/${token.id}`);
      fetch(`${backendUrl}/jobs/${token.id}`)
        .then((res) => res.json())
        .then((response) => {
          const { data } = response;
          setSavedJobArray(data);
        });
    }
  }, [token, backendUrl]);

  const savedJobsIds = saveJobArray.map((job) => job.jobId);

  return (
    <div token={props.token}>
      <h1 className="center">Search for a Job</h1>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          margin: "50px",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          required
          label="Job Keyword"
          placeholder="ex. Engineer"
          variant="outlined"
          onChange={(e) => setJob(e.target.value)}
          value={job}
        />

        <TextField
          required
          label="Location"
          placeholder="ex. Berkeley"
          variant="outlined"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
        />

        <TextField
          required
          label="Mile Radius"
          placeholder="ex. 25"
          variant="outlined"
          onChange={(e) => setRange(e.target.value)}
          value={range}
        />
        <Slider onChange={(e) => setResult(e)} />
        <br></br>

        <SubmitBtn type="submit" handleSubmit={handleSubmit}>
          Submit
        </SubmitBtn>
      </form>

      <div>
        <h4 className="center" style={{ color: "darkslategray" }}>
          Click on a Job Title or Location to learn more about the cost of
          living
        </h4>

        <Wrapper>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <strong>Job Title</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Gasoline</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Beer</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Meal</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>1BR Apt</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Utilities</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Pay %</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Company</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Cost Of Living</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Salary</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Summary</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Days Posted</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Application</strong>
                  </TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zipResult
                  .filter((job) => !savedJobsIds.includes(job.id))
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        <ModalCard
                          location={row.city + ", " + row.state}
                          city={row.city}
                          name={row.name}
                        >
                          {row.name}
                        </ModalCard>
                      </TableCell>
                      <TableCell align="left">
                        {isNaN(row.gasPrice)
                          ? "Cost Unavailable"
                          : formatter.format(row.gasPrice)}
                      </TableCell>
                      <TableCell align="left">
                        {isNaN(row.beerPrice)
                          ? "Cost Unavailable"
                          : formatter.format(row.beerPrice)}
                      </TableCell>
                      <TableCell align="left">
                        {isNaN(row.mealPrice)
                          ? "Cost Unavailable"
                          : formatter.format(row.mealPrice)}
                      </TableCell>
                      <TableCell align="left">
                        {isNaN(row.rentPrice)
                          ? "Cost Unavailable"
                          : formatter.format(row.rentPrice)}
                      </TableCell>
                      <TableCell align="left">
                        {isNaN(row.basicPrice)
                          ? "Cost Unavailable"
                          : formatter.format(row.basicPrice)}
                      </TableCell>
                      <TableCell>
                        {binarySearch(row.salary_max_annual) + "%"}
                      </TableCell>
                      <TableCell align="left">
                        {row.hiring_company.name}
                      </TableCell>
                      <TableCell align="left">
                        <ModalCard
                          location={row.city + ", " + row.state}
                          city={row.city}
                          name={row.name}
                        >
                          {row.location}
                        </ModalCard>
                      </TableCell>
                      <TableCell align="left">
                        {toTwoDigit(row.costLiving)}
                      </TableCell>
                      <TableCell align="left">
                        {row.salary_max_annual}
                      </TableCell>
                      <TableCell align="left">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="snippetLink"
                        >
                          <p
                            dangerouslySetInnerHTML={{ __html: row.snippet }}
                          />
                        </a>
                      </TableCell>
                      <TableCell align="left">{row.job_age}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Apply
                        </Button>
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleJobSave(row)}
                        >
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/hihodiamond.png"
                            }
                            className="diamond"
                            alt="diamond"
                          />
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Wrapper>
      </div>
    </div>
  );
}

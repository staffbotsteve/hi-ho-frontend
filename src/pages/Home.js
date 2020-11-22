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

export default function Home(props) {
  const token = props.token;
  const classes = useStyles();

  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");
  const [result, setResult] = useState("25");
  const [zipResult, setZipResult] = useState([]);
  const [saveJobArray, setSavedJobArray] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (job === "" && location === "" && range === "") {
      toast.success("Displaying most recently posted jobs in the USA");
    }

    const res = await API.usaJobs(job, location, range, result);
    setZipResult(res);
    console.log("zipResult", zipResult);
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
      //console.log(`${backendUrl}/jobs/${token.id}`);
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
              <TableHead className="tableHead">
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
                    <TableRow key={row.MatchedObjectDescriptor.PositionID}>
                      <TableCell component="th" scope="row">
                        <ModalCard
                          location={
                            row.MatchedObjectDescriptor.PositionLocation[0]
                              .CityName
                          }
                          city={
                            row.MatchedObjectDescriptor.PositionLocation[0].CityName.split(
                              ","
                            )[0]
                          }
                          name={row.MatchedObjectDescriptor.OrganizationName}
                        >
                          {row.MatchedObjectDescriptor.OrganizationName}
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
                        {binarySearch(
                          row.MatchedObjectDescriptor.PositionRemuneration[0]
                            .MaximumRange
                        ) + "%"}
                      </TableCell>
                      <TableCell align="left">
                        {row.MatchedObjectDescriptor.OrganizationName}
                      </TableCell>
                      <TableCell align="left">
                        <ModalCard
                          location={
                            row.MatchedObjectDescriptor.PositionLocation[0]
                              .CityName
                          }
                          city={
                            row.MatchedObjectDescriptor.PositionLocation[0].CityName.split(
                              ","
                            )[0]
                          }
                          name={row.MatchedObjectDescriptor.OrganizationName}
                        ></ModalCard>
                        {
                          row.MatchedObjectDescriptor.PositionLocation[0]
                            .CityName
                        }
                      </TableCell>
                      <TableCell align="left">
                        {toTwoDigit(row.costLiving)}
                      </TableCell>
                      <TableCell align="left">
                        {
                          row.MatchedObjectDescriptor.PositionRemuneration[0]
                            .MaximumRange
                        }
                      </TableCell>
                      <TableCell align="left">
                        <a
                          href={row.MatchedObjectDescriptor.PositionURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="snippetLink"
                        >
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                row.MatchedObjectDescriptor.UserArea.Details
                                  .JobSummary,
                            }}
                          />
                        </a>
                      </TableCell>
                      <TableCell align="left">
                        {row.MatchedObjectDescriptor.PositionStartDate}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          href={toString(row.MatchedObjectDescriptor.ApplyURI)}
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

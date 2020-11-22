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
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import TableHeader from "../components/TableHeader";
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
    console.log("zipResult", res);
    setZipResult(res);
  };

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleJobSave = ({ MatchedObjectDescriptor }) => {
    const {
      PositionID,
      PositionTitle,
      OrganizationName,
      PositionStartDate,
      PositionURI,
    } = MatchedObjectDescriptor;

    const savedJobs = () => {
      fetch(`${backendUrl}/jobs`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jobId: PositionID,
          userId: token.id,
          name: PositionTitle,
          company: OrganizationName,
          location: MatchedObjectDescriptor.PositionLocation[0].CityName,
          snippet: MatchedObjectDescriptor.UserArea.Details.JobSummary,
          url: PositionURI,
          posted_time: PositionStartDate,
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
              <TableHeader>Save</TableHeader>
              <TableBody>
                {zipResult
                  .filter((job) => !savedJobsIds.includes(job.id))
                  .map((row) => (
                    <TableRow
                      className="table-row-flex"
                      key={row.MatchedObjectDescriptor.PositionID}
                    >
                      <TableCell className="mobile-description">
                        Job Title
                      </TableCell>
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
                          {row.MatchedObjectDescriptor.PositionTitle}
                        </ModalCard>
                      </TableCell>
                      <TableCell className="mobile-description">
                        Pay %
                      </TableCell>
                      <TableCell>
                        {binarySearch(
                          row.MatchedObjectDescriptor.PositionRemuneration[0]
                            .MaximumRange
                        ) + "%"}
                      </TableCell>
                      <TableCell className="mobile-description">
                        Company Name
                      </TableCell>
                      <TableCell align="left">
                        {row.MatchedObjectDescriptor.OrganizationName}
                      </TableCell>
                      <TableCell className="mobile-description">
                        Location
                      </TableCell>
                      <TableCell align="left">
                        {row.MatchedObjectDescriptor.PositionLocation.length >
                        1 ? (
                          <select name="location" className="SelectOption">
                            {row.MatchedObjectDescriptor.PositionLocation.map(
                              (item) => (
                                <option
                                  key={Math.random()}
                                  value={item.CityName}
                                >
                                  {item.CityName.slice(0, 25)}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          row.MatchedObjectDescriptor.PositionLocation[0]
                            .CityName
                        )}
                      </TableCell>
                      <TableCell className="mobile-description">
                        Salary
                      </TableCell>
                      <TableCell align="left">
                        {formatter.format(
                          row.MatchedObjectDescriptor.PositionRemuneration[0]
                            .MinimumRange
                        )}
                        --
                        {formatter.format(
                          row.MatchedObjectDescriptor.PositionRemuneration[0]
                            .MaximumRange
                        )}
                      </TableCell>
                      <TableCell className="mobile-description">
                        Summary
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
                              __html: row.MatchedObjectDescriptor.UserArea.Details.JobSummary.slice(
                                0,
                                99
                              ),
                            }}
                          />
                        </a>
                      </TableCell>
                      <TableCell className="mobile-description">
                        Posted Date
                      </TableCell>
                      <TableCell align="left">
                        {row.MatchedObjectDescriptor.PositionStartDate}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          href={row.MatchedObjectDescriptor.ApplyURI[0]}
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

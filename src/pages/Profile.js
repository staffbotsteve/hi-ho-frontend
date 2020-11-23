import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from "@material-ui/core";
import Wrapper from "../components/Wrapper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileModal from "../components/ProfileModal";
import TableHeader from "../components/TableHeader";
import MappedTable from "../components/MappedTable";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Profile = ({ token }) => {
  const [data, setData] = useState({});
  const [zipResult, setZipResult] = useState([]);

  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const updateProfile = () => {
      fetch(`${url}/me/${token.id}`, {
        headers: {
          Authorization: accessToken,
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          console.log("got hereeee");
          const { data } = response;

          if (response.success) {
            setData(data);
            console.log("data profile", response);
          }
        });

      fetch(`${url}/jobs/${token.id}`)
        .then((res) => res.json())
        .then((response) => {
          const { data } = response;
          console.log("data", data);
          setZipResult(data);
        });
    };
    if (token) {
      updateProfile();
    }
  }, [accessToken, token, url]);

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleJobDelete = (row) => {
    const jobId = row.jobId;

    if (!token) {
      toast.error("Must be logged in to delete");
    } else {
      fetch(`${backendUrl}/jobs/:` + jobId, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: token.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success("Job successfully deleted");
          fetch(`${url}/jobs/${token.id}`)
            .then((res) => res.json())
            .then((response) => {
              const { data } = response;
              console.log("data", data);
              setZipResult(data);
            });
        });
    }
  };

  const classes = useStyles();

  const { firstName, lastName, email, phone } = data;

  return (
    <div>
      <Wrapper>
        <h1 style={{ textAlign: "center" }}>
          Welcome {firstName} {lastName}
        </h1>
        <h3 style={{ textAlign: "center" }}>Email: {email}</h3>
        <h3 style={{ textAlign: "center" }}>Phone Number: {phone}</h3>
        <ProfileModal data={data} setData={setData} />
        <br></br>
        <h2 className="center">Your Saved Jobs</h2>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHeader>Delete</TableHeader>
            <TableBody>
              {zipResult.map((row) => (
                <MappedTable
                  key={row.jobId}
                  location={row.location}
                  name={row.company}
                  title={row.name}
                  minSalary={row.minSalary}
                  maxSalary={row.maxSalary}
                  snippet={row.snippet}
                  positionURL={row.url}
                  applyURL={row.applyURL}
                  postedDate={row.posted_time}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleJobDelete(row)}
                  >
                    Delete
                  </Button>
                </MappedTable>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Wrapper>
    </div>
  );
};

export default Profile;

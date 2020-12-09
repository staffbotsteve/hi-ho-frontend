import React, { useState } from "react";
import "./style.css";
import { TableCell, TableRow, Button } from "@material-ui/core";
import ModalCard from "../Modal";
import { FullPercentiles } from "../../utils/constant";

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

export default function MappedTable(props) {
  const [cityState, setCityState] = useState(props.location[0].CityName);

  const selectChange = (event) => {
    setCityState(event.target.value);
  };

  return (
    <TableRow className="table-row-flex">
      <TableCell className="mobile-description">Job Title</TableCell>
      <TableCell component="th" scope="row">
        <ModalCard
          location={cityState}
          city={cityState.split(",")[0]}
          name={props.name}
        >
          {props.title}
        </ModalCard>
      </TableCell>
      <TableCell className="mobile-description">Pay %</TableCell>
      <TableCell>{binarySearch(props.maxSalary) + "%"}</TableCell>
      <TableCell className="mobile-description">Company Name</TableCell>
      <TableCell align="left">{props.name}</TableCell>
      <TableCell className="mobile-description">Location</TableCell>
      <TableCell align="left">
        {props.location.length > 1 ? (
          <select
            name="location"
            className="SelectOption"
            onChange={selectChange}
            value={cityState}
          >
            {props.location.map((item) => (
              <option key={Math.random()} value={item.CityName}>
                {item.CityName.slice(0, 25)}
              </option>
            ))}
          </select>
        ) : (
          props.location[0].CityName
        )}
      </TableCell>
      <TableCell className="mobile-description">Salary</TableCell>
      <TableCell align="left">
        {formatter.format(props.minSalary)}
        --
        {formatter.format(props.maxSalary)}
      </TableCell>
      <TableCell className="mobile-description">Summary</TableCell>
      <TableCell align="left">
        <a
          href={props.positionURL}
          target="_blank"
          rel="noopener noreferrer"
          className="snippetLink"
        >
          <p
            dangerouslySetInnerHTML={{
              __html: props.snippet.slice(0, 99),
            }}
          />
        </a>
      </TableCell>
      <TableCell className="mobile-description">Posted Date</TableCell>
      <TableCell align="left">{props.postedDate}</TableCell>
      <TableCell align="left">
        <Button
          variant="contained"
          color="primary"
          href={props.applyURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply
        </Button>
      </TableCell>
      <TableCell align="left">{props.children}</TableCell>
    </TableRow>
  );
}

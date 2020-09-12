import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';



const longText = `
Enter the number of miles you would like to use for your search radius. EX. An input of "25" will search for jobs within a 25 mile radius of your desired location.
`;

export default function Help() {

  return (
    <div>
      <Tooltip title={longText}>
      <HelpOutlineIcon />
      </Tooltip>
    </div>
  );
}

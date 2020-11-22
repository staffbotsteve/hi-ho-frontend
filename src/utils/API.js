import axios from "axios";

export default {
  // zipRecruiter: function (job, location, range, numResult) {
  //   return axios.get(
  //     "https://api.ziprecruiter.com/jobs/v1?search=" +
  //       job +
  //       "&location=" +
  //       location +
  //       "&radius_miles=" +
  //       range +
  //       "&days_ago=&jobs_per_page=" + numResult + "&page=1&api_key=" + process.env.REACT_APP_ZIPRECRUITER_ KEY
  //   ).then((res) => {
  //     return res.data
  //   })
  // },
  usaJobs: function (job, location, range, numResult) {
    return axios
      .get(
        "https://data.usajobs.gov/api/search?Keyword=" +
          job +
          "&LocationName=" +
          location +
          "&Radius" +
          range +
          "&ResultsPerPage=" +
          numResult,
        {
          headers: {
            "Authorization-Key": process.env.REACT_APP_API_KEY,
          },
        }
      )
      .then((res) => {
        return res.data.SearchResult.SearchResultItems;
      });
  },
  ItemPrices: function (location) {
    return axios
      .get(
        "https://www.numbeo.com/api/city_prices?api_key=" +
          process.env.REACT_APP_NUMBEO_KEY +
          "&query=" +
          location
      )
      .then((res) => {
        return res.data;
      });
  },
  CostOfLiving: function (location) {
    return axios
      .get(
        "https://www.numbeo.com/api/indices?api_key=" +
          process.env.REACT_APP_NUMBEO_KEY +
          "&query=" +
          location
      )
      .then((res) => {
        return res.data.cpi_and_rent_index;
      });
  },
};

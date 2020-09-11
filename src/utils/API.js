import axios from "axios";

export default {
  zipRecruiter: function (job, location, range) {
    return axios.get(
      "https://api.ziprecruiter.com/jobs/v1?search=" +
        job +
        "&location=" +
        location +
        "&radius_miles=" +
        range +
        "&days_ago=&jobs_per_page=10&page=1&api_key=un8v7z7yk9yyiuquy49vj9tnduejbwc8"
    ).then((res) => {
      console.log(res.data)
    })
  },
  ItemPrices: function (location) {
    return axios.get(
      "https://www.numbeo.com/api/city_prices?api_key=g1qic1xvvmr7h7&query=" + location
    ).then((res) => {
      console.log(res.data.entry)
    })
  },
  CostOfLiving: function (location) {
    return axios.get(
      "https://www.numbeo.com/api/indices?api_key=g1qic1xvvmr7h7&query=" + location
    ).then((res) => {
      console.log(res.data.cpi_and_rent_index)
    })
  },
};

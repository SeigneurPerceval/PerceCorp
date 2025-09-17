const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
app.use(
  cors({
  origin: "*",
})
)

// app.get("/", (req, res) => {
//   axios.get("https://proclubs.ea.com/api/fc/members/stats?platform=common-gen5&clubId=5272461")
//   .then(response => {
//     res.send(response.data);
//   })
//   .catch(error => {
//     console.log(error)
//   })
// })

app.listen(3000);
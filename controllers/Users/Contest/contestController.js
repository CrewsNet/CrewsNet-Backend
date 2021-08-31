const axios = require("axios");
const express = require("express");

exports.contests = async (req, res) => {
  const response = await axios.get("https://kontests.net/api/v1/all");
  const con = response.data;
  console.log(con);

  res.status(200).json({
    data: con,
  });
};

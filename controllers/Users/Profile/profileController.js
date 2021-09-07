const express = require("express");

exports.profile = (req, res) => {
  const user = req.user;
  console.log(user);
  res.status(200).json({
    message: "Success",
    data: user,
  });
};

exports.getInfo = (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "Success",
    data: user.name,
    email: user.email,
  });
};

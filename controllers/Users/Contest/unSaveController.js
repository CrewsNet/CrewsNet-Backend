exports.unSave = (req, res) => {
  const user = req.user;

  const {
    name,
    url,
    start_time,
    end_time,
    duration,
    site,
    in_24_hours,
    status,
  } = req.body;

  const arr = user.savedContest.filter((obj) => {
    return obj.url === url;
  });

  user.savedContest = arr;

  res.status(200).json({
    message: "Success",
    data: user,
  });
};

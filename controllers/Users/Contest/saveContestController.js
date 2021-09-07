var _ = require("lodash");

exports.saveContest = (req, res) => {
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

  console.log(user);
  user.savedContest.map((contest) => {
    const check =
      contest.url == url &&
      JSON.stringify(contest.start_time) == JSON.stringify(start_time);
    if (check == true) {
      return res.status(400).json({ message: "This contest already exists" });
    }
  });

  user.savedContest.push({
    name,
    url,
    start_time,
    end_time,
    duration,
    site,
    in_24_hours,
    status,
  });

  user.save();

  res.status(200).json({
    message: "Success",
    data: user.savedContest,
  });
};

exports.getSavedContest = (req, res) => {
  const user = req.user;

  // const ar = _.sortBy(user.savedContest, "start_time");
  // console.log(user.savedContest);

  user.savedContest.sort(function (a, b) {
    var keyA = new Date(a.start_time),
      keyB = new Date(b.start_time);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  const contest = user.savedContest;
  res.status(200).json({
    message: "Success",
    data: contest,
  });
};

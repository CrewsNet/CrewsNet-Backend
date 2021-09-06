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
    data: user,
  });
};

exports.getSavedContest=(req,res)=>{
    const user=req.user
    const contest=user.savedContest
    res.status(200).json({
        message:"Success",
        data:contest

    })
}

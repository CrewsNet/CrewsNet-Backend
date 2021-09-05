exports.unSave = (req, res) => {
  const user = req.user

  const { name, url, start_time, end_time, duration, site, in_24_hours, status } = req.body

  const arr = user.savedContest.filter((obj) => {
    console.log(obj.url, url, "      ", JSON.stringify(obj.start_time), JSON.stringify(start_time))
    console.log(obj.url === url && JSON.stringify(obj.start_time) === JSON.stringify(start_time))
    return !(obj.url === url && JSON.stringify(obj.start_time) === JSON.stringify(start_time))
  })

  // console.log(arr)

  user.savedContest = arr
  user.save()
  res.status(200).json({
    message: "Success",
    data: user,
  })
}

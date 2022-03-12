module.exports = async (req, res, next) => {
  const universityId = req.params['universityId']

  const universityRole = (await req.user.getRoles({
    where: {
      name: `student_university_${universityId}`
    }
  }))[0]

  if (!universityRole) {
    return res.sendStatus(403)
  }

  next()
}

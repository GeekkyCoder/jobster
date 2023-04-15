const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  // lookin for the jobs related to user logged in!
  const queryObject = {
    createdBy: req.user.userId,
  };

  // req.query to access query paramters from request
  const { search, status, jobType, sort } = req.query;

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  if (status && status!=="all") {
    queryObject.status = status;
  }

  if (jobType && jobType!=="all") {
    queryObject.jobType = jobType;
  }

  let results = Job.find(queryObject);

  if (sort && sort === "latest") {
    results = results.sort("-createdAt");
  } else if (sort === "oldest") {
    results = results.sort("createdAt");
  } else if (sort === "a-z") {
    results = results.sort("position");
  } else {
    results = results.sort("-position");
  }

  const jobs = await results;
  console.log(jobs);
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
};
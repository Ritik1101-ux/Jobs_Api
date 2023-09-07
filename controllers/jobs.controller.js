import BadRequestError from "../errors/bad-request.js";
import CustomAPIError from "../errors/custom-api.js";
import { StatusCodes } from "http-status-codes";
import JobModel from "../models/Job.model.js";
import {NotFoundError} from '../errors/index.js';

const getAllJobs = async (req, res) => {
    const jobs = await JobModel.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

const createJob = async (req, res, next) => {
    req.body.createdBy = req.user.userId;
    const { company, role, createdBy } = req.body;

    if (!company || !role) {
        throw (new BadRequestError('Please Provide Company and Job Role'))
    }

    const job = await JobModel.create({ company, role, createdBy });

    res.status(StatusCodes.OK).json({ job });
}
const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await JobModel.findOne({
        _id: jobId,
        createdBy: userId
    })

    if (!job) {
        throw (new NotFoundError('No Job Found for thr id'))
    }

    res.status(StatusCodes.OK).json({ job });
}

const updateJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
        body: { company, role }
    } = req;

    if (company === '' || role === '') {
        throw (new BadRequestError('Company or Position cannot be Empty'));
    }

    const job = await JobModel.findByIdAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true });

    if (!job) {
        throw (new NotFoundError('No Job Found for thr id'))
    }

    res.status(StatusCodes.OK).json({ job });
}

const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await JobModel.findByIdAndRemove({ _id: jobId, createdBy: userId });

    if (!job) {
        throw (new NotFoundError('No Job Found for thr id'))
    }

    res.status(StatusCodes.OK).json({ job });
}

export { getAllJobs, getJob, createJob, updateJob, deleteJob }
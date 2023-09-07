import express from 'express';
import { createJob, deleteJob, getAllJobs, getJob, updateJob } from '../controllers/jobs.controller.js';


const JobRouter= express.Router();


JobRouter.route('/').post(createJob).get(getAllJobs);
JobRouter.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

export default JobRouter;
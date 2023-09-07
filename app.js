import * as dotenv from 'dotenv';
import 'express-async-errors';
import connectDB from './db/connect.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import AuthRouer from './routes/auth.route.js';
import JobRouter from './routes/jobs.route.js';
import express from 'express'
import AuthenticatorMiddleware from './middleware/authentication.js';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
dotenv.config();

app.set('trust proxy',1)

app.use(rateLimit({
  windowMs:15*60*1000, //15 Minutes
  max:100 //Limit each Ip to 100 Per windowsMs
}));

app.use(express.json());
app.use(helmet());// Helmet secures your express app by setting response HTTP headers appropriately, 
app.use(cors())// Cors enables your express application access control to allow restricted resources from being accessed from external domains
app.use(xss());//Cross-site scripting (XSS) is a type of security exploit that allows attackers to inject malicious scripts on websites using client code
// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth',AuthRouer);
app.use('/api/v1/jobs',AuthenticatorMiddleware,JobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
 
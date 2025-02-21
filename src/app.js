import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://transcendent-cajeta-819efd.netlify.app",
        "https://travelbd-158bd.web.app",
        "http://localhost:4173",
        "https://cs1m1jdk-5173.inc1.devtunnels.ms"
    ],
    credentials: true
}));
app.use(express.json())
app.use(express.static('../public/upload'))
app.use(cookieParser())


// route import
import userRoute from './routes/user.routes.js';
import destinationsRoute from './routes/destination.routes.js';
import hotelRoute from './routes/hotel.routes.js';


// route declaration
app.use('/api/v1', userRoute);
app.use('/api/v1', destinationsRoute);
app.use('/api/v1', hotelRoute)

export {app}
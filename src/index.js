import dotenv from 'dotenv';
dotenv.config({path:'../.env'});
import connectDB from './db/index.js';
import { app } from './app.js';
const port = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.on('error', (error) => {

        throw(error)
    })
app.get('/', (req,res) => {
    res.send('TravelBD server is ready')
})


app.listen(port, () => {
    console.log(`Server running at PORT:${port}`)
})

})

/* Package Imports */
import express from 'express'
import dotenv from 'dotenv'


/* Routes Imports */
import authRoutes from './routes/auth.routes.js'
import setDataRoutes from './routes/setdata.routes.js'
import getDataRoutes from './routes/getdata.routes.js'


/* Other Esssential imports */
import connectToMongoDB from './config/db.js'
import cookieParser from 'cookie-parser'


const app = express()

dotenv.config() // setup .env
const port = process.env.PORT || 5000 // Port is 8000 or 5000

app.use(express.json()) // This helps to parse the req in json
app.use(cookieParser()) // Used for cookies

/** Routes */
app.use('/auth',authRoutes)      // authentication routes
app.use('/setdata',setDataRoutes)// upadate and set data routes
app.use('/getdata',getDataRoutes)// get data routes


app.listen(port,async()=>
   { await connectToMongoDB()
    console.log(`Server is running on port ${port}`)}
)
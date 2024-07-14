import express from 'express'
import connectDB from './db/connection.js';
import { AppError } from './src/utils/AppError.js';
import companyRouter from './src/modules/company/company.routes.js';
import jobRouter from './src/modules/job/job.routes.js';
import userRouter from './src/modules/user/user.routes.js';
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
connectDB()

app.use("/users", userRouter)
app.use("/companies", companyRouter)
app.use("/jobs", jobRouter)

//^ Handling not found routes 
app.use("*", (res, req, next) => {
  const err = new AppError("Page Not Found!", 404)
  next(err)
})


//* Global error handling  
app.use((err, req, res, next) => {
  res.status(err.statuScode || 500).json({ message: err.message })
})

app.listen(port, () => console.log(`Job search app listening on port ${port}!`))


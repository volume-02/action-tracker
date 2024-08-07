import express, { Request, Response, Application } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

app.get('/', (req: Request, res: Response) => {
    res.send('hello world!')
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

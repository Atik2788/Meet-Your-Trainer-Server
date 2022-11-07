const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

// middleWare
app.use(cors())
app.use(express.json())

// dbUser: practice-01
// dbPass: AhZS2EHb1XSOz4op





app.get('/', (req, res)=>{
    res.send('Hello world')
})
 


app.listen(port, () =>{
    console.log(`app running on port: ${port}`)
})
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000

const app = express()
app.listen(PORT, ()=> console.log(`listening to the port: ${PORT}`))

app.use(express.static(path.join(__dirname, 'public')))

const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const {User} = require('./models/User')
const config = require('./config/key')

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connecte .. '))
  .catch(err => console.log('err'))

app.get('/', (req, res) => res.send('Hello World!!!!!!!'))

app.post('/register', (req, res) =>{
  // 회원 가입 시 필요한 정보를 db에 넣는다.
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({success: true})
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
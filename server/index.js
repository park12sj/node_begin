const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const {auth} = require('./middleware/auth')

const {User} = require('./models/User')
const config = require('./config/key')

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connect .. '))
  .catch(err => console.log('err'))

app.get('/', (req, res) => res.send('Hello World!!!!!!!'))

app.get('/api/hello', (req, res)=>{


  res.send("Hello")
})

app.post('/api/user/register', (req, res) =>{
  // 회원 가입 시 필요한 정보를 db에 넣는다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({success: true})
  })
})

app.post('/api/user/login', (req, res) => {
  //요청 데이터 찾기(mongo에서), 비밀번호 일치 여부, 토큰 생성
  User.findOne({email: req.body.email}, (err,user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        messate : "no user"
      })
    } else{
      user.comparePassword(req.body.password, (err, isMatch)=>{
        if(!isMatch){
          return res.json({loginSuccess: false, message: "password wrong"})
        } else{
          user.generateToken((err, user) =>{
            if(err) return res.status(400).send(err);
            res.cookie("x_auth", user.token).status(200).json({loginSuccess:true, userId: user._id})
          })
        }
      })
    }
  })
})

app.get('/api/user/auth', auth, (req,res) =>{
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id:req.user._id}, {token: ""}, (err, user)=>{
    if(err) return res.josn({success:false, err})
    return res.status(200).send({sucess:true})
  })
})

const port = 5000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
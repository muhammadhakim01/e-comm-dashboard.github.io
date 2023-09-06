
const express = require('express');
require('./db/config')
const cors = require('cors')
const User = require('./db/user')
const Product = require('./db/Product')
const Jwt = require('jsonwebtoken')
const jwtKey = 'e-comm';
const app =express()
app.use(express.json());
app.use(cors())


app.post('/reg', async (req,resp)=>{
    let user = new User(req.body)
    let result = await user.save()
    result = result.toObject();
    delete result.password;
      Jwt.sign({result}, jwtKey,{expiresIn:"2h"}, (err,token)=>{
        if (err) {
          resp.send({result:"some thing went wrong please try again"})
        }
        resp.send({result, auth:token})

      })
  
})

app.post('/login', async (req,resp)=>{
  console.log(req.body)
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select('-password')
    if (user) {
      Jwt.sign({user}, jwtKey,{expiresIn:"2h"}, (err,token)=>{
        if (err) {
          resp.send({result:"some thing went wrong please try again"})
        }
        resp.send({user, auth:token})

      })
      
    }

  if (user) {
    
  resp.send(user)


  } else {
  resp.send({result:"User Not Found"})
    
  }
  } else {
  resp.send({result:"User Not Found"})
    
  }
  
})

app.post('/add', async (req,resp)=>{
  let product = new Product(req.body)
  let result = await product.save()
  resp.send(result)
})

app.get('/products', async (req,resp)=>{
  let products = await Product.find()
  if (products.length > 0) {
    resp.send(products)
  } else {
    resp.send({result:"No Products Found"})
  }
})

app.delete('/products/:id', async (req,resp)=>{
  let result = await Product.deleteOne({_id: req.params.id})
  resp.send(result)

})

app.get('/product/:id', async(req,resp)=>{
  let result = await Product.findOne({_id: req.params.id});
  if (result) {
    resp.send(result)
  } else {
    resp.send("Not Found")
  }

})

app.put('/product/:id', async (req,resp)=>{
  let result = await Product.updateOne(
    {_id: req.params.id},
    {
      $set: req.body
    }
  )
  resp.send(result)
})

app.get('/search/:key',async (req,resp)=>{
  let result = await Product.find({
    "$or":[
      {name:{ $regex: req.params.key }},
      {price:{$regex: req.params.key}},
      {category:{$regex: req.params.key}},
      {company:{$regex: req.params.key}}
    ]
  })
  resp.send(result)
})

// function verifyToken(req,resp,next){
// const token = req.headers['authorization'];
// console.log('middleware is called',token)
// next()

// }


app.listen(5000,()=>{
    console.log("api is running")
  
})


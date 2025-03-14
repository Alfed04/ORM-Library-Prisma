import {PrismaClient} from '@prisma/client';
const client = new PrismaClient()
import express from 'express';
import jwt from 'jsonwebtoken'
import {z} from 'zod';
const JWT_SECRET = 'Alfed@123'
import bcrypt from 'bcrypt'
const app = express()
app.use(express.json())
//@ts-ignore
app.post('/signup',async(req,res)=>{
    // const requiredBody = z.object({
    //     username:z.string().min(3).max(100),
    //     email:z.string().min(3).max(30).email(),
    //     password:z.string().min(3).max(100)
    // })

    // const parsedBody = requiredBody.safeParse(req.body)
    // console.log(parsedBody)
    // if(!parsedBody.success){
    //     return res.json({
    //         message: "Incorrect Format"
    //     })
    // }
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let errorThrown = false
    try{
    const hashedPassword = await bcrypt.hash(password,5)
    await client.user.create({
        data:{
            username,
            email,
            password:hashedPassword
        }
    })}catch(e){
        res.json({
            message:"User already exists"
        })
        errorThrown=true
    }
    if(!errorThrown){
        return res.json({
            message: "You are signed up"
        })
    }
})

app.post('/signin',async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password
    const user = await client.user.findFirst({
        where : {
            email: email
        }
    })
    console.log(user)
    if(!user){
        res.status(403).json({
            message: "User do not exist in our database"
        })
    }
    //@ts-ignore
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    console.log(isPasswordMatch)
    if(isPasswordMatch){
        const token = jwt.sign({
            id:user?.id
        },JWT_SECRET)
        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})
//@ts-ignore
const auth = (req,res,next)=>{    
    const token = req.headers.token
    const decodeData = jwt.verify(token,JWT_SECRET)
    console.log(decodeData)
    if(decodeData){
        //@ts-ignore
        req.userId = decodeData.id  
        next()
    }
    else{
        res.json({
            message: "Incorrect Credentials"
        })
    }
}


app.post('/todo',auth,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    const done = req.body.done;

    await client.todo.create({
       data:{
        title,
        description,
        done,
        userId:userId
       }
    })
    res.json({
        message: "Todo created"
    })
})

app.get('/todos',auth,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId
    const todos = await client.todo.findMany({
        where:{
            userId:userId
        }
    })
    res.json({
        todos
    })
})
app.listen(3000,()=>{
    console.log("App is listening to the requests coming at port number 3000")
})
import { Client } from "pg";
import express from "express"
import dotenv from "dotenv"

dotenv.config();

const app=express()
app.use(express.json())


const con=new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:process.env.DB_PASSWORD,
    database:'crud'
})



con.connect().then(()=>console.log("connected"))


app.post('/postData',async(req,res)=>{
    const {name,email,password}=req.body;
    const insert_query="INSERT INTO USERS (name,email,password) VALUES ($1,$2,$3)"

    // OLDER SYNTAX
    // con.query(insert_query,[name,email,password],(err,result)=>{
    //     if(err){
    //         res.status(404).send(err)
    //     }else{
    //         console.log(res)
    //         res.send("POSTED DATA")
    //     }
    // })

    try{
        await con.query(insert_query,[name,email,password])
        res.status(201).json({
            message:"User created successfully"
        })
    }catch(err){
        console.error(err)
        res.status(500).json({
            message:"Database error"
        })
    }
})

app.get('/fetchData',async(req,res)=>{
    const fetch_query='SELECT * FROM USERS'
    try{
        const data=await con.query(fetch_query)
        res.status(200).json(data)
    }catch(err){
        console.error(err)
        res.status(500).json({
            message:"Database error"
        })
    }
})

app.put("/updateData/:id",async(req,res)=>{
    const id=req.params.id;
    const {name,email,password}=req.body;
    const update_query="UPDATE USERS SET name=$1,email=$2,password=$3 where id=$4"
    try{
        await con.query(update_query,[name,email,password,id])
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Database error"})
    }
})

app.delete("/deleteData/:id",async(req,res)=>{
    const id=req.params.id;
    const delete_query="DELETE FROM USERS WHERE id=$1"
    try{
        await con.query(delete_query,[id])
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Database error"})
    }
})

app.listen(3000,()=>{
    console.log("server is running")
})
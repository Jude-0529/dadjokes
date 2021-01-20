const express = require("express");
const pg = require("pg");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require('path')
const db = require('db')

const Pool = pg.Pool;
const app = express();

new Pool({
    user: 'postgres',
    password: 'judeskie06',
    host: 'localhost',
    database: 'dadjokes' 
}). connect((err, client) => {
    if (err) {
        console.log("errrorrrrr")
    }else {

        app.use(bodyParser.urlencoded({extended: true}))
        app.set('views', "./views")
        app.set('view engine' , 'ejs')
        app.use(express.static('public'))
        app.use('/image', express.static(__dirname + 'public/image'))

        app.get("/", (req,res) => {

            let whereis = '';
            if(req.query.name){
                console.log(req.query.name);
                whereis = `WHERE u.username ='${req.query.name}'`
            }

            console.log(req.query.name)
        
            client.query(
                `
                Select u.username , j.jokebody  , j.jokesid
                From users as u 
                Inner join jokes as j on u.userid = j.userid
                ${whereis}
                order by j.jokesid desc
                `,
                (error , data) => {
                    if(error) {
                        console.log(error + 'errorrrr')
                    }else {
                        const jokes = data.rows
                        console.log(jokes)
                        res.render('app', {jokes}) 
                    }
                } 
            )

        })

        app.get('/delete' , (req , res) =>{ 
            client.query(
               `
               delete from jokes where jokesid ='${req.query.id}';
               ` , (err) => {
                   if(err){
                        console.log(err)
                   }else{
                       res.redirect('/')
                   }
               }

               
            )
        })

        app.get("/answers" , (req,res) => {

            let where = '';
            if(req.query.topic){
                console.log(req.query.topic);
                where = `WHERE u.username ='${req.query.topic}'`
            }   
            client.query(
                `
                Select j.answer , u.username
                From users as u 
                Inner join jokes as j on u.userid = j.userid
                ${where}
                order by j.jokesid desc
                `,
                (err , data) => {
                    if(err){
                        console.log(err)
                    }else{
                        const ans = data.rows
                        console.log(ans)
                        res.render('answers', {ans})
                    }
                }
            )
        }) 

        


        // app.post('/save' , (req,res) => {
            
        //     console.log(req.body)
        //     client.query(
        //         `INSERT INTO jokes (userid, jokebody, answer) VALUES (${req.body.userid} , ${req.body.jokebody} , ${req.body.jokeanswer})` , 
        //     (error , result) => {
        //         if(error){
        //             console.log(error)
        //         }else {
        //             res.redirect('app')
        //         }
        //     })
        // })

        // app.get('/writejoke' , (req , res) => {
        //   res.render('writejoke') 
        // })


        app.get('/style.css', (req,res) =>{
            fs.readFile('./style.css',(err,content) =>{
                if (err){
                    console.log("oofff")
                }else {
                    res.writeHead(200 , {
                        'Content-Type':'text/css'
                    });
                    res.end(content.toString());
                }
            })
        })



        app.listen(5000, (err) =>{
            if (err){
                console.log("problema sa lipunan")
             return;
            }
            console.log("listening to port 5000 wow http://localhost:5000")
        })
    }
})
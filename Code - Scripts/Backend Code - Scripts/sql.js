const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
//import express from "express"
//import mysql from "mysql"
//import config from "./config.js"

//const express = require("express")
//const mysql = require("mysql")
//const config = require('./config');

//const options = {
//    user: config.MYSQL_USER,
//    password: config.MYSQL_PASSWORD,
//    database: "cloud"
//};

const app = express()

//const db = mysql.createConnection(options);
/*
$host="34.65.119.253";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());
*/
//$con->close();

const db = mysql.createConnection({
    port:3306,
    host:"34.65.119.253",
    //host:"localhost",
    //port:"3306",
    user:"root",
    password:"",
    database:"cloud",
})

// Parse JSON request bodies
app.use(bodyParser.json());
// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');// 'https://hazel-env-380416.lm.r.appspot.com'); // localhost kısmını Frontend'in Cloud'daki External IP'si ile değiştir
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  

      next();

});



// GET method to get song information
app.get('/get-song-info', (req, res) => {

    const {Translate} = require('@google-cloud/translate').v2;
    //import {Translate} from "@google-cloud/translate".v2;
    require('dotenv').config();
    
    // Your credentials
    const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
    
    // Configuration for the client
    const translate = new Translate({
        credentials: CREDENTIALS,
        projectId: CREDENTIALS.project_id
    });
    
    // const detectLanguage = async (text) => {
    
    //     try {
    //         let response = await translate.detect(text);
    //         return response[0].language;
    //     } catch (error) {
    //         console.log(`Error at detectLanguage --> ${error}`);
    //         return 0;
    //     }
    // }
         
    const translateText = async (text, targetLanguage) => {
    
        try {
            let [response] = await translate.translate(text, targetLanguage);
            return response;
        } catch (error) {
            console.log(`Error at translateText --> ${error}`);
            return 0;
        }
    };


    const { songName, artistName, desiredLanguage } = req.query;

    // Translated songs check
    const trq = `SELECT id, lyrics FROM song WHERE artist = "${artistName}" AND title = "${songName}" LIMIT 1;`
    db.query(trq, (err, data, fields) => {
        if(data.length != 0){
            const trq2 = `SELECT translatedLyrics FROM translatedSongs WHERE id = ${data[0].id} AND targetLanguage = "${desiredLanguage}" `
            db.query(trq2, (err, data2, fields) => {
                if(data2.length != 0){
                    const response = {
                        translatedData: data2[0].translatedLyrics,
                        originalLyrics: data[0].lyrics,
                    };
                    return res.json(response)
                }
            })
        }
    })


    const q = `SELECT id, lyrics FROM song WHERE artist = "${artistName}" AND title = "${songName}" LIMIT 1;`
    db.query(q, (err, data, fields) => {
        if(err) {
            return res.json(err)
        }
        else {
            
            if(data.length != 0) {
                //return res.json(data)
                translateText(data[0].lyrics, desiredLanguage).then((translated_data) => {
                    const response = {
                        translatedData: translated_data,
                        originalLyrics: data[0].lyrics,
                    };

                    // add to translatedSongs
                    const ins = `INSERT INTO translatedSongs (id, targetLanguage, translatedLyrics) VALUES (${data[0].id}, "${desiredLanguage.toString()}", "${translated_data.toString()}");`
                    db.query(ins, (error, data2, fields2) => {
                        if(err) {
                            return res.json(err)
                        }
                        else {
                            return res.json(response)
                        }
                    })


                        //console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                        //return res.json(translated_data) 
            }
            else {
                const response = {
                    translatedData: null,
                    originalLyrics: null,
                };
                return res.json(response)
            }
        }
    })
    
  });  


app.get("/", (req, res)=> {
    res.json("Hello backend")
})

app.get("/songs", (req,res)=>{
    const q = "SELECT * FROM song LIMIT 2"
    db.query(q, (err,data)=> {
        if(err) return res.json(err)
        console.log(data)
        return res.json(data)
    })
})

// Endpoint for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Fetch the user from the database based on the provided username
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Check if the user exists
      const user = results[0];
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the provided password with the password from the database
      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate a JWT token with a secret key
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1d' });
  
      // Send the token back to the client
      res.json({ token });
    });
  });
  
  
  
  
  // Middleware function to authenticate requests
  function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'your-secret-key', (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      req.user = user;
      next();
    });
  }
  
  app.post('/add-song', authenticateToken, (req, res) => {
    const { songName, artistName, lyrics } = req.body;

    const q = `INSERT INTO song (title, artist, lyrics) VALUES ("${songName}", "${artistName}", "${lyrics}")`;
    db.query(q, (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        else {
            return res.json({message: 'Song added successfully!'});
        }
    })
});

app.post('/update-song', authenticateToken, (req, res) => {
    const { songName, artistName, lyrics, language } = req.body;

    // Translated songs check
    const trq = `SELECT id FROM song WHERE artist = "${artistName}" AND title = "${songName}" LIMIT 1;`
    db.query(trq, (err, data, fields) => {
        if(data.length != 0){
            console.log("hello")
            const trq2 = `UPDATE translatedSongs SET translatedLyrics="${lyrics}" WHERE id=${data[0].id} and targetLanguage="${language}";`
            db.query(trq2, (err, data2, fields) => {
                return res.json(null)
            })
        }
    })
    return res.json(null)
});

app.delete('/delete-song', authenticateToken, (req, res) => {
    const { songName, artistName } = req.body;
  
    const deleteSongQuery = `DELETE FROM song WHERE title = "${songName}" AND artist = "${artistName}"`;
    const selectSongIdQuery = `SELECT id FROM song WHERE title = "${songName}" AND artist = "${artistName}"`;
    const deleteTranslatedSongQuery = `DELETE FROM translatedSongs WHERE id = ?`;
  
    db.query(deleteSongQuery)
      .then((result) => {
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Song not found' });
        }
  
        return db.query(selectSongIdQuery);
      })
      .then((data) => {
        const songId = data[0].id;
        return db.query(deleteTranslatedSongQuery, [songId]);
      })
      .then(() => {
        console.log('Successful deletion');
        return res.json({ message: 'Song deleted successfully!' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      });
  });




const port = process.env.PORT || 8025;
app.listen(port, ()=>{
    console.log(`Connected to backend! ${port}`);
    //console.log(`Example app listening on port ${port}`);
})

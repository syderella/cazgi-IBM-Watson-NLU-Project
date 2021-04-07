const express = require('express');
const app = new express();
const dotenv = require("dotenv")

dotenv.config();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });



const getNLUInstance = () => {
    const api_key = process.env.API_KEY
    const api_url = process.env.API_URL

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: api_key,
  }),
  serviceUrl: api_url,
});
return naturalLanguageUnderstanding
}

const analyzeInstance = getNLUInstance();


const analyzeText = (query) =>{
  const analyzeParams = {
  "text": query,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};
 const result = analyzeInstance.analyze(analyzeParams)
  .then(analysisResults => {
    return analysisResults;
  })
  .catch(err => {
    console.log('error:', err);
    return "err";
  });
 return result
}


const analyzeURL = (query) =>{

  const analyzeParams = {
  "url": query,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};

const result =  analyzeInstance.analyze(analyzeParams)
  .then(analysisResults => {
    return analysisResults;
  })
  .catch(err => {
    console.log('error:', err);
    return "err";
  });
 return result
}
   
// ROUTE

app.get("/url/emotion", async (req,res) => {

     let emotion = {}
    // console.log(req.query)
    // if (!req.query.url){return};
    const output = await analyzeURL(req.query.url)
    if (output === "err"){
        emotion = `Invalid URL: ${req.query.url}`
    } else {
     emotion = (output.result.entities[0].emotion)}
    //  console.log(emotion)
    return res.send(emotion);
   
});



app.get("/text/emotion", async (req,res) => {
    let emotion =""
    // console.log(req.query)
    if (!req.query.text){return};
   
    const output = await analyzeText(req.query.text)

    if (output === "err"){
        emotion = `Unreadable words: ${req.query.text}`
    } else {
        // console.log(output.result.entities[0].emotion)
    
        if (output.result.keywords.length > 0) {
     emotion = (output.result.entities[0].emotion) }
     else{
         emotion = "Plase type more words.."
     }

    return res.send(emotion)};
});



app.get("/url/sentiment", async (req,res) => {
    let sentiment =""
    // console.log(req.query)
    if (!req.query.url){return};
    const output = await analyzeURL(req.query.url)
 
    if (output === "err"){
        sentiment = `Invalid URL: ${req.query.url}`
    } else {
     sentiment = (output.result.entities[0].sentiment.label)}
    return res.send(sentiment);
});



app.get("/text/sentiment", async (req,res) => {
    let sentiment =""
    // console.log(req.query)
    if (!req.query.text){return};
   
    const output = await analyzeText(req.query.text)

    if (output === "err"){
        sentiment = `Unreadable words: ${req.query.text}`
    } else {
        // console.log(output.result.entities)
        // console.log(output.result.keywords)
        if (output.result.keywords.length > 0) {

     sentiment = (output.result.entities[0].sentiment.label) }
     else{
         sentiment = "Plase type more words.."
     }

    return res.send(sentiment)};

});





let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})


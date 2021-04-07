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
    try {
    const output = await analyzeURL(req.query.url) 
    if (output.result.keywords) {
     emotion = (output.result.entities[0].emotion) }
    } catch(err) {
    console.log("ERROR ALERT!")
    emotion = "Bad URL"
}
    return res.send(emotion)
   
});



app.get("/text/emotion", async (req,res) => {
    let emotion =""
   try {
    const output = await analyzeText(req.query.text) 
    console.log(output.result)
    if (output.result.keywords) {
     emotion = (output.result.keywords[0].emotion) }
} catch(err) {
    console.log("ERROR ALERT!")
    emotion = "undetect"
}
//     return res.send(sentiment)
    // if (!req.query.text){return};
   
    // const output = await analyzeText(req.query.text)

    // if (output == "err"){
    //     emotion = "undetect"
    // } else {
    //     console.log(output.result)
    
    //     if (output.result.keywords.length > 0) {
    //  emotion = (output.result.keywords[0].emotion) }
    //  else{
    //      emotion = "undetect"
    //  }
    return res.send(emotion)
});



app.get("/url/sentiment", async (req,res) => {
    let sentiment =""
   try {
    const output = await analyzeURL(req.query.url) 
    if (output.result.keywords) {
     sentiment = (output.result.entities[0].sentiment.label) }
} catch(err) {
    console.log("ERROR ALERT!")
    sentiment = "Invalid URL .. Please try again"
}
    return res.send(sentiment)

});



app.get("/text/sentiment", async (req,res) => {
    let sentiment =""
   try {
    const output = await analyzeText(req.query.text) 
    if (output.result.keywords) {
     sentiment = (output.result.keywords[0].sentiment.label) }
} catch(err) {
    console.log("ERROR ALERT!")
    sentiment = "Undetacting words.. Please try again or type more words.."
}
    return res.send(sentiment)
});





let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})


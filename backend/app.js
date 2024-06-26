import express from 'express';
import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://api.play.ht/api/v2/tts',
  headers: {
    accept: 'text/event-stream',
    'content-type': 'application/json',
    AUTHORIZATION: '62ad748f112b49ab94fa36a65638a3a8',
    'X-USER-ID': 'EWowjSbXvjM5exeaEUZ9Er04Nwo2'
  },
  data: {
    text: 'Hello goodmorning. This is your word of the day. accusationd',
    voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
    output_format: 'mp3',
    voice_engine: 'PlayHT2.0'
  }
};





const app = express();
app.get('/', (req, res) => {
    axios
  .request(options)
  .then(function (response) {
    let result = response.data.match(/https:\/\/peregrine-results.s3\.amazonaws\.com\/pigeon\/[^"]+\.mp3/g)
    console.log(result);
    res.json(result.length? result[0]:'')
  })
  .catch(function (error) {
    console.error(error);
  });
  })
app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);
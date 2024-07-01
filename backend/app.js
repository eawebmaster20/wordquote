import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import randomUseragent from "random-useragent";
import { pronounce } from "node-pronounce";

const rua = randomUseragent.getRandom();
let wordOfDay = [];
const wordBaseUrl = "https://randomword.com"
const options = {
  method: 'POST',
  url: 'https://api.play.ht/api/v2/tts',
  headers: {
    accept: 'text/event-stream',
    'content-type': 'application/json',
    AUTHORIZATION: process.env.AUTHORIZATION,
    'X-USER-ID': process.env.USERID
  },
  data: {
    text: 'Hello goodmorning. This is your word of the day. accusationd',
    voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
    output_format: 'mp3',
    voice_engine: 'PlayHT2.0',
    quality: 'medium',
    emotion: "female_happy"
  }
};


const app = express();
let wordReturnData = {
  word:'',
  wordAudio:'',
  definition:'',
  definitionAudio: '',
  pronunciation: '',
  pronunciationAudio: ''
}
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', async (req, res)=>{
  const audio = await getAudio("Definition.");
  console.log('audio');
  console.log(audio);
  res.send('hello'+ audio)
})
app.post('/get-audio', async(req, res) => {
  console.log('getting audio');
  options.data.text = req.body.data
  options.data.emotion = req.body.emotion
  console.log(req.body);
  const responseData = await getAudio(options.data.text);
  res.json(responseData)
  })


app.post('/get-daily-word', async (req, res) => {
  console.log('data received on word');
  try {
    const response = await axios({
      method: 'GET',
      url: wordBaseUrl,
      headers: {
        'User-Agent': rua,
      },
    });

    const $ = cheerio.load(response.data);
    if (wordOfDay.length > 0) {
      wordOfDay = [];
    }

    let post = $('.section #shared_section');
    let word = post
      .find('#random_word')
      .eq(0)
      .text()
      .replace('\r\n\t\t\t\t\t', '')
      .replace('\r\n\t\t\t\t', '')
      .replace('\n\t\t\t\t\t', '')
      .replace('\n\t\t\t\t', '');
    let definition = post
      .find('#random_word_definition')
      .eq(0)
      .text()
      .replace('\n', '');
    let pronounceword = pronounce(word).replace(',', '');

    wordReturnData.word = decodeURI(word.charAt(0).toUpperCase() + word.slice(1));
    wordReturnData.definition = definition;
    wordReturnData.pronunciation = decodeURI(pronounceword.charAt(0).toUpperCase() + pronounceword.slice(1));

    wordReturnData.wordAudio = await getAudio("Today's word is. "+wordReturnData.word+'.');
    wordReturnData.definitionAudio = await getAudio('Definition.'+wordReturnData.definition+'.');
    wordReturnData.pronunciationAudio = await getAudio("Today's word is. "+wordReturnData.pronunciation+'.');

    res.json(wordReturnData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

async function getAudio(audioTxt) {
  options.data.text = audioTxt;
  try {
    const response = await axios.request(options);
    let result = response.data.match(/https:\/\/peregrine-results.s3\.amazonaws\.com\/pigeon\/[^"]+\.mp3/g);
    console.log(result);
    return result.length ? result[0] : '';
  } catch (error) {
    return error;
  }
}
app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);
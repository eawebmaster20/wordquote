// import { customization, scheduler } from "./customization.js";
let scheduler={
    quoteTime:'',
    wordTime:'',
    scheduleQuote(){
        setInterval(() => {
            
        }, interval);
    }
}
const baseUrl = "http://104.197.250.208:9002"
let customization={
    name:'',
    gender:'female_',
    tonation:'happy'
}
let inspiration ={
    currentAudioIndex: 0,
    quoteOfDay:"",
    wordOfDay:"",
    wordOfDayPronunciation:"",
    wordDefinition:"",
    morningGreetingMsg:"https://peregrine-results.s3.amazonaws.com/pigeon/51dGovE6bDTyDQMF9I_0.mp3",
    afternoonGreetingMsg:"https://peregrine-results.s3.amazonaws.com/pigeon/MbmBUgMBDINkALH0Ou_0.mp3",
    eveningGreetingMsg:"https://peregrine-results.s3.amazonaws.com/pigeon/FSM2ScyBEAYd3zSfIL_0.mp3",
    greet(hour){
        console.log('greeting '+hour);
        playAudiosInOrder([hour<12? this.morningGreetingMsg:hour <16 ? this.afternoonGreetingMsg:this.eveningGreetingMsg])
    },
    updateGreeting(){
        console.log(customization);
        this.morningGreetingMsg = "";
        this.afternoonGreetingMsg = "";
        this.eveningGreetingMsg = "";
        let goodmorningPayload = {
            data:`Hello good morning ${customization.name}. kindly hold on while I read to you your daily inspirational quote.`,
            emotion:customization.gender+ customization.tonation
        }
        let goodafternoonPayload = {
            data:`Hello good morning ${customization.name}. kindly hold on while I read to you your daily inspirational quote.`,
            emotion:customization.gender+customization.tonation
        }
        let goodeveningPayload = {
            data:`Hello good morning ${customization.name}. kindly hold on while I read to you your daily inspirational quote.`,
            emotion:customization.gender +customization.tonation
        }
        const morning = axios
        .post(baseUrl+'/get-audio', goodmorningPayload)
        .then((response)=>{
            this.morningGreetingMsg = response.data
            console.log(response.data);
            Promise.resolve()
        })
        .catch((err)=>console.log(err))

        const afternoon = axios
        .post(baseUrl+'/get-audio', goodafternoonPayload)
        .then((response)=>{
            this.afternoonGreetingMsg = response.data
            console.log(response.data);
            Promise.resolve()
        })
        .catch((err)=>console.log(err))

        const evening = axios
        .post(baseUrl+'/get-audio', goodeveningPayload)
        .then((response)=>{
            this.eveningGreetingMsg = response.data
            console.log(response.data);
            Promise.resolve()
        })
        .catch((err)=>console.log(err))
        Promise.all([morning, afternoon, evening]).then((values) => {
            document.getElementsByClassName('main-container')[0].classList.add('hide')
            document.getElementsByClassName('pulse-container')[0].classList.add('hide')
            document.getElementById('goToQuote').classList.remove('hide')
          })
    }
}
let audioQueue= {
    audio1:'',
    audio2:'',
    audio3:'',
    audio4:''
}
/************************************************************
 * QOUTE OF DAY 
 ***********************************************************/
const getDailyQuote = ()=>{
    let payload = {
        data: 'And I read. ',
        emotion:customization.gender + customization.tonation
    }
    if (inspiration.quoteOfDay.length && audioQueue.audio1.length) {
            document.getElementById('dailyQuoteTxt').innerText = inspiration.quoteOfDay;
            audioQueue.audio1.length ? playAudiosInOrder([audioQueue.audio1]):''
        return; 
    }
    axios
    .get('https://api.adviceslip.com/advice')
    .then(function (response) {
        inspiration.quoteOfDay = `"${response.data.slip.advice}"`;
        payload.data += response.data.slip.advice
        console.log(payload);
        axios.post(baseUrl+'/get-audio',payload)
        .then((res)=>{
            console.log(res);
            audioQueue.audio1 = res.data
            playAudiosInOrder([audioQueue.audio1])
            document.getElementsByClassName('main-container')[0].classList.remove('hide')
            document.getElementsByClassName('pulse-container')[0].classList.add('hide')
            document.getElementById('dailyQuoteTxt').innerText = inspiration.quoteOfDay;
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(()=>{
            console.log('playing quote');
            // audioQueue.audio1.length? playAudiosInOrder([audioQueue.audio1]):''
        })
    })
    .catch(function (error) {
        alert(error.message)
        console.log(error);
    })
}

/************************************************************
 * WORD OF DAY AND ITS DEFINITION
 ***********************************************************/
const getDailyWord = ()=>{
    if (inspiration.wordOfDay.length && inspiration.wordDefinition.length) {
            document.getElementById('dailyWordTxt').innerText = inspiration.wordOfDay;
            document.getElementById('wordPronunctiation').innerText = inspiration.wordOfDayPronunciation;
            document.getElementById('dailyWordDef').innerText = inspiration.wordDefinition;
            if (audioQueue.audio2.length && audioQueue.audio3.length) {
                playAudiosInOrder([audioQueue.audio2, audioQueue.audio3])
            }
        return;
    }
    let payload = {
        emotion:customization.gender.concat(customization.tonation),
    }
    axios
    .post(baseUrl+'/get-daily-word', payload)
    .then(function (response) {
        inspiration.wordOfDay = response.data.word;
        inspiration.wordDefinition = response.data.definition;
        inspiration.wordOfDayPronunciation = response.data.pronunciation;
        audioQueue.audio2 = response.data.pronunciation;
        audioQueue.audio3 = response.data.definitionAudio
        console.log(response);
    })
    .catch(function (error) {
        alert(error.message)
        console.log(error);
    })
    .finally(()=>{ 
        document.getElementById('dailyWordTxt').innerText = inspiration.wordOfDay;
        document.getElementById('wordPronunctiation').innerText = inspiration.wordOfDayPronunciation;
        document.getElementById('dailyWordDef').innerText = inspiration.wordDefinition;
    
        audioQueue.audio2.length &&
        audioQueue.audio3.length ? 
        playAudiosInOrder([audioQueue.audio2, audioQueue.audio3])
        .then(()=>{
            playAudiosInOrder(["./assets/waiting.mp3"])
        }):''
    })
}

/***********************************************************
 * audio play manager.
 **********************************************************/
async function playAudiosInOrder(audioLinks) {
    console.log('called');
    for (const link of audioLinks) {
      await playAudio(link);
    }
  }
  
  function playAudio(link) {
    return new Promise((resolve) => {
      const audio = new Audio(link);
      audio.play();
      audio.onended = resolve;
    });
  }

  function scheduleDailyTask(task, hour, minute, second = 0) {
    const now = new Date();
    const nextExecutionTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
    if (now > nextExecutionTime) {
        nextExecutionTime.setDate(nextExecutionTime.getDate() + 1);
    }
    const delay = nextExecutionTime - now;
    setTimeout(function() {
        task();
        setInterval(task, 24 * 60 * 60 * 1000);
    }, delay);
}

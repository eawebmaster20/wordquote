document.getElementById('goToQouteBtn').addEventListener('click',()=>{
    document.getElementById('goToQuote').classList.add('hide')
    document.getElementsByClassName('main-container')[0].classList.add('hide')
    document.getElementsByClassName('pulse-container')[0].classList.remove('hide')
    getDailyQuote();
    getDailyWord();
    inspiration.greet((new Date()).getHours());
})

document.getElementById('updateCustomization').addEventListener('click',()=>{
    customization.name = document.getElementById('customName').value;
    customization.gender = document.getElementById('customGender').value;
    customization.tonation = document.getElementById('customTone').value;
    document.getElementsByClassName('main-container')[0].classList.add('hide')
    document.getElementsByClassName('pulse-container')[0].classList.remove('hide')
    document.getElementById('goToQuote').classList.add('hide')
    localStorage.setItem('customization', customization)
    inspiration.updateGreeting();
})

document.getElementById('updateSchedule').addEventListener('click',()=>{
    scheduler.quoteTime = document.getElementById('dailyQuoteTime').value;
    scheduler.wordTime = document.getElementById('dailyWordTime').value;
    localStorage.setItem('scheduler', scheduler)
})

document.getElementsByClassName('main-container')[0].classList.add('hide')
document.getElementsByClassName('pulse-container')[0].classList.add('hide')

document.getElementById('updateSchedule').addEventListener('click', () => {
    scheduler.quoteTime = document.getElementById('dailyQuoteTime').value;
    scheduler.wordTime = document.getElementById('dailyWordTime').value;
    localStorage.setItem('scheduler', scheduler)
    const [quoteHour, quoteMinute] = scheduler.quoteTime.split(':').map(Number);
    const [wordHour, wordMinute] = scheduler.wordTime.split(':').map(Number);
    console.log(scheduler);
});



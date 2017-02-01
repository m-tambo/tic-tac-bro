firebase.initializeApp({
  apiKey: "AIzaSyDbrdEUbUKKmbqtAjqtt-3IZQQBHpnqnR4",
  authDomain: "tic-tac-bro-9746c.firebaseapp.com",
  databaseURL: "https://tic-tac-bro-9746c.firebaseio.com",
  storageBucket: "tic-tac-bro-9746c.appspot.com",
  messagingSenderId: "7022810343"
});

const broBoard = document.querySelector('.bro-board');
const broSpots = document.querySelectorAll('.bro-spot');
const broAgain = document.querySelector('.center-bro');
let currentBro = 'images/broBilly.jpeg';

const broSpotRef = firebase.database().ref().child('Bro-Spots');



function initializeBros() {
  broSpots.forEach(function (broSpot) {
    const broClass = broSpot.classList[1];
    broSpotRef.update({[broClass] : 'images/bro.png'})
  })
}

function checkBros() {
  const bros = document.querySelectorAll('img');
  console.log(bros)
  if(bros[0].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[1].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[2].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[3].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[5].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[6].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[7].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[8].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[0].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[3].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[6].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[1].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[7].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[2].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[5].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[8].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[0].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[8].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[2].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[6].attributes[0].value === 'images/broBilly.jpeg') {

    console.log('broBilly has taken the day!');
    broAgain.classList.remove('hidden-bro');
    broAgain.addEventListener('click', initializeBros);
  }
  else if(bros[0].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[1].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[2].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[3].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[5].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[6].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[7].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[8].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[0].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[3].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[6].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[1].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[7].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[2].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[5].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[8].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[0].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[8].attributes[0].value === 'images/broBilly.jpeg' ||
    bros[2].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[4].attributes[0].value === 'images/broBilly.jpeg' &&
    bros[6].attributes[0].value === 'images/broBilly.jpeg') {

    console.log('broLeggs has taken the day!');
    broAgain.classList.remove('hidden-bro');
    broAgain.addEventListener('click', initializeBros);
  }
}

function broClick(e) {

  if(currentBro === 'images/broBilly.jpeg') {
    currentBro = 'images/broLeggs.jpeg'
  } else {
    currentBro = 'images/broBilly.jpeg'
  }
  if(e.target.tagName === 'IMG') {
    let broId = e.target.id;
    //console.log(broId);
    broSpotRef.update({[broId] : currentBro});
    //initializeBros();
  }
}



broBoard.addEventListener('click', broClick);


broSpotRef.on('child_added', snap => {
  const broImage = document.createElement('img');
  broImage.src = snap.val();
  broImage.id = snap.key;
  //console.log(snap.key, snap.val());
  //console.log()
  document.querySelector('.' + snap.key).appendChild(broImage)
});

broSpotRef.on('child_changed', snap => {

  //console.log(snap.val())
  //console.log(snap.key)
  document.querySelector('#' + snap.key).src = snap.val();
  checkBros();

});



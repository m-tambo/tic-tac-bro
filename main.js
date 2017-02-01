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
const checkBro = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8 ], [0, 4, 8], [2, 4, 6]];
const broSpotRef = firebase.database().ref().child('Bro-Spots');


function checkBros() {
  const bros = document.querySelectorAll('img');
  for (let i = 0; i < checkBro.length; i++) {
    if (bros[checkBro[i][0]].attributes[0].value === currentBro && bros[checkBro[i][1]].attributes[0].value === currentBro && bros[checkBro[i][2]].attributes[0].value === currentBro) {
      console.log('winner', currentBro);
      broAgain.classList.remove('hidden-bro');
      broAgain.addEventListener('click', initializeBros);
    }
  }
}

function initializeBros() {
  broAgain.classList.add('hidden-bro');
  broSpots.forEach(function (broSpot) {
    const broClass = broSpot.classList[1];
    broSpotRef.update({[broClass] : 'images/bro.png'})
  })
}

function broClick(e) {
  console.log(e)
  if (e.target.attributes[0].value === 'images/bro.png') {
    if (currentBro === 'images/broBilly.jpeg') {
      currentBro = 'images/broLeggs.jpeg'
    } else {
      currentBro = 'images/broBilly.jpeg'
    }
    if (e.target.tagName === 'IMG') {
      let broId = e.target.id;
      broSpotRef.update({ [broId]: currentBro });
    }
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



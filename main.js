

// always declare variables first, bro
const broBoard = document.querySelector('.bro-board');
const broSpots = document.querySelectorAll('.bro-spot');
const broAgain = document.querySelector('.center-bro');
let currentBro = 'images/broBilly.jpeg';
const checkBro = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8 ], [0, 4, 8], [2, 4, 6]];
const broSpotRef = firebase.database().ref().child('Bro-Spots');
let currentTurn = '';
//let broName = '';
let player1 = '';
let player2 = '';
//let playerArray = [];
let brosPlaying;
// broSpotRef.child('playing').once('value', function (snap) {
//   brosPlaying = snap.val();
//   console.log(brosPlaying)
// })

broSpotRef.once('value', snap => {
  console.log(snap.val())
  currentTurn = snap.val().currentTurn;
  currentBro = snap.val().currentBro;

  if(!snap.val().player1) {
    player1 = firebase.auth().currentUser.uid;
      broSpotRef.child('player1').onDisconnect().remove();
      broSpotRef.update({ 'player1': firebase.auth().currentUser.uid });
  } else if (!snap.val().player2) {
    player2 = firebase.auth().currentUser.uid;
      broSpotRef.child('player1').onDisconnect().remove();
      broSpotRef.update({ 'player1': firebase.auth().currentUser.uid });
  }
});
//  if(snap.val().hasOwnProperty(player1))
//    player1 = snap.val().player1.val();
//  console.log('player1', player1)
//})



  // bro functions, DRY AF!
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
  broSpotRef.update({ 'playing' : 0 });
  broSpots.forEach(function (broSpot) {
    const broClass = broSpot.classList[1];
    broSpotRef.update({[broClass] : 'images/bro.png'});


    // Grab all currently connected Users
    // Filter out the two Users that just finished playing so two new Users will be playing every time through
    // Add key/value of { playing : true } to two random Users objects
    // Add key/value of { playing : false } to the rest of the User objects
    // Add function to test if each User is playing or not.  Only the two players with playing : true can click bro-board
  })
}

function displayInfo() {

  if(currentTurn === firebase.auth().currentUser.uid) {
    document.querySelector('.turn').innerHTML = 'It\'s your turn Bro!';
  } else {
    document.querySelector('.turn').innerHTML = 'Wait your turn Bro!';
  }
}

function switchBroImg() {
  broSpotRef.child('currentBro').once('value', snap => {
    currentBro = snap.val();
  if (currentBro === 'images/broBilly.jpeg') {
    currentBro = 'images/broLeggs.jpeg';
    broSpotRef.update({ 'currentBro' : currentBro })
  } else {
    currentBro = 'images/broBilly.jpeg';
    broSpotRef.update({ 'currentBro' : currentBro })
  }
  })
}

function switchBroTurn() {
  broSpotRef.child('currentTurn').once('value', snap => {
    console.log(snap.val());
    currentTurn = snap.val();
  });
  if (currentTurn === player1) {
    broSpotRef.update({ 'currentTurn' : player2 });
    currentTurn = player2;

  } else {
    currentTurn = player1;
    broSpotRef.update({ 'currentTurn' : player1 })
  }

}

function broClick(e) {
  if(firebase.auth().currentUser.uid === currentTurn) {
      if (e.target.attributes[0].value === 'images/bro.png' && e.target.tagName === 'IMG') {
        let broId = e.target.id;
        broSpotRef.update({ [broId]: currentBro });
        switchBroTurn();
        switchBroImg();
      }
  } else {
      alert('It is not your turn');
    }
}

// bro listeners
broBoard.addEventListener('click', broClick);




// open a firebase socket, bro
broSpotRef.on('child_added', snap => {

  if (snap.key !== 'player1' && snap.key !== 'player2' && snap.key !== 'currentTurn' && snap.key !== 'currentBro') {
    const broImage = document.createElement('img');
    broImage.src = snap.val();
    broImage.id = snap.key;
    //console.log(snap.key, snap.val());
    //console.log()
    document.querySelector('.' + snap.key).appendChild(broImage)
  }
});

broSpotRef.on('child_changed', snap => {
  //console.log(snap.val())
  //console.log(snap.key)
  if(snap.key === 'currentTurn') {
    currentTurn = snap.val();
    displayInfo()
  }
  if(snap.key === 'currentBro') {
    currentBro = snap.val();
  }
  if(snap.key === 'playing') {
    brosPlaying = snap.val();
  }

  if (snap.key !== 'player1' && snap.key !== 'player2' && snap.key !== 'playing' && snap.key !== 'currentTurn' && snap.key !== 'currentBro') {
    document.querySelector('#' + snap.key).src = snap.val();

    checkBros();
  }
});

broUserRef.on('child_removed', snap => {



});




broUserRef.on('child_added', snap => {
  console.log('added', snap.val());
  console.log(snap.key)
  const broUser = document.createElement('p');
  broUser.innerHTML = 'Bro ' + snap.val().broName;
  console.log(broUser)


  //broSpotRef.child('playing').once('value', function (snap) {
  //  if(snap.val() < 0) {
  //    brosPlaying = 0;
  //    broSpotRef.update({ 'playing' : brosPlaying })
  //  } else {
  //    brosPlaying = snap.val();
  //  }
  //})

  //if(brosPlaying === 0) {
  //  broSpotRef.update({ ['currentTurn'] : snap.key });
  //  broSpotRef.child('player1').onDisconnect().remove();
  //  broSpotRef.update({ 'player1': snap.key });
  //  player1 = snap.key;
  //} else if(brosPlaying === 1) {
  //  if (player1 !== snap.key) {
  //    broSpotRef.child('player2').onDisconnect().remove();
  //    broSpotRef.update({ 'player2': snap.key });
  //    player2 = snap.key;
  //  }
  //}

  //player1 = playerArray[0];
  //player2 = playerArray[1];
  //currentTurn = playerArray[0];

  //document.querySelector('.bro1name').innerHTML = snap.val().broName;
  //document.querySelector('.bro1name').classList.remove('hidden-bro');
});


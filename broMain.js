
// always declare variables first, bro
const broBoard = document.querySelector('.bro-board');
const broSpots = document.querySelectorAll('.bro-spot');
const broAgain = document.querySelector('button');
const broComm = document.querySelector('.bro-comm');
const broChatDiv = document.querySelector('.bro-chat');
const broFriends = document.querySelector('.other-bros')
const checkBro = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8 ], [0, 4, 8], [2, 4, 6]];
const broSpotRef = firebase.database().ref().child('Bro-Spots');
const broUserRef = firebase.database().ref().child('Users');
const broMessageRef = firebase.database().ref().child('Messages');
let currentBro = 'images/broBilly.jpeg';
let player1 = '';
let player2 = '';
let currentTurn = '';
let startBro = '';


// listen bro
broBoard.addEventListener('click', broClick);


// setup bro
function initializeBro(evt) {

  document.querySelector('.bro-btn').classList.add('hidden-bro');
  document.querySelector('.bro-input').classList.add('hidden-bro');

  document.querySelector('.status').classList.remove('hidden-bro');
  document.querySelector('.turn').classList.remove('hidden-bro');
  document.querySelector('.bro-talk').classList.remove('hidden-bro');
  document.querySelector('.bro-comm').classList.remove('hidden-bro');

  broName = 'Bro ' + evt.target.previousElementSibling.value;

  firebase.auth().currentUser.updateProfile({'displayName' : broName});

  broComm.addEventListener('click', broTalk);

  firebase.database().ref('Users/' + firebase.auth().currentUser.uid).onDisconnect().remove();
  broUserRef.update({ [firebase.auth().currentUser.uid] :
                                                          { ['broName'] : broName }
                    });

  broSpotRef.once('value', snap => {

    currentTurn = snap.val().currentTurn;
    currentBro = snap.val().currentBro;
    startBro = snap.val().startBro;

    if(!snap.hasChild('player1')) {
      player1 = firebase.auth().currentUser.uid;
      broSpotRef.child('player1').onDisconnect().remove();
      broSpotRef.update({ 'player1': firebase.auth().currentUser.uid });
      broSpotRef.update({ ['currentTurn'] : firebase.auth().currentUser.uid });
    } else if (!snap.hasChild('player2')) {
      player2 = firebase.auth().currentUser.uid;
      broSpotRef.child('player2').onDisconnect().remove();
      broSpotRef.update({ 'player2': firebase.auth().currentUser.uid });
    }
  });
  whoPlayingBro();
}



/*********************
    BRO FUNCTIONS
**********************/


// bro, DRY AF!
function checkBros() {
  const bros = document.querySelectorAll('img');
  for (let i = 0; i < checkBro.length; i++) {
    if (bros[checkBro[i][0]].attributes[0].value === currentBro && bros[checkBro[i][1]].attributes[0].value === currentBro && bros[checkBro[i][2]].attributes[0].value === currentBro) {

      broBoard.removeEventListener('click', broClick);
      broAgain.classList.remove('hidden-bro');
      startBro = 'yes';
      broAgain.addEventListener('click', resetBros);
    }
  }
}


function newBroPlayers() {
  broUserRef.once('value', snap => {
    const bros = snap.val();
    const totalBros = snap.numChildren();

    Object.keys(bros).forEach(function (id) {

      if (id === player1 || id === player2) {
        delete bros[id];

      }
    });

    let firstNewBro = Math.floor(Math.random() * ((totalBros - 1) - 0)) + 0;
    let SecondNewBro = Math.floor(Math.random() * ((totalBros - 1) - 0)) + 0;
    if(firstNewBro === SecondNewBro) {

    }
    Object.keys(bros).forEach(function (id, i) {
      if(i === firstNewBro) {
        firstNewBro = id;
      }
      if(i === SecondNewBro) {
        SecondNewBro = id;
      }
    })

    broSpotRef.update({ 'player1' : firstNewBro });
    broSpotRef.update({ 'player2' : SecondNewBro });

  });
}

function resetBros() {

  newBroPlayers();
  broSpotRef.update({ 'startBro' : (Math.floor(Math.random() * (100000))) });
  broAgain.classList.add('hidden-bro');
  broBoard.addEventListener('click', broClick);
  broSpots.forEach(function (broSpot) {
    const broClass = broSpot.classList[1];
    broSpotRef.update({[broClass] : 'images/bro.png'});
  })
}


// bro it's your turn
function displayInfo() {

  if(currentTurn === firebase.auth().currentUser.uid) {
    document.querySelector('.turn').innerHTML = 'It\'s your turn Bro!';
  } else{
      document.querySelector('.turn').innerHTML = 'Wait your turn Bro!';
    }


}

function whoPlayingBro() {
  if(firebase.auth().currentUser.uid === player1) {
    displayInfo();
    document.querySelector('.status').innerHTML = 'You\'re player1 Bro!';
  } else if(firebase.auth().currentUser.uid === player2) {
    displayInfo();
    document.querySelector('.status').innerHTML = 'You\'re player2 Bro!';
  } else {
    document.querySelector('.status').innerHTML = 'You\'re in line to play Bro!';
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

function broTalk(e) {
  const sendingBro = firebase.auth().currentUser.displayName;
  const message = e.target.previousElementSibling.value;
  broMessageRef.push({ sendingBro, message })

}


/*********************
   DO SOMETHING BRO
**********************/


broSpotRef.on('child_added', snap => {


  if(snap.key === 'player1') {
    player1 = snap.val();
    whoPlayingBro();
  }

  if(snap.key === 'player2') {
    player2 = snap.val();
    whoPlayingBro();
  }

  if (snap.val() === 'images/bro.png' || snap.val() === 'images/broBilly.jpeg' || snap.val() === 'images/broLeggs.jpeg') {
    if(snap.key !== 'currentBro') {
      const broImage = document.createElement('img');
      broImage.src = snap.val();
      broImage.id = snap.key;
      document.querySelector('.' + snap.key).appendChild(broImage)
    }
  }
});


broSpotRef.on('child_changed', snap => {

  if(snap.key === 'currentTurn') {
    currentTurn = snap.val();
    displayInfo()
  }

  if(snap.key === 'currentBro') {
    currentBro = snap.val();
  }

  if(snap.key === 'player1') {
    player1 = snap.val();
    broSpotRef.update({ 'currentTurn' : snap.val()})
    whoPlayingBro();
  }

  if(snap.key === 'player2') {
    player2 = snap.val();
    whoPlayingBro();
  }

  if(snap.key === 'startBro') {
    resetBros();
    startBro = snap.val();
  }

  if (snap.val() === 'images/bro.png' || snap.val() === 'images/broBilly.jpeg' || snap.val() === 'images/broLeggs.jpeg') {
    if(snap.key !== 'currentBro') {
      document.querySelector('#' + snap.key).src = snap.val();
      checkBros();
    }
  }
});


broSpotRef.on('child_removed', snap => {

  if(snap.key === 'player1' || snap.key === 'player2') {
    //broSpotRef.update({ [snap.key] :  })
  }

})


broUserRef.on('child_added', snap => {
  const broUserDiv = document.createElement('div');
  broUserDiv.id = snap.key;
  const broUser = document.createElement('p');
  broUser.innerHTML = snap.val().broName;
  broUserDiv.appendChild(broUser);
  broFriends.appendChild(broUserDiv);
});


broUserRef.on('child_removed', snap => {
  const broLeft = document.querySelector('#' + snap.key);
  broFriends.removeChild(broLeft);
});


broMessageRef.limitToLast(10).on('child_added', snap => {
  const broDiv = document.createElement('div')
  const broMessage = document.createElement('p');
  broMessage.innerHTML = snap.val().sendingBro + ': ' + snap.val().message;
  broDiv.append(broMessage);
  broChatDiv.appendChild(broDiv);

  if (broChatDiv.childElementCount > 10) {
    broChatDiv.firstChild.remove();
  }

});


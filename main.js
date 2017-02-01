

      // always declare variables first, bro
const broBoard = document.querySelector('.bro-board');
const broSpots = document.querySelectorAll('.bro-spot');
const broAgain = document.querySelector('.center-bro');
let currentBro = 'images/broBilly.jpeg';
const checkBro = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8 ], [0, 4, 8], [2, 4, 6]];
const broSpotRef = firebase.database().ref().child('Bro-Spots');
const broNameRef = firebase.database().ref().child('Users');
let broName = ''

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

function broClick(e) {
  console.log(e)
  if (broName === '') {
    alert("State your name to compete, bro")
  } else {
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
}

function setBroName(evt) {
  console.log(evt.target.previousElementSibling.value);
  broName = evt.target.previousElementSibling.value;
        // display name
  document.querySelector('.bro1name').innerHTML = broName
  document.querySelector('.bro1name').classList.remove('hidden-bro');
        // hide text input and button
  document.querySelector('.bro-input').classList.add('hidden-bro');
  document.querySelector('.bro-btn').classList.add('hidden-bro');
}


        // bro listeners
broBoard.addEventListener('click', broClick);
document.querySelector('.bro-btn').addEventListener('click', setBroName);



        // open a firebase socket, bro
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



broUserRef.on('child_added', snap => {
  console.log(snap.val())
  console.log(snap.key)
  const broUser = document.createElement('p');
  broUser.innerHTML = 'Bro ' + snap.val().broName;
  console.log(broUser)
});

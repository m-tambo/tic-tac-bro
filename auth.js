
firebase.initializeApp({
  apiKey: "AIzaSyDbrdEUbUKKmbqtAjqtt-3IZQQBHpnqnR4",
  authDomain: "tic-tac-bro-9746c.firebaseapp.com",
  databaseURL: "https://tic-tac-bro-9746c.firebaseio.com",
  storageBucket: "tic-tac-bro-9746c.appspot.com",
  messagingSenderId: "7022810343"
});

const broUserRef = firebase.database().ref().child('Users');

firebase.auth().onAuthStateChanged(function(user) {
  console.log('USER', user);
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    console.log(uid);
    ready(user);
    // ...
  } else {
    firebase.auth().signInAnonymously();
            //.catch(function(error) {
            //  // Handle Errors here.
            //  var errorCode = error.code;
            //  var errorMessage = error.message;
            //  // ...
            //});
  }
  // ...
});





function ready(user) {
  firebase.database().ref('Users/' + firebase.auth().currentUser.uid).onDisconnect().remove();
  //button.addEventListener('click', () => {
    broUserRef.update({ [user.uid] :
                          { ['broName'] :'James' }
                      });
  //})
}




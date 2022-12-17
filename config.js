const firebase = require('firebase')
const firebaseConfig = {
   apiKey: 'AIzaSyDJeXdX55-smGayK9g_UQJ7JhASKz6zljA',
   authDomain: 'devmerudy-node-e1e45.firebaseapp.com',
   projectId: 'devmerudy-node-e1e45',
   storageBucket: 'devmerudy-node-e1e45.appspot.com',
   messagingSenderId: '339156486912',
   appId: '1:339156486912:web:40cbc6f886db105cb741e5',
   measurementId: 'G-EVJRVVN4C2'
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const Employee = db.collection('Employee')
module.exports = Employee

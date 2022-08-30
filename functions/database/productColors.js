const firebase = require('../db')
const firestore = firebase.firestore();

async function getProductColors() {
    const colorsTable = await firestore
        .collection('colors')
        .doc('P3v7lMdnyvZ0JiFKVrC4')
        .get();

    return colorsTable.data().colors;
}

module.exports = {
    getProductColors
}
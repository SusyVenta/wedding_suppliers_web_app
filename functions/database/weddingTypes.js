const firebase = require('../db')
const firestore = firebase.firestore();

async function getWeddingTypes() {
    const weddingTypesTable = await firestore
        .collection('wedding_types')
        .doc('nw6eDIwkVqPjrTBbxsac')
        .get();

    return weddingTypesTable.data().wedding_types;
}

module.exports = {
    getWeddingTypes,
}
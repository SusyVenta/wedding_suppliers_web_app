const firebase = require("../db");
const firestore = firebase.firestore();

// returns array of wedding types
async function getWeddingTypes() {
    const weddingTypesTable = await firestore
        .collection("wedding_types")
        .doc("nw6eDIwkVqPjrTBbxsac")
        .get();

    return weddingTypesTable.data().wedding_types;
}

module.exports = {
    getWeddingTypes,
};

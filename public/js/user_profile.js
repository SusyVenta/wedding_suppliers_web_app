/* ------------------------- User profile page - tab structure ------------------------
Controls the functioning of the tab structure (Personal information, Wishlist, My Orders)
*/
function openUserProfile(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // unselect non clicked tabs 
  // get all elements that have a class name starting with 
  tablinks = document.querySelectorAll("[class^=tablinks]");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className = "tablinks";
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

/* Determine which tab to open */
function determineTabToOpenAndOpenIt() {
  let tabsIds = ["openProfileTab", "openWishlistTab", "openOrdersTab", "openCatalogueTab"];
  let tabClass;
  for (let tab of tabsIds) {
    try {
      tabClass = document.getElementById(tab).className;
      if (tabClass == 'tablinks active') {
        document.getElementById(tab).click();
      }
    } catch {
      // we're here if there is no element with such id. Nothing to do. This script is run both by user and vendor profiles.
    }
  }
}
/* By default, when user loads the customer profile page, the personal information section tab is open. */
determineTabToOpenAndOpenIt();


/* When user updates personal details, save updated details to the database */
const updateProfileForm = async () => {
  // determine user action
  let saveOrEdit = document.getElementById("saveOrEdit").value;
  if (saveOrEdit == "Edit") {
    // enable inputs
    document.getElementById("phone_number").disabled = false;
    document.getElementById("address_1").disabled = false;
    document.getElementById("post_code").disabled = false;
    document.getElementById("city").disabled = false;
    document.getElementById("country").disabled = false;

    // change current state of edit / save
    document.getElementById("saveOrEdit").value = "Save";

    // change text of save / edit button
    document.getElementById("edit-user-details").value = "Save";
  } else {
    // user is saving personal details modifications
    let user_id = document.getElementById("user_id_navbar").innerHTML;
    userProfile = db.collection('users').doc(user_id);

    const data = {
      address_1: document.getElementById("address_1").value,
      phone_number: document.getElementById("phone_number").value,
      country: document.getElementById("country").value,
      city: document.getElementById("city").value,
      post_code: document.getElementById("post_code").value,
    }

    userProfile.set(
      data,
      { merge: true }
    );

    // disable inputs
    document.getElementById("phone_number").disabled = true;
    document.getElementById("address_1").disabled = true;
    document.getElementById("post_code").disabled = true;
    document.getElementById("city").disabled = true;
    document.getElementById("country").disabled = true;

    // change current state of edit / save
    document.getElementById("saveOrEdit").value = "Edit";

    // change text of save / edit button
    document.getElementById("edit-user-details").value = "Edit";
  }

}

/* When user clicks on 'Update profile picture', activates the upload */
function uploadTrigger() {
  var input = document.getElementById('profile-pic-input');
  input.click();
}

// upload the image to firebase storage and update the profile picture
async function updateProfilePic() {
  const user_id = document.getElementById("user_id_navbar").innerHTML;
  const input = document.getElementById('profile-pic-input');

  const file = input.files[0];
  const storageRef = firebase.storage().ref('customer_profiles/' + user_id + "/" + file.name);

  storageRef.put(file).then(async () => {
    storageRef.getDownloadURL().then(async url => {
      imgURL = document.getElementById("profile-pic").src = url;
      userProfile = await db.collection('users').doc(user_id);

      userProfile.update({
        profile_picture: imgURL,
      })
    })

  }).catch(error => {
    console.log(error.message);
  }
  );
}

// customers can cancel orders if they are still pending confirmation
async function cancelOrder(order_id, vendorID) {
  let user_id = document.getElementById("user_id_navbar").innerHTML;
  // delete from user order
  await db.collection('users').doc(user_id).collection('orders').doc(order_id).delete();
  // delete from vendor orders_to_confirm
  await db.collection('users').doc(vendorID).collection('orders_to_confirm').doc(order_id).delete();
  // // post form to reload page with updated orders
  $('form#user-details').submit();
};

// Once the order has been confirmed by the vendor, users can review the product
async function reviewProduct(product_id, order_id, quality_rating, vendor_quality_rating,
  product_description_rating, free_text) {
  let user_id = document.getElementById("user_id_navbar").innerHTML;
  let now = new Date();

  const usersTableGet = await db.collection('users').doc(user_id).get();
  let userData = usersTableGet.data();

  let newReviewData = {
    firstName: userData.username,
    lastName: "",
    date: now,
    overall_rating: (Number(quality_rating) + Number(vendor_quality_rating) + Number(product_description_rating)) / 3,
    product_quality_rating: Number(quality_rating),
    vendor_quality_rating: Number(vendor_quality_rating),
    product_description_rating: Number(product_description_rating),
    comment: free_text
  };

  const productsTableGet = await db.collection('products').doc(product_id).get();
  let targetProduct = productsTableGet.data();
  let existingReviews = targetProduct.reviews;

  if (existingReviews == null) {
    existingReviews = [newReviewData];
  } else {
    existingReviews.push(newReviewData);
  }

  // Update product overall stars
  let overallStarsAvg = 0;
  let overall_product_quality_rating = 0;
  let overall_vendor_quality_rating = 0;
  let overall_product_description_rating = 0;

  let countReviews = 0;
  for (let review of existingReviews) {
    overallStarsAvg += review.overall_rating;
    overall_product_quality_rating += review.product_quality_rating;
    overall_vendor_quality_rating += review.vendor_quality_rating;
    overall_product_description_rating += review.product_description_rating;

    countReviews += 1;
  }
  overallStarsAvg = parseFloat((overallStarsAvg / countReviews).toFixed(1));
  overall_product_quality_rating = parseFloat((overall_product_quality_rating / countReviews).toFixed(1));
  overall_vendor_quality_rating = parseFloat((overall_vendor_quality_rating / countReviews).toFixed(1));
  overall_product_description_rating = parseFloat((overall_product_description_rating / countReviews).toFixed(1));

  const productsTableSet = await db.collection('products').doc(product_id);
  productsTableSet.set(
    {
      reviews: existingReviews,
      stars: overallStarsAvg,
      overall_product_quality_rating: overall_product_quality_rating,
      overall_vendor_quality_rating: overall_vendor_quality_rating,
      overall_product_description_rating: overall_product_description_rating,
      number_reviews: countReviews + 1
    },
    { merge: true }
  );

  // hides review button when review's already submitted
  const userOrdersSet = await db.collection('users').doc(user_id).collection('orders').doc(order_id);
  userOrdersSet.set(
    { status: "reviewed" },
    { merge: true }
  );

  // post form to reload page with updated orders
  $('form#user-details').submit();

}

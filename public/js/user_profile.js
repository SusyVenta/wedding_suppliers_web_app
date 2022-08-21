/* ------------------------- User profile page - tab structure ------------------------
Controls the functioning of the tab structure (Personal information, Wishlist, My Orders)
*/
function openUserProfile(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

/* By default, when user loads the customer profile page, the personal information section tab is open. */
document.getElementById("defaultOpen").click();


/* When user updates personal details, save updated details to the database */
const updateProfileForm = async () => {
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
}

/* When user clicks on 'Update profile picture', activates the upload */
function uploadTrigger() {
  var input = document.getElementById('profile-pic-input');
  input.click();
}

// upload the image to firebase storage and update the profile picture
async function updateProfilePic() {
  let user_id = document.getElementById("user_id_navbar").innerHTML;
  var input = document.getElementById('profile-pic-input');

  var file = input.files[0];
  var storageRef = firebase.storage().ref('customer_profiles/' + user_id + "/" + file.name );

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
async function cancelOrder(order_id) {
  let user_id = document.getElementById("user_id_navbar").innerHTML;
  await db.collection('users').doc(user_id).collection('orders').doc(order_id).delete();
  // reload page to refresh orders
  location.reload();
};

// Once the order has been confirmed by the vendor, users can review the product
async function reviewProduct(product_id, quality_rating, vendor_quality_rating, product_description_rating) {
  console.log(product_id, quality_rating, vendor_quality_rating, product_description_rating);

  let user_id = document.getElementById("user_id_navbar").innerHTML;

}

function getStarValue(radios) {
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
}
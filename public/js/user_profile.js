/* ------------------------- User profile page - tab structure ------------------------*/
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

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

const updateProfileForm = async () => {
  let user_id = document.getElementById("user_id_navbar").innerHTML;
  const data = {
    user_id: user_id,
    profile_picture: document.getElementById("profile-pic").src,
    address_1: document.getElementById("address_1").value,
    phone_number: document.getElementById("phone_number").value,
    country: document.getElementById("country").value,
    city: document.getElementById("city").value,
    post_code: document.getElementById("post_code").value,
  }
  const result = await fetch('http://localhost:8080/users/' + user_id + '/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const json = await result.json();
  console.log(json);
}


/* ------------------------- User profile page - todo list ------------------------*/

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.onclick = async function () {
    var div = this.parentElement;

    let user_id = document.getElementById("user_id_navbar").innerHTML;

    console.log(div);

    //get div id
    let id = div.id;

    //remove first 4 characters from id
    let todo_id = Number(id.substring(4)) - 1;

    const result = await fetch('http://localhost:8080/users/' + user_id + '/todo/' + todo_id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await result.json();
    console.log(json);
    div.style.display = "none";
  }
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
  //add id to each list item
  myNodelist[i].id = "todo" + i;
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newToDoElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("to-do-list-new-input").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {

    let user_id = document.getElementById("user_id_navbar").innerHTML;
    const data = {
      user_id: user_id,
      todo: inputValue
    }
    const result = fetch('http://localhost:8080/users/' + user_id + '/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      li.id = "todo" + myNodelist.length;
      document.getElementById("to-do-list-items").appendChild(li);
      console.log(result);
    }).catch(error => {
      console.log(error.message);
    });
  }
  document.getElementById("to-do-list-new-input").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      const result = fetch('http://localhost:8080/users/' + user_id + '/todo' + i, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        var div = this.parentElement;
        div.style.display = "none";
      }).catch(error => {
        console.log(error.message);
      });
    }
  }
}

function uploadTrigger() {
  var input = document.getElementById('profile-pic-input');
  input.click();
}

//upload the image to firebase storage and update the profile pic
function updateProfilePic() {
  let user_id = document.getElementById("user_id_navbar").innerHTML;
  var input = document.getElementById('profile-pic-input');
  console.log(input.files[0]);
  var file = input.files[0];
  var storageRef = firebase.storage().ref('customer_profiles/' + user_id + "/" + file.name );
  storageRef.put(file).then(() => {
    storageRef.getDownloadURL().then(url => {
      document.getElementById("profile-pic").src = url;
      updateProfileForm();
      console.log('Uploaded a blob or file!');
    })
    
  }).catch(error => {
    console.log(error.message);
  }
  );
}

function addToBasket(index) {
  console.log(index);

  let user_id = document.getElementById("user_id_navbar").innerHTML;
  let quantity = document.getElementById(index + "-quantity").value;
  let color = document.getElementById(index + "-color").value;
  let date = document.getElementById(index + "-preferred_delivery").value;
  let productID = document.getElementById(index + "-id").value;

  console.log(quantity);
  console.log(color);
  console.log(date);
  console.log(productID);

  const data = {
    user_id: user_id,
    quantity: quantity,
    color: color,
    preferred_delivery: date,
    action: "confirm_availability"
  }

  console.log(data);

  const result = fetch('http://localhost:8080/product_details/' + productID, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => {
    console.log(res);
    if (res.status === 200) {
      alert("Product added to basket");
      location.reload();
    } else {
      alert("Product not available");
    }
  }).catch(error => {
    console.log(error.message);
  }
  );
  
}
let selected_product_id = 0;
function reviewOrder(value) {
  let box = document.getElementById("user-comments-box");
  selected_product_id = value;
  console.log(selected_product_id);
  box.style.display = "block";
}

function submitReview() {
  let overall_radios = document.getElementsByName("overall-rate");
  let overall_rate = getStarValue(overall_radios);

  let quality_radios = document.getElementsByName("quality-rate");
  let quality_rate = getStarValue(quality_radios);

  let vendor_radios = document.getElementsByName("vendor-quality-rate");
  let vendor_rate = getStarValue(vendor_radios);

  let description_radios = document.getElementsByName("description-rate");
  let description_rate = getStarValue(description_radios);

  let comment = document.getElementById("user-comments-box-text").value;
  
  // let date = new Date();

  let user_id = document.getElementById("user_id_navbar").innerHTML;

  let data = {
    user_id: user_id,
    product_id: selected_product_id,
    comment: comment,
    overall_rating: overall_rate,
    product_quality_rating: quality_rate,
    product_description_rating: description_rate,
    vendor_quality_rating: vendor_rate,
    // date: date
  }

  const result = fetch('http://localhost:8080/users/' + user_id + '/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(() => {
    alert("Review submitted");
    // location.reload();
  }).catch(error => {
    console.log(error.message);
  }
  );
}

function getStarValue(radios) {
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
}
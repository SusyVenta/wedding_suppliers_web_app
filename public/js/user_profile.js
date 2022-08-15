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
    let todo_id = Number(id.substring(4))-1;

    const result = await fetch('http://localhost:8080/users/' + user_id + '/todo/' + todo_id , {
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
      const result = fetch('http://localhost:8080/users/' + user_id + '/todo' + i , {
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

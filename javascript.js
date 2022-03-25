//Allows for a AJAX methoid to be re-used by multiple calls by passing in the infomation required
function ajaxRequest(method, url, data, callback, err) {
    //XMLHttpRequest Object required for setting up the AJAX request
    let request = new XMLHttpRequest();
    request.open(method, url, true);
    if(method == "POST") {
        request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    }
    request.send(data);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                let response = request.responseText;
                callback(response);
            } else {
                err(request.statusText);
            }
        }
    }
}

//Is an error function which is used to be able to display an error to the user
//through the use of a popup alert
function showErrorPopup(errorMessageT) {
  alert(errorMessageT);
}


//Is used to be able to call the ajaxRequest methoid and passes it the relivent
//parmeters to be able to login using a php file to check the database if the
//username and password are a pair present on the database
function loginCall() {
  //Grabs the data of the user name and password from the fields of the form input
  //and sets up the url, method and data being sent
  let l_username = document.getElementById("username").value;
  let l_password = document.getElementById("password").value;
  let l_method = "POST";
  let l_url = "http://localhost/WeatherWatcher/loginSQL.php";
  let l_data = "username=" + l_username + "&password=" + l_password;
  //Calls the ajaxRequest js method using the relivent data
  ajaxRequest(l_method, l_url, l_data, loginAJAX, showErrorPopup);
}

//Is the callback function used to be able to reconstuct the login page to
//either show the users weather if the login is successful, or give a user
//login error depending on the value of responseT it receives
function loginAJAX(responseT) {
  //parses the responce as JSON
  let user = JSON.parse(responseT);
  //If the response is "-1" representing an unsuccessfull login
  //update the page to tell them that the "user name or password is incorrect"
  if (user.uid == "-1"){
    //Checks if there is already an error message pressent so that multiple
    //messages are not bought up
    if (document.getElementById("errormessage") == null){
      //Creates the error message and appends it to the document
      let errorheader = document.createElement("H4");
      errorheader.id = 'errormessage';
      let errortext = document.createTextNode("Username or Password are incorrect!");
      let button = document.getElementById("login");
      let buttonParent = button.parentNode;
      errorheader.appendChild(errortext);
      buttonParent.appendChild(errorheader);
    }
  }
  //Otherwise login is successful
  else {
    //Calls the userMainpage with the user ID as a way of being able to store them
    //userID on the session page
    userMainPage();
    let w_userid = user.uid;
    //after drawing the page, set the onlick event for the Add/Delete towns to
    //call the requestTownSection with the USERID
    changeButton = document.getElementById("change")
    changeButton.onclick = function fun() {requestTownSection(w_userid);}
    //Also sets a userid field for being referenced by other methoids
    changeButton.userid = w_userid;
    let w_method = "POST";
    let w_url = "http://localhost/WeatherWatcher/checkUserTowns.php";
    let w_data = "userid=" + w_userid;
    //Calls the ajaxRequest js method using the relevent data
    ajaxRequest(w_method, w_url, w_data, showUserWeather, showErrorPopup);
  }
}

//Is called after the user has successfully logged into the page, it will take
//the reponse received from the AJAX call to find out the weather which the
//user is watching
function showUserWeather(responseT) {
  //Clears the div with checkboxes
  let divTowns = document.getElementById("changeTowns");
  divTowns.innerHTML = "";
  //parses the responce as JSON
  let weather = JSON.parse(responseT);
  //If the user has not prevously sellected any towns to watch on their account
  //(user.uid is "-1") create the page to say that they are not currently watching
  //any towns weather
  if (weather.uid == "-1"){
    if (document.getElementById("secondaryWeatherHeader").innerHTML != "Your account has currently not chosen any towns to watch"){
        let message = document.getElementById("secondaryWeatherHeader");
        message.innerHTML = "Your account has currently not chosen any towns to watch";
        //First adds the headings to the table
        let table = document.getElementById("weatherTable");
        //Clears the prevous content from the table
        table.innerHTML = "";
    }
  }
  //Otherwise read the JSON outputted by the PHP and creates a table with the Towns
  //weather infomation
  else {
    //parses the response as JSON
    let weather = JSON.parse(responseT);
    //Saves returned Town, Temperature and Summary arrays
    let towns = weather["towns"];
    let currtemp = weather["currtemp"];
    let summary = weather["summary"];
    //Stores the length of the first array to know how many towns the user is watching
    let numTowns = towns.length;
    //Clears the prevous content from the table
    let table = document.getElementById("weatherTable");
    table.innerHTML = "";
    //adds the headings to the table
    addRowTh3(table, 'Town:', 'Temperture:', 'Condtion:');
    //Goes through a loop of adding the towns and info by calling the row creation
    //with the index of "i" in the arrays
    for (let i = 0; i < numTowns; i++) {
        addRowTr3(table, towns[i], currtemp[i], summary[i]);
    }
    //Is used to be able to show the time the weather was request
    let d = new Date();
    let day = d.getDate();
    //Formats the month correct
    let month = d.getMonth() + 1;
    //Formats the year correct
    let year = d.getYear() - 100 + 2000;
    //Adds the infomation to the secondaryWeatherHeader ellement
    let message = document.getElementById("secondaryWeatherHeader");
    message.innerHTML = "Your Towns Weather for " + day + "/" + month + "/" + year;
  }
}

//Makes a AJAX request to the find infomation on a passed in town
function findmoreInformation(town) {
  //Sets up the url, method and data being sent
  let i_town = town;
  let i_method = "POST";
  let i_url = "http://localhost/WeatherWatcher/moreInfo.php";
  let i_data = "town=" + i_town;
  //Calls the ajaxRequest js method using the relivent data
  ajaxRequest(i_method, i_url, i_data, showExtraInfo, showErrorPopup);
}

//Shows the extra infomation on the main page through creating a table and showing
//it underneth the table of the users towns they are watching
function showExtraInfo(responseT) {
  //parses the response as JSON
  let extraweather = JSON.parse(responseT);
  let table;
  //Clears the table if present
  if (document.getElementById("moreInfo")==null){
    table = document.createElement('table');
    //Sets the ID of the table for it to be referenced
    table.id = "moreInfo";
  }
  //otherwise creates a new table
  else {
    table = document.getElementById("moreInfo");
    //removes the exsisting rows
    table.innerHTML = "";
  }
  //Adds all the ellements of the response to the rows of the table
  addRowTr2(table, 'Town:', extraweather.town);
  addRowTr2(table, 'Outlook:', extraweather.outlook);
  addRowTr2(table, 'Current Temp:', extraweather.currtemp);
  addRowTr2(table, 'Min Temp:', extraweather.min_temp);
  addRowTr2(table, 'Max Temp:', extraweather.max_temp);
  addRowTr2(table, 'Summary:', extraweather.summary);
  addRowTr2(table, 'Tomorrow:', extraweather.tomorrow);
  let tableSibling = document.getElementById("weatherTable");
  tableSibling.parentNode.insertBefore(table, tableSibling.nextSibling);
}

//Makes a AJAX request to return all the towns avalible and which ones the user
//is currently watching by using the passed in uID to reference the weatherJoin table
function requestTownSection(uID) {
  //Sets up the url, method and data being sent
  let r_method = "POST";
  let r_url = "http://localhost/WeatherWatcher/showTowns.php";
  let r_data = "userid=" + uID;
  //Calls the ajaxRequest js method using the relivent data
  ajaxRequest(r_method, r_url, r_data, showTownSelection, showErrorPopup);
}

//Adds the checkboxes to the page either checked or not checked depending on the
//towns that the user is currently watching
function showTownSelection(responseT){
  //parses the response as JSON
  let townSelection = JSON.parse(responseT);
  let towns = townSelection["towns"];
  let checked = townSelection["selected"];
  //Stores the length of the arrays to know how many towns the user is watching and how
  //many town options there are
  let numTowns = towns.length;
  let numChecked = checked.length;
  //Clears the content in the townSelection before going through a loop of creating the
  //towns with checkboxes in the current state being checked if they are watching
  //already, with no checked property if they have not been added yet
  let divTowns = document.getElementById("changeTowns");
  //Clear form before adding to it
  divTowns.innerHTML = "";
  //Goes through a loop of adding the towns with checkboxes
  for (let i = 0; i < numTowns; i++) {
      //Creates a input ellement with the required properties
      let input = document.createElement('input');
      input.type = 'checkbox';
      input.id = towns[i];
      input.value = "true";
      //Creates the text to go beside the check box
      let text = document.createElement('p');
      text.innerHTML = towns[i];
      //Checks if there is a value with the same town name in the user checked array
      //to know if the checkbox needs to be checked
      for (let j = 0; j < numChecked; j++){
        if (towns[i] == checked[j]){
          input.checked = "checked";
        }
      }
      //appends the items
      text.appendChild(input);
      divTowns.appendChild(text);
  }
  //Adds a button to save changes by calling the "confirmTownSection()" as a
  //onclick event
  let button = document.createElement('button');
  button.onclick = function fun() {confirmTownSection();}
  button.id = "saveChanges";
  button.innerHTML = "Save"
  divTowns.appendChild(button);
}

//Makes a AJAX request to send  back the town information to the server so that it
//knows if it needs to either add or remove a town from the towns that a users is watching
function confirmTownSection() {
  //Sets up the url, method and data being sent
  let c_method = "POST";
  let c_url = "http://localhost/WeatherWatcher/submitTowns.php";
  let townsArray = ['Hamilton', 'Auckland', 'Christchurch', 'Dunedin', 'Tauranga', 'Wellington'];
  //Goes through a loop of checking each of the checkboxes and puts the checked value in a array cv
  let cv = new Array();
  for (let i = 0; i < townsArray.length; i++){
    //Gets the ellement with the id of town
    let checkbox = document.getElementById(townsArray[i]);
    //Finds if it is checked or not to know if it needs to
    //push a value of 0 if it is not sellected or 1 if it is sellected
    if(checkbox.checked == false){
      cv.push("0");
    }
    else {
      cv.push("1");
    }
  }
  //Gets the user ID from the changeButton field
  changeButton = document.getElementById("change")
  let userID = changeButton.userid;
  //Finds all the checked boxes values from the cv array and sends them with the right town as the  data
  let c_data = "userid=" + userID + "&ham=" + cv[0] + "&auc=" + cv[1] + "&chr=" + cv[2] + "&dun="+ cv[3] +"&tau=" + cv[4] + "&wel=" + cv[5];
  //If the moreInfo table is present, then remove all the data inside it
  if (document.getElementById("moreInfo")!=null){
    table = document.getElementById("moreInfo");
    //removes the exsisting rows
    table.innerHTML = "";
  }
  //Calls the ajaxRequest js method using the relevent data
  ajaxRequest(c_method, c_url, c_data, showUserWeather, showErrorPopup);
}

//Is a function used to be able to add a value to a table cell
function addItemToCellTr(tr, val) {
  let td = document.createElement('td');
  td.innerHTML = val;
  tr.appendChild(td);
}

//Is a function used to be able to add a value to a table header
function addItemToCellTh(tr, val) {
  let th = document.createElement('th');
  th.innerHTML = val;
  tr.appendChild(th);
}

//Is a function used to be able to add a value to a table row while also setting
//an id, class and js onlick to call the expanded view of the weather object
function addItemToCellTrTown(tr, val) {
  let td = document.createElement('td');
  td.innerHTML = val;
  //Adds the ID and class values to the td ellement
  td.className = 'town';
  //Adds a onclick methoid which calls the
  td.id = val;
  //Adds a onclick methoid to town item with the js methoid findmoreInformation AJAX function
  //with the name of the town being what it is called with
  td.onclick = function fun() {findmoreInformation(val);}
  tr.appendChild(td);
}

//Is a function used to be able to add a table row with 2 items
function addRowTr2(tb, item1, item2) {
  let tr = document.createElement('tr');
  //Makes sure to make sure the town name is clickable by calling a seperate
  //methoid which is used to be able to
  addItemToCellTr(tr, item1);
  addItemToCellTr(tr, item2);
  //Appends the row to the table
  tb.appendChild(tr);
}

//Is a function used to be able to add a table row with 3 items
function addRowTr3(tb, item1, item2, item3) {
  let tr = document.createElement('tr');
  //Makes sure to make sure the town name is clickable by calling a seperate
  //methoid which is used to be able to
  addItemToCellTrTown(tr, item1);
  addItemToCellTr(tr, item2);
  addItemToCellTr(tr, item3);
  //Appends the row to the table
  tb.appendChild(tr);
}

//Is a function used to be able to add a table header with 3 items
function addRowTh3(tb, item1, item2, item3) {
  let tr = document.createElement('tr');
  addItemToCellTh(tr, item1);
  addItemToCellTh(tr, item2);
  addItemToCellTh(tr, item3);
  //Appends the header to the table
  tb.appendChild(tr);
}

//I used to be able to constuct the login page if the user clicks the logout button
function userLogout() {
  //Creates all the dom ellements for seting up the login page
  var pageHeadingH1 = document.createElement("h1");
  var userLoginForm = document.createElement("form");
  var containerDiv = document.createElement("div");
  var loginDiv = document.createElement("div");
  var usernameLabel = document.createElement("label");
  var usernameInput = document.createElement("input");
  var passwordLabel = document.createElement("label");
  var passwordInput = document.createElement("input");
  var loginButton = document.createElement("button");
  //Sets the atributes of the dom elements
  pageHeadingH1.setAttribute("class", "pageHeading");
  pageHeadingH1.innerHTML = "Weather Watchers";
  userLoginForm.setAttribute("id", "userLoginForm");
  userLoginForm.setAttribute("onsubmit", "return false");
  containerDiv.setAttribute("class", "container");
  loginDiv.setAttribute("id", "logindiv");
  usernameLabel.setAttribute("for", "username");
  usernameLabel.innerHTML = "User Name:"
  usernameInput.setAttribute("type", "text");
  usernameInput.setAttribute("id", "username");
  passwordInput.setAttribute("value", "");
  passwordLabel.setAttribute("for", "password");
  passwordLabel.innerHTML = "User Name:"
  passwordInput.setAttribute("type", "password");
  passwordInput.setAttribute("id", "password");
  passwordInput.setAttribute("value", "");
  loginButton.setAttribute("type", "button");
  loginButton.setAttribute("id", "login");
  loginButton.setAttribute("onclick", "loginCall()");
  loginButton.innerHTML = "Login:";
  //Appends the elements to the correct
  loginDiv.appendChild(usernameLabel);
  loginDiv.appendChild(usernameInput);
  loginDiv.appendChild(passwordLabel);
  loginDiv.appendChild(passwordInput);
  loginDiv.appendChild(loginButton);
  containerDiv.appendChild(loginDiv);
  userLoginForm.appendChild(containerDiv);
  console
  document.body.innerHTML = "";
  document.body.appendChild(pageHeadingH1);
  document.body.appendChild(userLoginForm);
}

//I used to be able to constuct the main page if the users login is successful
//stores the user ID in the logout button and other sections of code access
//this property for certian methoids where required
function userMainPage(userid) {
  document.body.innerHTML = "<h1 class='pageHeading'>Weather Watchers</h1><div class='container'><div id='userButtons'><button id='change'>Add or Delete Towns:</button><button id='logout' onclick='userLogout()'>Logout:</button></div><div id='changeTowns'></div><br><h3 id='secondaryWeatherHeader'></h3><table id='weatherTable'></table></div>"
}

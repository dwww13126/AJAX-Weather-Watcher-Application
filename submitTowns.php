
<?php
require_once('dbConnect.php');
//Updates the users towns that they are watching stored in the weatherJoin table
//for each of the
$userName = $_POST['userid'];
$town = $_POST['ham'];
//If the town was checked when the user submitted the towns
if ($town == "1"){
  $query = "INSERT INTO `weatherjoin` (uid, town) VALUES ('".$userName."', 'Hamilton')";
  $result = mysqli_query($conn, $query);
}
//Else the town was not checked when the user submitted the towns
else{
  //Selects all instances of the weather associated with the users selected town
  $query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Hamilton'";
  $result = mysqli_query($conn, $query);
  //If the result is present
  if(mysqli_num_rows($result)!= 0) {
    $query = "DELETE FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Hamilton'";
    $result = mysqli_query($conn, $query);
  }
}
$town = $_POST['auc'];
//If the town was checked when the user submitted the towns
if ($town == "1"){
  $query = "INSERT INTO `weatherjoin` (uid, town) VALUES ('".$userName."', 'Auckland')";
  $result = mysqli_query($conn, $query);
}
//Else the town was not checked when the user submitted the towns
else{
  //Selects all instances of the weather associated with the users selected town
  $query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Auckland'";
  $result = mysqli_query($conn, $query);
  if(mysqli_num_rows($result)!= 0) {
    $query = "DELETE FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Auckland'";
    $result = mysqli_query($conn, $query);
  }
}
$town = $_POST['chr'];
//If the town was checked when the user submitted the towns
if ($town == "1"){
  $query = "INSERT INTO `weatherjoin` (uid, town) VALUES ('".$userName."', 'Christchurch')";
  $result = mysqli_query($conn, $query);
}
//Else the town was not checked when the user submitted the towns
else{
  //Selects all instances of the weather associated with the users selected town
  $query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Christchurch'";
  $result = mysqli_query($conn, $query);
  if(mysqli_num_rows($result)!= 0) {
    $query = "DELETE FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Christchurch'";
    $result = mysqli_query($conn, $query);
  }
}
$town = $_POST['dun'];
//If the town was checked when the user submitted the towns
if ($town == "1"){
  $query = "INSERT INTO `weatherjoin` (uid, town) VALUES ('".$userName."', 'Dunedin')";
  $result = mysqli_query($conn, $query);
}
//Else the town was not checked when the user submitted the towns
else{
  //Selects all instances of the weather associated with the users selected town
  $query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Dunedin'";
  $result = mysqli_query($conn, $query);
  if(mysqli_num_rows($result)!= 0) {
    $query = "DELETE FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Dunedin'";
    $result = mysqli_query($conn, $query);
  }
}
$town = $_POST['tau'];
//If the town was checked when the user submitted the towns
if ($town == "1"){
  $query = "INSERT INTO `weatherjoin` (uid, town) VALUES ('".$userName."', 'Tauranga')";
  $result = mysqli_query($conn, $query);
}
//Else the town was not checked when the user submitted the towns
else{
  //Selects all instances of the weather associated with the users selected town
  $query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Tauranga'";
  $result = mysqli_query($conn, $query);
  if(mysqli_num_rows($result)!= 0) {
    $query = "DELETE FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Tauranga'";
    $result = mysqli_query($conn, $query);
  }
}
$town = $_POST['wel'];
//If the town was checked when the user submitted the towns
if ($town == "1"){
  $query = "INSERT INTO `weatherjoin` (uid, town) VALUES ('".$userName."', 'Wellington')";
  $result = mysqli_query($conn, $query);
}
//Else the town was not checked when the user submitted the towns
else{
  //Selects all instances of the weather associated with the users selected town
  $query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Wellington'";
  $result = mysqli_query($conn, $query);
  if(mysqli_num_rows($result)!= 0) {
    $query = "DELETE FROM `weatherjoin` WHERE `uid` = '".$userName."' AND `town` = 'Wellington'";
    $result = mysqli_query($conn, $query);
  }
}

//Goes through the steps of returning the weather for each town in the weatherJoin table
//associated with the users ID

//Selects all instances of the weather associated with the users selected town
$query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$_POST['userid']."'";
$result = mysqli_query($conn, $query);
//If there is a user with the same user name and password, return each of
//the different towns and their weather information.
if(mysqli_num_rows($result)!= 0) {
     //Is used to be able to get the id of the user
     $row = mysqli_fetch_assoc($result);
     $uid = $row['uid'];
     //creates an array for storing the towns that the user is monitoring
     //and stores the first town from the current row
     $userwatch = array($row['town']);
     //For each of the different weather values
     while($row = mysqli_fetch_assoc($result))
     {
       array_push($userwatch, $row['town']);
     }
     //Creates an array for being able to store the weather data that needs
     //to be returned
     $weather = array('uid' => $uid, 'towns' => array(), 'currtemp' => array(), 'summary' => array(), 'min_temp' => array(), 'max_temp' => array(), 'outlook' => array(), 'tomorrow' => array());
     //Goes through a while loop to get all information of the results for
     //each town in the array the way in which the
     foreach ($userwatch as $town) {
        $query = "SELECT * FROM `weather` WHERE `town` = '".$town."'";
        $result = mysqli_query($conn, $query);
       //For each of the different weather values
       $row = mysqli_fetch_assoc($result);
         //Adds each of the different values to the array
        array_push($weather['towns'], $row['town']);
        array_push($weather['currtemp'], $row['currTemp']);
        array_push($weather['summary'], $row['summary']);
        array_push($weather['min_temp'], $row['min_temp']);
        array_push($weather['max_temp'], $row['max_temp']);
        array_push($weather['outlook'], $row['outlook']);
        array_push($weather['tomorrow'], $row['tomorrow']);
     }
     //Echos back the array encoded in JSON
     echo json_encode($weather);
}
//If the user has not selected any towns to monitor the weather of, return -1 in a json format
else{
    $fail = array('uid' => '-1');
    echo json_encode($fail);
}?>

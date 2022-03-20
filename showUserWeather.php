
<?php
require_once('dbConnect.php');
//Selects all instances of the weather associated with the users selected towns
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
     //For each of the different weather values that the user is watching
     //push it to the userwatch array
     while($row = mysqli_fetch_assoc($result))
     {
       array_push($userwatch, $row['town']);
     }
     //Creates an array with fields of arrays for being able to store the weather
     // data that needs to be returned
     $weather = array('uid' => $uid, 'towns' => array(), 'currtemp' => array(), 'summary' => array(), 'min_temp' => array(), 'max_temp' => array(), 'outlook' => array(), 'tomorrow' => array());
     //Goes through a while loop to get all information of the results for
     //each town that the user is watching
     foreach ($userwatch as $town) {
        $query = "SELECT * FROM `weather` WHERE `town` = '".$town."'";
        $result = mysqli_query($conn, $query);
       //For each of the different weather values
       $row = mysqli_fetch_assoc($result);
         //Adds each of the different values to the respective arrays
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
//If the user has no selected any towns to monitor the weather of, return -1 in a json format
else{
  $fail = array('uid' => '-1');
  echo json_encode($fail);
}
   ?>

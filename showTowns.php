
<?php
    require_once('dbConnect.php');
    //Selects all weather infomation
    $query = "SELECT * FROM `weather`";
     $result = mysqli_query($conn, $query);
     //If there is a town which matches
     if(mysqli_num_rows($result)!= 0) {
          $towns = array();
          $userWatching = array();
          //Goes through a loop of adding the different towns to the array towns
          while($row = mysqli_fetch_assoc($result)){
            array_push($towns, $row['town']);
          }
          //Goes through the
          $query = "SELECT * FROM `weatherjoin` WHERE `uid` = '".$_POST['userid']."'";
          $result = mysqli_query($conn, $query);
          //Goes through the weatherjoin table to the different towns that the user is watching
          if(mysqli_num_rows($result)!= 0) {
            while($row = mysqli_fetch_assoc($result)){
              array_push($userWatching, $row['town']);
            }
          }
          //If the user is not watching any towns then set $userWatching to be "-1"
          else {
            $userWatching = '-1';
          }
          //Creates an array for being able to store the weather data that needs
          //to be returned
          $weatherOptions = array('towns' => $towns, 'selected' => $userWatching);
          //Echos back the array encoded in JSON
          echo json_encode($weatherOptions);
     }
     //If the user has no selected any towns to monitor the weather of, return -1 for both towns and sellected in a json format
     else {
       $fail = array('towns' => '-1', 'selected' => '-1');
       echo json_encode($fail);
     }
       ?>

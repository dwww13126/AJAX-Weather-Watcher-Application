
<?php
    require_once('dbConnect.php');
    //Selects all realated weather infomation for the requested town
    $query = "SELECT * FROM `weather` WHERE `town` = '".$_POST['town']."'";
     $result = mysqli_query($conn, $query);
     //If there is a town which matches
     if(mysqli_num_rows($result)!= 0) {
          //Is used to be able to get the weather infomation for the sellected town
          $row = mysqli_fetch_assoc($result);
          //Creates an array for being able to store the weather data that needs
          //to be returned
          $weatherInfo = array('town' => $row['town'], 'currtemp' => $row['currTemp'], 'summary' => $row['summary'], 'min_temp' => $row['min_temp'], 'max_temp' => $row['max_temp'], 'outlook' => $row['outlook'],
          'tomorrow' => $row['tomorrow']);
          //Echos back the array encoded in JSON
          echo json_encode($weatherInfo);
     }
     //If the user has no selected any towns to monitor the weather of, return -1 in a json format
     else{
       $fail = array('town' => '-1');
       echo json_encode($fail);
     }
       ?>

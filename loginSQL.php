
<?php
    require_once('dbConnect.php');
   //Checks if there is a login using the POST values of the UserName and Password sent to the PHP
   $query = "SELECT * FROM `users` WHERE `username` = '".$_POST['username']."' AND `password` = '".$_POST['password']."'";
    $result = mysqli_query($conn, $query);
    //If there is a user with the same user name and password, return the user id in a json format
    if(mysqli_num_rows($result)!= 0) {
        $row = mysqli_fetch_assoc($result);
        $success = array('uid' => $row['uid']);
        echo json_encode($success);
    }
    //If no entry with the user and password entered is present, return -1 in a json format
    else{
        $fail = array('uid' => '-1');
        echo json_encode($fail);
    }?>

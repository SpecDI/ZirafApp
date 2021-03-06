<?php
    //get the database logic
    require_once "../phpComponents/databaseConnection.php";
    //check type of access
    checkRequestType();

    //create database connection
    $db = createConnection();

    //get the provided user email
    $email = strip_tags(stripslashes($_GET['emailAddress']));
    //check email security
    if(filter_var($email, FILTER_VALIDATE_EMAIL) === false){
        die("Error with email");
    }
    //create query that checks the number of identic emails
    $query = "SELECT count(*) FROM USERS WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    //output result
    echo $count;
?>
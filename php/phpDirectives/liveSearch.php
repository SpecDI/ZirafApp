<?php
    session_start();
    //get the database logic
    require_once "../phpComponents/databaseConnection.php";
    //get the post and user dependencies
    require_once "../phpComponents/dependencies.php";
    checkRequestType();
    //create database connection
    $db = createConnection();

    //get the input from the user
    $input = strip_tags(stripslashes($_GET['userInput']));
    $input = "%$input%";

    $userId = $_SESSION['userId'];

    //search for results similar with the input from the user
    $query = "SELECT email FROM USERS WHERE email LIKE ? AND userId != ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $input, $userId);
    $stmt->execute();
    $stmt->bind_result($suggestion);
    $results = array();
    while($stmt->fetch()){
        array_push($results, $suggestion);
    }
    $stmt->close();
    echo json_encode($results);
?>
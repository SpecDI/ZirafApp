<?php
    function createConnection(){
        //initialize the database information
        $servername = "localhost";
        $username = "root";
        $password = "";
        $databasename = "zirafapp_zirafers";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $databasename);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }else{
            //return the connection for later use
            echo "success, database generated";
            return $conn;
        }
    }
?>
<?php
    session_start();

        $_SESSION['user_submission'] = $_POST['user_submission'];
        
        $to = "ogladfelter@gmail.com";
        $email_subject = "New Alignment Chart Submission";
        $email_body = $_SESSION['user_submission'];
        $headers = "From: $to";

        mail($to,$email_subject,$email_body,$headers);

?>
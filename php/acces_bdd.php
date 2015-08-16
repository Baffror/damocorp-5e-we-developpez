<?php

$bdd = new PDO('mysql:host=localhost;dbname=CENSURE','CENSURE','CENSURE',array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
$bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
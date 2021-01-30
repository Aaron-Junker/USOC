<?php
    header('Content-type: text/html; charset=utf-8');
    ini_set('zlib.output_compression',0);
    ini_set('implicit_flush',1);
    ob_end_clean();
    set_time_limit(0);
    session_start();
    function output($text, $color = "black"){
        echo "<p style=\"color: ".$color.";\">".$text."</p>";
        flush();
    }
    function error($text){
        output($text, "red");
        output("Installation stopped", "red"); 
        exit();
    }
    // This function installs USOC
    function install($session){
        if(confFile($session)){
            output("Configuration files created", "green"); 
            if(db($session)){
                output("Database created", "green"); 
            }else{
                error("Error while creating database");
            }
        }else{
            error("Error while creating configuration.php");
        }
    }
    // THis function creates configuration.php
    function confFile($session){
        output("Try creating configuration files"); 
        if(file_exists("../configuration.php") || file_exists("../admin/configuration.php")){
            output("The configuration files are already existing", "red"); 
            return False;
        }else{
            // Create configuration.php in the root folder
            output("Try creating configuration file in the root folder"); 
            $code = <<<'HEREDOC'
            <?php
                error_reporting(E_ALL);
                //MYSQL CREDITALS
                define('MYSQL_HOST', '%a');
                define('MYSQL_USER', '%b');
                define('MYSQL_PASSWORD', '%c');
                define('MYSQL_DATABASE', '%d');
                //define
                $USOC = array();
                $USOC["SITE_PATH"] = "";
                $USOC["ADMIN_PATH"] = "/admin";
                $USOC["DOMAIN"] = "%e";
            ?>
            HEREDOC;
            $code = str_replace("%a", $session["db.name"], $code);
            $code = str_replace("%b", $session["db.username"], $code);
            $code = str_replace("%c", isset($session["db.passsword"])?$session["db.passsword"]:"", $code);
            $code = str_replace("%d", $session["db.db"], $code);
            $code = str_replace("%e", (stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://').$_SERVER['SERVER_NAME'], $code);
            file_put_contents("../configuration.php", $code);
            // Create configuration.php in the admin folder
            output("Try creating configuration file in the admin folder"); 
            $code = <<<'HEREDOC'
            <?php
                error_reporting(E_ALL);
                //MYSQL CREDITALS
                define('MYSQL_HOST', '%a');
                define('MYSQL_USER', '%b');
                define('MYSQL_PASSWORD', '%c');
                define('MYSQL_DATABASE', '%d');
                //define
                $USOC = array();
                $USOC["SITE_PATH"] = "..";
                $USOC["ADMIN_PATH"] = ".";
                $USOC["DOMAIN"] = "%e";
            ?>          
            HEREDOC;
            $code = str_replace("%a", $session["db.name"], $code);
            $code = str_replace("%b", $session["db.username"], $code);
            $code = str_replace("%c", isset($session["db.passsword"])?$session["db.passsword"]:"", $code);
            $code = str_replace("%d", $session["db.db"], $code);
            $code = str_replace("%e", (stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://').$_SERVER['SERVER_NAME'], $code);
            file_put_contents("../admin/configuration.php", $code);
            // Check if file are existing now
            output("Start checking files"); 
            if(file_exists("../configuration.php") && file_exists("../admin/configuration.php")){
                return True;
            }else{
                output("Files couln't be created", "red");
                return False;
            }
        }
    }
    // This function creates the database structure
    function db($session){
        output("Initialising SQL connection");
        $db_link = mysqli_connect($_SESSION["db.name"], $_SESSION["db.username"], isset($session["db.passsword"])?$session["db.passsword"]:"", $_SESSION["db.db"]);
        output("Get SQL code");
        $sql = file_get_contents("code.sql");
        $sql = str_replace("%a", $session["site.name"], $sql);
        $sql = str_replace("%b", $session["site.description"], $sql);
        $sql = str_replace("%c", $session["site.keywords"], $sql);
        $sql = str_replace("%d", $session["site.lang"], $sql);
        $sql = str_replace("%e", $session["site.robots"], $sql);
        $sql = str_replace("%f", password_hash($session["password"],PASSWORD_DEFAULT), $sql);
        output("Writing into Database");
        if(mysqli_multi_query($db_link, $sql) === False){
            echo mysqli_error($db_link);
            return False;
        }else{
            return True;
        }
    }
    // This function deletes all session variables
    function deleteSession(){
        output("Delete session variables");
        unset($_SESSION["site.name"],$_SESSION["password"],$_SESSION["site.description"],$_SESSION["site.keywords"],$_SESSION["site.robots"],$_SESSION["site.lang"],$_SESSION["db.name"],$_SESSION["db.username"],$_SESSION["db.password"],$_SESSION["db.db"]);
        session_destroy();
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install USOC</title>
    <link href="css.css" rel="stylesheet" />
</head>
<body>
    <h1>Please wait while we're installing...</h1>
    <?php
        echo "<code>";
        try{
            output("Installing begins", "green");
            if(isset($_SESSION["site.name"],$_SESSION["password"],$_SESSION["site.description"],$_SESSION["site.keywords"],$_SESSION["site.robots"],$_SESSION["site.lang"],$_SESSION["db.name"],$_SESSION["db.username"],$_SESSION["db.password"],$_SESSION["db.db"])){
                install($_SESSION);
                deleteSession();
                output("Installation succeded", "green");
                output("<a href=\"finish.php\">Finish installation</a>");
            }else{
               error("Not all fields are field out. Please restart the installation wizzard");
            }
        }catch(exception $e){
            output("Unknown errror: ".$e, "red");
            output("Installation stopped", "red");
        }finally{
            echo "</code>";
        }
    ?>
</body>
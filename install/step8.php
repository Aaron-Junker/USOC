<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install USOC</title>
    <link href="css.css" rel="stylesheet" />
</head>
<body>
    <?php
        if(isset($_POST["Field"])){
            $_SESSION["site.lang"] = $_POST["Field"];
        }elseif(!isset($_SESSION["site.lang"])){
            header("Location: step7.php");
        }
    ?>   
    <form action="step9.php" method="post" id="form">
        <label for="Field" id="p1" style="top:35%">Database (MariaDB):</label>
        <div id="p2" style="top:50%">
            <label for="db_name">Host:</label>
            <input name="db_name" type="text" required value="<?php echo isset($_SESSION["db.name"]) ? $_SESSION["db.name"]:"";?>" /><br />
            <label for="db_username">Username:</label>
            <input name="db_username" type="text" required value="<?php echo isset($_SESSION["db.username"]) ? $_SESSION["db.username"]:"";?>" /><br />
            <label for="db_password">Password:</label>
            <input name="db_password" type="password" value="<?php echo isset($_SESSION["db.password"]) ? $_SESSION["db.password"]:"";?>" /><br />
            <label for="db_db">Database name:</label>
            <input name="db_db" type="text" required value="<?php echo isset($_SESSION["db.db"]) ? $_SESSION["db.db"]:"";?>" /><br />
        </div>
    </form>
    <div id="p3" style="top:65%">
        <button onClick="location.href = 'step7.php'">← Back</button>
        <input type="submit" form="form" style="top:55%;" value="Next step →" />
    </div>
</body>
</html>
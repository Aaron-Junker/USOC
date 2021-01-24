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
            $_SESSION["site.keywords"] = $_POST["Field"];
        }elseif(!isset($_SESSION["site.keywords"])){
            header("Location: step5.php");
        }
    ?>   
    <form action="step7.php" method="post" id="form">
        <label for="Field" id="p1">Search engine flags:</label>
        <select name="Field" id="p2" type="text" required value="<?php echo isset($_SESSION["site.robots"]) ? $_SESSION["site.robots"]:"";?>">
            <option value="index, follow">index, follow</option>
            <option value="noindex, follow">noindex, follow</option>
            <option value="index, nofollow">index, nofollow</option>
            <option value="noindex, nofollow">noindex, nofollow</option>
        </select>
    </form>
    <div id="p3">
        <button onClick="location.href = 'step5.php'">← Back</button>
        <input type="submit" form="form" style="top:55%;" value="Next step →" />
    </div>
</body>
</html>
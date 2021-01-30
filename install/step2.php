<?php
    session_start();
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
    <form action="step3.php" method="post" id="form">
        <label for="Field" id="p1">Name of the website:</label>
        <input name="Field" id="p2" type="text" required value="<?php echo isset($_SESSION["site.name"]) ? $_SESSION["site.name"]:"";?>" />
    </form>
    <div id="p3">
        <button onClick="location.href = 'step1.php'">← Back</button>
        <input type="submit" form="form" style="top:55%;" value="Next step →" />
    </div>
</body>
</html>
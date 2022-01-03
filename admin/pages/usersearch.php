<?php
    if($U->userHasPermission("Backend", "User","Search")){
?>
    <!DOCTYPE html>
    <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
        <head>
            <style>
                tbody > tr > th {
                    font-weight: normal;
                }
            </style>
            <meta charset="utf-8">
            <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.user.search"); ?></title>
        </head>
        <body>
            <a href="javascript:window.close()"><?php echo $U->getLang("admin.exit"); ?></a>
            <p><?php echo $U->getLang("admin.user.search.intro"); ?></p>
            <form>
                <label for="Name"><?php echo $U->getLang("admin.user.field.username"); ?>:</label><br />
                <input type="text" name="Name" /><br />
                <label for="Mail"><?php echo $U->getLang("admin.user.field.mail"); ?>:</label><br />
                <input type="mail" name="Mail" /><br />
                <input type="hidden" name="URL" value="usersearch" />
                <input type="submit" value="<?php echo $U->getLang("admin.user.search.action"); ?>" />
            </form>
            <?php
                if(isset($_GET["Name"])){
                    if($_GET["Name"] !== ""){
                        $sql = "SELECT * FROM User WHERE Username='".mysqli::real_escape_string($_GET["Name"])."';";
                        $dbRes = mysqli_query($U->db_link, $sql);
                    }
                }
                if(isset($_GET["Mail"])){
                    if($_GET["Mail"] !== ""){
                        $sql = "SELECT * FROM User WHERE Mail='".mysqli::real_escape_string($_GET["Mail"])."';";
                        $dbRes = mysqli_query($U->db_link, $sql);
                    }
                }
                if(isset($_GET["Id"])){
                    if($_GET["Id"] !== ""){
                        $sql = "SELECT * FROM User WHERE Id='".mysqli::real_escape_string($_GET["Id"])."';";
                        $dbRes = mysqli_query($U->db_link, $sql);
                    }
                }
                if(isset($_GET["Mail"]) || isset($_GET["Name"]) || isset($_GET["Id"])){
                    $userhere = False;
                    while($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
                        $userhere = True;
            ?>
                        <h4><?php echo str_replace("%a",$row["Username"],$U->getLang("admin.user.search.title")); ?></h4>
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        Id:
                                    </th>
                                    <th>
                                        <?php echo $row["Id"]; ?>
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        <?php echo $U->getLang("admin.user.field.mail"); ?>:
                                    </th>
                                    <th>
                                        <?php echo $row["Mail"]; ?>
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        <?php echo $U->getLang("admin.user.field.permissionlevel"); ?>
                                    </th>
                                    <th>
                                        <?php echo $U->getPermissionName($row["Type"]); ?>
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        <?php echo $U->getLang("admin.user.field.blocked"); ?>
                                    </th>
                                    <th>
                                        <?php echo $row["blocked"]==0?$U->getLang("admin.no"):$U->getLang("admin.yes"); ?>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
            <?php
                    }
                    if(!$userhere&&isset($_GET["Mail"])&&$_GET["Mail"]!==""){
                        echo str_replace("%a", $U->getLang("admin.user.field.mail"), str_replace("%b", $_GET["Mail"], $U->getLang("admin.user.notFound.property")));
                    }
                    if(!$userhere&&isset($_GET["Name"])&&$_GET["Name"]!==""){
                        echo str_replace("%a", $U->getLang("admin.user.field.username"), str_replace("%b", $_GET["Name"], $U->getLang("admin.user.notFound.property")));
                    }
                    if(!$userhere&&isset($_GET["Id"])){
                        echo str_replace("%a", $U->getLang("admin.user.field.id"), str_replace("%b", $_GET["Id"], $U->getLang("admin.user.notFound.property")));
                    }
                }
            ?>
        </body>
    </html>
<?php
  }else{
?>
  <!DOCTYPE html>
  <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.settings"); ?></title>
    </head>
    <body>
        <a href="javascript:window.close()"><?php echo $U->getLang("admin.exit"); ?></a>
      <p><?php echo $U->getLang("rights.error"); ?></p>
    </body>
  </html>
<?php
  }
?>

<?php
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newClass();
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title><?php echo $U->getLang("admin"); ?> - <?php echo $U->getLang("admin.settingsoverview"); ?></title>
    <style>
        <?php echo file_get_contents($USOC["SITE_PATH"]."/includes/SettingsAssets/switch.css"); ?>;
    </style>
    <script><?php echo file_get_contents($USOC["SITE_PATH"]."/includes/SettingsAssets/switch.js"); ?></script>
</head>
<body>
    <h3 id="suceedheader" style="background:green; display:none;">Saved!</h6>
    <table>
        <thead>
            <tr>
                <th style="width:45%">
                    <label for="r">Name:</label>
                </th>
                <th style="width:45%">
                    <p>Value:</p>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>
                    <label for="site.name" title="site.name">Name of the website:</label>
                </th>
                <th>
                    <input type="text" id="site.name" onChange="input_change('site.name')" onChange="onLoad('site.name')" />
                </th>
                <th>
                    <img id="site.name_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="login.register_open" title="login.register_open">Register open for users:</label>
                </th>
                <th>
                    <div class="Checkbox Checkbox-on" id="login.register_open_div" onclick="toggle_checkbox('login.register_open')">On</div><input type="checkbox" checked id="login.register_open" />
                </th>
                <th>
                    <img id="login.register_open_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
        </tbody>
    </table>
</body>
</html>
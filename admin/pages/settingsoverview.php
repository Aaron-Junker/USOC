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
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back"); ?></a>
    <h3 id="suceedheader" style="background:green; display:none;"><?php echo $U->getLang("admin.settings.saved"); ?></h6>
    <table>
        <thead>
            <tr>
                <th style="width:45%">
                    <label for="r"><?php echo $U->getLang("admin.settings.name"); ?></label>
                </th>
                <th style="width:45%">
                    <p><?php echo $U->getLang("admin.settings.value"); ?></p>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>
                    <b>General</b>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="site.name" title="site.name"><?php echo $U->getLang("admin.settings.setting.site.name"); ?></label>
                </th>
                <th>
                    <input type="text" id="site.name" onChange="input_change('site.name')" />
                </th>
                <th>
                    <img id="site.name_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="site.lang" title="site.lang"><?php echo $U->getLang("admin.settings.setting.site.lang"); ?></label>
                </th>
                <th>
                    <select id="site.lang" onChange="input_change('site.lang');location.reload()">
                        <option value="de-ch">de-ch</option>
                        <option value="de-de">de-de</option>
                        <option value="en-en">en-en</option>
                        <option value="es-es">es-es</option>
                        <option value="fr-fr">fr-fr</option>
                        <option value="nl-nl">nl-nl</option>
                    </select>
                </th>
                <th>
                    <img id="site.lang_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="login.login_open" title="login.login_open"><?php echo $U->getLang("admin.settings.setting.login.login_open"); ?></label>
                </th>
                <th>
                    <div class="Checkbox Checkbox-on" id="login.login_open_div" onclick="toggle_checkbox('login.login_open')">On</div><input type="checkbox" checked id="login.login_open" />
                </th>
                <th>
                    <img id="login.login_open_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="login.register_open" title="login.register_open"><?php echo $U->getLang("admin.settings.setting.login.register_open"); ?></label>
                </th>
                <th>
                    <div class="Checkbox Checkbox-on" id="login.register_open_div" onclick="toggle_checkbox('login.register_open')">On</div><input type="checkbox" checked id="login.register_open" />
                </th>
                <th>
                    <img id="login.register_open_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="login.changepassword" title="login.changepassword"><?php echo $U->getLang("admin.settings.setting.login.changepassword"); ?></label>
                </th>
                <th>
                    <div class="Checkbox Checkbox-on" id="login.changepassword_div" onclick="toggle_checkbox('login.changepassword')">On</div><input type="checkbox" checked id="login.changepassword" />
                </th>
                <th>
                    <img id="login.changepassword_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <b><?php echo $U->getLang("admin.settings.SEO"); ?></b>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="site.description" title="site.description"><?php echo $U->getLang("admin.settings.setting.site.description"); ?></label>
                </th>
                <th>
                    <input type="text" id="site.description" onChange="input_change('site.description')" onLoad="onLoad('site.description')" />
                </th>
                <th>
                    <img id="site.description_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="site.keywords" title="site.keywords"><?php echo $U->getLang("admin.settings.setting.site.keywords"); ?></label>
                </th>
                <th>
                    <input type="text" id="site.keywords" onChange="input_change('site.keywords')" onLoad="onLoad('site.keywords')" />
                </th>
                <th>
                    <img id="site.keywords_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="site.robots" title="site.robots"><?php echo $U->getLang("admin.settings.setting.site.robots"); ?></label>
                </th>
                <th>
                    <select id="site.robots" onChange="input_change('site.robots')" onLoad="onLoad('site.robots')">
                        <option value="index, follow">index, follow</option>
                        <option value="noindex, follow">noindex, follow</option>
                        <option value="index, nofollow">index, nofollow</option>
                        <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                </th>
                <th>
                    <img id="site.robots_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <b><?php echo $U->getLang("admin.settings.2fa"); ?></b>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="2fa.enabled" title="2fa.enabled"><?php echo $U->getLang("admin.settings.setting.2fa.enabled"); ?></label>
                </th>
                <th>
                    <div class="Checkbox Checkbox-on" id="2fa.enabled_div" onclick="toggle_checkbox('2fa.enabled')">On</div><input type="checkbox" checked id="2fa.enabled" />
                </th>
                <th>
                    <img id="2fa.enabled_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="2fa.name" title="2fa.name"><?php echo $U->getLang("admin.settings.setting.2fa.name"); ?></label>
                </th>
                <th>
                    <input type="text" id="2fa.name" onChange="input_change('2fa.name')" onLoad="onLoad('2fa.name')" />
                </th>
                <th>
                    <img id="2fa.name_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
            <tr>
                <th>
                    <b><?php echo $U->getLang("admin.settings.oAuth.google"); ?></b>
                </th>
            </tr>
            <tr>
                <th>
                    <a href="" target="_blank"><?php echo $U->getLang("admin.settings.oAuth.google.how"); ?></a>
                </th>
            </tr>
            <tr>
                <th>
                    <label for="oAuth.google.client_id" title="oAuth.google.client_id"><?php echo $U->getLang("admin.settings.setting.oAuth.google.client_id"); ?></label>
                </th>
                <th>
                    <input type="text" id="oAuth.google.client_id" onChange="input_change('oAuth.google.client_id')" onLoad="onLoad('oAuth.google.client_id')" />
                </th>
                <th>
                    <img id="oAuth.google.client_id_load" style="opacity: 0;" src="../images/load.gif"/>
                </th>
            </tr>
        </tbody>
    </table>
</body>
</html>
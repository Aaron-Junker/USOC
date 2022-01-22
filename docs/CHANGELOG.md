<!--
# Pb__.__Bfx__ 
## Additions
*
## Changes
*
## Fixed bugs
* _ (#)
-->
# Pb2.5Bfx0
## Important changes
* Changed name of table `sites` to `pages`
## Additions
* Removed support for PHP 7.4. You now need PHP 8 or higher
* Added AMP support
  * To see a page with AMP just add `/amp/` before the URL (example: `localhost/amp/index`)
  * This doesn't work in combination with `/raw/`
* The admin area editor now accepts the parameter `Code` with base64 encoded code as placeholder
* Added an error handler for the advanced settings editor
* Users can now delete their accounts in the profile settings
* Added a link to change the password in the profile settings
* Added function `$U->getPermissionName($level):mixed`
  * Gives back all permission level names or one specific
* Admin user editor
  * Added a link to see more information about the user you're editing
  * Added a success information
* Added a browser check
  * Your browser needs to support HTML5 videos, HTML5 input types, HTML5 event listeners and the HTML5 JSON API
  * If the browser isn't supported you get redirected to a page with the newest browsers compared
* Added .htaccess rule that no `.inc.php` files can be accessed
## Changes
* Removed support for the URL parameter
* Changed the location of all function files from `/includes` to `/includes/functions` 
* Image plugin
  * `/raw` returns now the real raw image
  * Added support for some alternative file extensions
* Added an option to change another setting after you changed one in the advanced settings editor
* The configuration.php in admin now has a fixed code
  * That means you don't need to edit both files if you want to configure something
* Moved standard logo to `/images/`
* Placeholder variable `$db_erg` got renamed to `$dbRes`
* Function `isRegisterOpen()` got moved to `$U->isRegisterOpen():bool`
* Changed the way `U` calls functions
* Updated some composer packages
## Fixed bugs
### Security bugs
* You could change your password, even when it was deactivated
### Other bugs
* Content pages can have invalid names (#60)
* No title for Google account connect on profile page if already one connected
* Image plugin and text file plugin don't have author information
* The message "You can't edit yourself" was shown after you edited yourself. Now it's shown before you can do something
* 410 error message had wrong string name
* Not all HTTP errors have a string to display
* When you just accessed a page under "/login", which didn't exist you wasn't able to log in with google anymore.
# Pb2.4Bfx1
## Fixed bugs
* Fixed a security bug
# Pb2.4Bfx1
## Fixed bugs
* Some debug function were still in the image plugin
# Pb2.4Bfx0
> USOC now supports PHP8. Through a backwards compatibity script it still supports PHP7.4.
> The PHP7.4 support ends in the summer of 2020

> We moved all files from the root folder to `docs` and all from the `site` folder to the root folder!

## Additions
* Added a beautiful installer
  * Removed install.html
  * Added a hint in the admin area if the install folder still exists

![](https://i.imgur.com/SVr1Apj.png)
* ID selection on admin/pages/useredit.php now only allows range from lowest id to highest id
* Added return declarations to functions
* Added a backwards compatibility script
  * Backward compatibility functions: 
    * `string_starts_with();`
    * `string_ends_with();`
    * `string_contains();`
  * PHP8.0 <-> PHP 7.4
* Added new content system for plugins
* Added a new plugin system
  * New function: `$U->addPage(string $content, string $name, string $code, int $authorID, string $date, int $online):bool`
    * Allows to add a new content page
  * New function: `$U->addPage(string $content, string $name, string $code, int $authorID, string $date, int $online):bool`
    * Allows to add a new content page
  * Added a `plugin` folder
  * Added infos about installed plugins on the about page
  * You can now upload files with plugins
  * More Information: [Wiki](https://github.com/Case-Games/USOC/wiki/reference:Plugin-API)
* New function `$U->editSetting(string $name, string $value):bool`
* Added image folder
  * Added Case Games logo
  * Added load image
  * Added icofont folder
* Added Subfolders to the includes folder
  * In the `JS` folder are various JavaScript scripts
    * Added a Script that displays information in the JavaScript console
      * Gets implemented in a further version
  * In the `SettingsAssets` folder are the assets for the new settingseditor page in the Admin area
    * The files get splited up in a further version
  * Please note, that you can't include files, which aren't in th JS folder, with HTML, you must include them with PHP
* Added a settings overview page in admin area
  * You can change settings now better
  * The  old settings menu is now in an other order on the overview page
* Added icons to the Admin area main page 
* You can add now `/raw/` to the beginning of an URL to get the raw page. For example: `localhost/raw/index`

![Example image](https://i.ibb.co/p2bJJkw/Bild-2020-12-23-175448.png)
* New option: `2fa.enabled`
  * Sets if users can use 2fa or not
  * If you turn off users also don't get asked for the authenticator code
* `/login` folder has now as fallback resource `/login/login.php`
* Added vendor folder and the composer file works now
* Added `robots.txt`
* Added information about new versions in the about page
  * New function `$U->getNewestVersion():array`
    * Returns information about the newest version from GitHub
  * New function `$U->versionNameToCode(string $name):int`
    * Returns the version identifier code from version $name
* Added image plugin
  * Read [readme.md](https://github.com/Case-Games/USOC/blob/9ded7e0ef46846c844c730e2b4bd39fcb84b380a/plugins/images/readme.md) for install and use instractions

## Changes
> Code in the database is now saved encoded with `html_special_chairs()`. This doesn't get done by `$U->addPage()` or `$U->editPage()`. To repair your pages just open them in the editor and save them again
* Plugin System
  * Deleted `/admin/pages/blogeditor.php` and `/admin/sendsiteblog`
  * You must now choose the contetn type on the adminarea mainpage to delete a page
  * Plugin system in all editors implemented
* Renamed `register_open()` to `isRegisterOpen()`
* `isRegisterOpen()` checks now if user is logged in
* Renamed placeholder variable `$zeile` to `$row`
* Changed older PHP7.4 functions to PHP8.0 functions
* Renamed `$U->version_code` to `$U->versionCode`
* Content page names are now all stored lowercase
* Changed logo source from data URL to fix URL
* Changed behavior of register and login system
  * If setting "login.login_open" is 0
    * You can now login if you are an administrator in the admin area
    * You also can't register new users now
  * In the admin area you can now only login with an admin account
* New admin area login style

![Example image](https://i.ibb.co/tKKPP9v/Bild-2020-12-31-142930.png)
* The "Change password" button in the menu is now hidden if `login.changepassword` is off
* `$U->getLang()` returns now also the english string if the translated string is ""
* Removed ability on `admin/2fa.php` to delete or add secret keys
* Better styled install.html
* When you add an Google Account you get now redirected to the main page
* User editor
  * Added a user search function
  * You can't edit yourself now
  * Shows now an error if the user doesn't exists
* 2fa
  * Code input is now styled and in `login.php`
  * You can now cancel code input
  * You can not login with a other account if you haven't finished login yet
* Chenged order of items on `about.php`
* Better visible menu items in dark mode when hovered
## Fixed bugs
### **Fixed security bugs**
* You can access wrong files from admin area
### Other bugs
> Fixex the whole oAuth system

* Changepassword.php can be accessed even when not logged in
* Wrong string when registration is closed
* You can register a new account when you're logged in
* You can save a page even when it already existed
* Some functions were declared they give back mixed but they have a type.
* URL'S parsed by page.php could contain false URL's
* False setting search in register.php
* register.php can't be displayed
* Javascript info banner always on log off screen
* "Back" link doesn't work in `admin/pages/settingseditorsend.php`
* Mobile view doesn't look good on some browsers because it has forced scrollbars
* `oAuth.google.client_id` setting didn't have a type
* `oAuth.google.client_id` is doubled
* Headers in profile settings aren't in the right size
* Google oAuth client id wasn't variable in `login.php`
* `login.php` checks for the wrong oAuth google file
* The user editor didn't show translations just "%a" and "%b"
* Useless string replace in `login.php`
* String for wrong login is not translated
* Error messages have a wrong margin
* No real dark mode for error messages
* Buttons had no margin
* Adminarea about page has no title
* You can see older codes on the 2fa code input¨
* Working logout

# Pb2.3Bfx0
## Additions
* You can access the database connection from $U->db_link
* Added link in the admin area to the about page
* Added link to register.php in sitemap
* Added simple style for printing
* You can now delete pages in the adminarea
* New function `$U->deletePage(string $table, string $name):bool`
  * $table: The table the page is stored ("Blog" or "Sites")
  * $name: The name of the page
## Changes
* Removed install files
* Adjusted the CSS files to the new Code Conventions
## Fixed bugs
* Syntax error in logout.php*
* Fixed bug in getLang.inc.php that don't let you see the english translation if no other is available
* Removed .htaccess in admin/ckeditor because the editor couldn't load anymore
* Fixed too big logo in admin/pages/about.php
* Wrong link to login.php in sitemap.php
* Wrote licence instead of license
* Wrong translations in blogeditor
* No fallback on blogsites if no blog article is saved
# Pb2.2Bfx0
## Additions
* Restrict access to admin/ckeditor 
## Changes
* Changed install.md to intstall.html for better read experience
## Fixed bugs
* Google logout doesn't work
* Fixed typo in install.html
* The client id isn't flexible in profile.php (#53)
# Pb2.1Bfx0
## Additions
* Added more documentation in login folder
## Changes
* Edited some little things in login/login.php
* Edited some little things in login/register.php
* The version in admin/pages/about.php is now readed from the class
## Fixed bugs
* No translation in the title of the mainpage of the adminarea
* Fixed a little security bug in login/login.php
* Changed some misplaced session_start() #51
* No traslated back on admin/pages/about.php
* Fixed bugs in admin/login.php and admin/2fa.php
* Some include_once "konfiguration.php" existed
# Pb2.0Bfx1
## Fixed bugs
* Version named Pb2.0Bfx0 instead of Pb2.0Bfx0RCA
# Pb2.0Bfx0
## Additions
* Access blog pages through /blog/name
* Access pages through /name
* Added link to install.md
## Changes
* Added some missing, but optional ";"
* Don't show google login when it's deactivated
## Fixed bugs
* All bugs in #49
# Pb2.0Bfx0RCA
> This Version isn't backward compatible to older versions

> The install wizard doesn't work.

This is a release Candidate version. Issues will be tracked in #49

## Additions
* Added better class system
* Added HTTP-Errors 400, 405, 410, 414, 423
* Added experimental information to installer.
## Changes
* Better organisation of code
* Renamed profil.php in profile.php
* Added more documentation to code
* Moved blogsite, index and HTTP-Errors to page.php
* Added all translations
* Updated files to new code conventions
* Changed de.gravatar.com to gravatar.com
## Removed
* Removed is_there_usoc.json
* /errors/*
* blog.php
* blogsite.php
* option for a hash
## Fixed bugs
* #48
* And other
# Pb1.8Bfx0
* Fixed #43, #28 and other bugs.
# Pb1.7Bfx1
* Fixed #41
# Pb1.7Bfx0
* Fixed logout.php (Base: casegames.ch)
* Deleted .user.ini
* Deleted several casegames refereces
* Several issues fixed.
* Finished Installation Files
# Pb1.6Bfx0
* Fixed Typo in CHANGELOG.md
* Improved installation.
* Changed .htaccess
* Improved configuration.php
* Fixed issues with unvailable Settings #12 and #15
# Pb1.5Bfx0
* Added page.php as standard resource.
* Added several traslations
* Removed Case Games Content
# Pb1.4Bfx0
* Added composer.json
* Added Http 410 Error
* Changed .htaccess
# Pb1.3Bfx0
* Added style support
* Changed .htaccess But it doesn't work
* Added LICENSE.md
# Pb1.2Bfx0
* Added several Languages Issue #17
# Pb1.1Bfx0
* Add 2fa settings
* Removed dummy files
* Fixed lang function
* added CKEDITOR
# Pb1.0Bfx2
* Fixed CHANGELOG.md (missed in Pb1.0Bfx0 and Pb1.0Bfx1)
# Pb1.0Bfx1
* Fixed SECURITY.md (missed in Pb1.0Bfx0)
# Pb1.0Bfx0
* Fixed lang in index.php
# Pa1.0Bfx0
* First version
<!--
# Pb__.__Bfx__ 
## Additions
*
## Changes
*
## Fixed bugs
* _ (#)
-->
# Pb2.3Bfx0
## Additions
* You can access the database connection from $U->db_link
* Added link in the admin area to the about page
* Added link to register.php in sitemap
* Added simple style for printing
## Changes
* Removed install files
* Adjusted the CSS files to the new Code Conventions
## Fixed bugs
* Syntax error in logout.php*
* Fixed bug in getLang.inc.php that don't let you see the english translation if no other is available
* Removed .htaccess in admin/ckeditor because the editor couldn't load anymore
* Fixed too big logo in admin/pages/about.php
* Wrong link to login.php in sitemap.php
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

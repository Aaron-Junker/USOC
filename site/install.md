# How to install
1. Download USOC and change the unzip the site folder to your webserver. (Recommended: Root-folder)
2. edit configuration.php.example in (root) and in the admin folder.
3. Rename the two configuration.php.example to configuration.php
4. Create a database
5. execute the following code in your database (Please edit some things):
``` sql

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `blog` (
  `ID` int(11) NOT NULL,
  `Name` varchar(33) NOT NULL,
  `Date` date NOT NULL,
  `Author` int(11) NOT NULL,
  `Code` longtext NOT NULL,
  `Online` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO `blog` (`ID`, `Name`, `Date`, `Author`, `Code`, `Online`) VALUES
(1, 'First Blog', '0000-00-00', 0, '<p>Welcome to the Blog</p>', 1);



CREATE TABLE `settings` (
  `Id` int(20) NOT NULL,
  `Name` varchar(99) NOT NULL,
  `Value` varchar(99) NOT NULL,
  `Type` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `settings` (`Id`, `Name`, `Value`, `Type`) VALUES
(1, 'login.register_open', '1', 'Bool'),
(2, 'login.login_open', '1', 'Bool'), 
(3, 'test.int', '12', 'Int'),
(4, 'test.string', 'Hi ', 'Text'),
(5, 'login.changepassword', '1', 'Bool'),
(6, 'site.name', 'Insert Site name here', 'Text'),
(7, 'site.author', 'Insert author here', 'Text'),
(8, 'site.description', '', 'Text'),
(9, 'site.keywords', '', 'Text'),
(10, 'site.lang', 'en-en', 'Text'),
(11, 'site.robots', 'index, follow', 'Text'),
(12, '2fa.name', 'Insert site name here', 'Text'),
(14, 'style.light.filename', 'css.php', 'Text'),
(15, 'style.dark.filename', 'cssblack.php', 'Text'),
(16, 'oAuth.google.client_id', '', ''),
(17, 'oAuth.google.client_id', '', '');


CREATE TABLE `sites` (
  `ID` int(11) NOT NULL,
  `Name` varchar(33) NOT NULL,
  `Date` date NOT NULL,
  `Author` int(11) NOT NULL,
  `Code` longtext NOT NULL,
  `Online` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO `sites` (`ID`, `Name`, `Date`, `Author`, `Code`, `Online`) VALUES
(1, 'index', '0000-00-00', 0, '<h2>Welcome to USOC</h2><p>&nbsp;</p><p>Edit this Page on /admin</p>', 1);



CREATE TABLE `user` (
  `Id` int(11) NOT NULL,
  `Username` varchar(20) NOT NULL,
  `Mail` varchar(99) NOT NULL,
  `Password` varchar(70) NOT NULL,
  `Type` int(1) NOT NULL,
  `Change_password` tinyint(1) NOT NULL,
  `google_token` text NOT NULL,
  `google_2fa` mediumtext NOT NULL,
  `blocked` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO `user` (`Id`, `Username`, `Mail`, `Password`, `Type`, `Change_password`, `google_token`, `google_2fa`, `blocked`) VALUES
(2, 'Admin', 'webmaster@localhost', '$2y$10$lt9VgR4Zcp2hUolCrIFwLe3/vjuAYfvkn3enLEFYIAZ/6gVqz3ucK', 1, 0, '', '', 0);




ALTER TABLE `blog`
  ADD PRIMARY KEY (`ID`);


ALTER TABLE `settings`
  ADD PRIMARY KEY (`Id`);


ALTER TABLE `sites`
  ADD PRIMARY KEY (`ID`);


ALTER TABLE `user`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`);


ALTER TABLE `blog`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;


ALTER TABLE `settings`
  MODIFY `Id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;


ALTER TABLE `sites`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE `user`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

```
6. Delete the install Folder
7. Login with:
* Username: Admin
* password: USOC

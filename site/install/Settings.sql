
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `Settings` (
  `Id` int(20) NOT NULL,
  `Name` varchar(99) NOT NULL,
  `Value` varchar(99) NOT NULL,
  `Type` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Settings` (`Id`, `Name`, `Value`, `Type`) VALUES
(1, 'login.register_open', '0', 'Bool'),
(2, 'login.login_open', '1', 'Bool'),
(3, 'test.int', '12', 'Int'),
(4, 'test.string', 'Hi ', 'Text'),
(5, 'login.changepassword', '1', 'Bool'),
(6, 'site.name', '', 'Text'),
(7, 'site.author', '', 'Text'),
(8, 'site.description', '', 'Text'),
(9, 'site.keywords', '', 'Text'),
(10, 'site.lang', '', 'Text'),
(11, 'site.robots', 'index, follow', '');

ALTER TABLE `Settings`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `Settings`
  MODIFY `Id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

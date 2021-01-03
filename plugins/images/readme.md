# How to install
1. Run following SQL code:
```SQL
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `image` (
  `ID` int(11) NOT NULL,
  `Name` varchar(33) NOT NULL,
  `Date` date NOT NULL,
  `Author` int(11) NOT NULL,
  `Code` longtext NOT NULL,
  `Online` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `image`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `image`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;
```
2. Uncomment the line `include_once "images/index.php";`
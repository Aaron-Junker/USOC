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
  `Code` longblob NOT NULL,
  `Online` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `image`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `image`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;
```

2. Uncomment the line `include_once "images/index.php";` in the plugins.php file

# How to use
To import a image you need to write the following code in a page:

```
%img src=URL?width=width img%
```
You need to replace URL with the url of the image and width with the width of the image
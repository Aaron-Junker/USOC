CREATE TABLE `User` (
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

ALTER TABLE `User`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`);

ALTER TABLE `User`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

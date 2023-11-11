PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE session (
    id varchar(255),
    session json,
    createdAt datetime,
    updatedAt datetime
);
CREATE TABLE otp(
    id integer NOT NULL,
    otpCode integer,
    phoneNumber bigint,
    attempt integer,
    isUsed boolean,
    createdAt datetime,
    updatedAt datetime
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
ALTER TABLE `otp` ADD PRIMARY KEY (`id`);
ALTER TABLE `otp` MODIFY `id` integer NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

INSERT INTO `otp` (`id`,`otpCode`,`phoneNumber`,`attempt`,`isUsed`,`createdAt`,`updatedAt`) VALUES (
    1,1,1,5,1,'1970-01-01 01:01:01','1970-01-01 01:01:01');
COMMIT;

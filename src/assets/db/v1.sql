CREATE TABLE IF NOT EXISTS DbVersion (VersionNumber text, UpdateTime datetime);

CREATE TABLE IF NOT EXISTS AccountType (
	localId integer PRIMARY KEY AUTOINCREMENT,
	localUpdatedTime datetime,
	id integer,
	name varchar(100) NOT NULL,
	icon varchar(500),
	createdTime datetime,
	updatedTime datetime,
	isDeleted bit
);

CREATE TABLE IF NOT EXISTS Payee (
	localId integer PRIMARY KEY AUTOINCREMENT,
	localUpdatedTime datetime,
	id integer,
	name varchar(100) NOT NULL,
	createdTime datetime,
	updatedTime datetime,
	isDeleted bit
);

CREATE TABLE IF NOT EXISTS Tag (
	localId integer PRIMARY KEY AUTOINCREMENT,
	localUpdatedTime datetime,
	id integer,
	name varchar(100) NOT NULL,
	createdTime datetime,
	updatedTime datetime,
	isDeleted bit
);

CREATE TABLE IF NOT EXISTS Category (
	localId integer PRIMARY KEY AUTOINCREMENT,
	localUpdatedTime datetime,
	id integer,
	name varchar(100) NOT NULL,
	createdTime datetime,
	updatedTime datetime,
	isDeleted bit
);

CREATE TABLE IF NOT EXISTS SubCategory (
	localId integer PRIMARY KEY AUTOINCREMENT,
	localUpdatedTime datetime,
	id integer,
	name varchar(100) NOT NULL,
	localCategoryId integer,
	createdTime datetime,
	updatedTime datetime,
	isDeleted bit
);

CREATE TABLE IF NOT EXISTS Account (
	localId integer PRIMARY KEY AUTOINCREMENT,
	localUpdatedTime datetime,
	id integer,
	name varchar(100) NOT NULL,
	accountTypeLocalId integer,
	initialBalance double,
	minimumBalance double,
	creditLimit double,
	paymentDate datetime,
	interestRate double,
	includeInBalance bit,
	excludeFromDashboard bit,
	createdTime datetime,
	updatedTime datetime,
	notes varchar(500),
	balance double,
	isDeleted bit
);

CREATE TABLE IF NOT EXISTS SyncTime(
	tableName varchar(100),
	syncTime datetime
);

INSERT INTO	DbVersion(VersionNumber, UpdateTime)
SELECT 'v1',datetime('now') WHERE NOT EXISTS(SELECT VersionNumber FROM DbVersion);
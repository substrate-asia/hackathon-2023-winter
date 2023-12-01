CREATE TABLE wallet (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	address TEXT not null,
	uid INTEGER not null
);

CREATE UNIQUE INDEX wallet_uid_IDX ON wallet (uid);
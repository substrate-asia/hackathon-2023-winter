-- Add migration script here
CREATE TABLE twitter_user
(
    uid                 integer primary key not null,
    twitter_id                  integer not null,
    username            text collate nocase not null,
    profile_image_url   text,
    created_time        TIMESTAMP,
    updated_time        TIMESTAMP
);

CREATE UNIQUE INDEX twitter_user_uid_IDX ON twitter_user (uid,twitter_id);


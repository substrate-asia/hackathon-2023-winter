use std::{collections::BTreeSet, sync::Arc};

use poem::{web::{Data}, Error,Result, error::InternalServerError};
use poem_openapi::payload::Json;
use reqwest::StatusCode;

use crate::{state::{State, CacheGroup,GroupType, BroadcastEvent}, api::{Group, group::CreateGroupResponse, DateTime, Token}};

pub async fn create(
    state: Data<&State>,
    req: Group,
    uid: i64,
) -> Result<Json<CreateGroupResponse>> {
    let mut cache = state.cache.write().await;

    if req.members.len() > 0{
        return Err(Error::from_status(StatusCode::BAD_REQUEST));
    } 

    if req.is_public {
        // only admin can create public groups
        return Err(Error::from_status(StatusCode::FORBIDDEN));
    }

    if req.is_public && !req.members.is_empty() {
        // public groups are not allowed to specify any members.
        return Err(Error::from_status(StatusCode::BAD_REQUEST));
    }

    let members = if !req.is_public {
        req.members
            .iter()
            .copied()
            .chain(std::iter::once(uid))
            .collect::<BTreeSet<i64>>()
    } else {
        Default::default()
    };

    // for uid in &members {
    //     if !cache.users.contains_key(uid) {
    //         // invalid uid
    //         return Err(Error::from_status(StatusCode::BAD_REQUEST));
    //     }
    // }

    // insert to sqlite
    let mut tx = state.db_pool.begin().await.map_err(InternalServerError)?;
    let now = DateTime::now();
    let owner = if req.is_public { None } else { Some(uid) };
    let sql = "insert into `group` (name, description, owner, is_public, created_at, updated_at) values (?, ?, ?, ?, ?, ?)";
    let gid = sqlx::query(sql)
        .bind(&req.name)
        .bind(req.description.as_deref().unwrap_or_default())
        .bind(owner)
        .bind(req.is_public)
        .bind(now)
        .bind(now)
        .execute(&mut tx)
        .await
        .map_err(InternalServerError)?
        .last_insert_rowid();

    for id in &members {
        sqlx::query("insert into group_user (gid, uid) values (?, ?)")
            .bind(gid)
            .bind(*id)
            .execute(&mut tx)
            .await
            .map_err(InternalServerError)?;
    }

    tx.commit().await.map_err(InternalServerError)?;

    // update cache
    cache.groups.insert(
        gid,
        CacheGroup {
            ty: if req.is_public {
                GroupType::Public
            } else {
                GroupType::Private { owner: uid }
            },
            name: req.name.clone(),
            description: req.description.clone().unwrap_or_default(),
            members: members.clone(),
            created_at: now,
            updated_at: now,
            avatar_updated_at: DateTime::zero(),
            pinned_messages: Vec::new(),
        },
    );

    let group = Group {
        gid,
        owner: if req.is_public { None } else { Some(uid) },
        name: req.name,
        description: req.description,
        members: members.clone().into_iter().collect(),
        is_public: req.is_public,
        avatar_updated_at: req.avatar_updated_at,
        pinned_messages: Vec::new(),
    };

    // broadcast event
    let _ = state
        .event_sender
        .send(Arc::new(BroadcastEvent::JoinedGroup {
            targets: {
                if !req.is_public {
                    members
                } else {
                    cache.users.keys().copied().collect()
                }
            },
            group,
        }));

    Ok(Json(CreateGroupResponse {
        gid,
        created_at: now,
    }))
}
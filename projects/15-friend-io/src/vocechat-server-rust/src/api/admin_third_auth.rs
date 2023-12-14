use poem::{http::StatusCode, web::Data, Error, Result};
use poem_openapi::{payload::Json, Object, OpenApi};
use serde::{Deserialize, Serialize};

use crate::{
    api::{tags::ApiTags, token::Token},
    config::Config,
    state::{DynamicConfig, DynamicConfigEntry},
    State,
};


/// Github authentication config
#[derive(Debug, Object, Serialize, Deserialize, Default)]
pub struct TwitterAuthConfig {
    pub client_id: String,
    pub client_secret: String,
}

impl DynamicConfig for TwitterAuthConfig {
    type Instance = TwitterAuthConfig;

    fn name() -> &'static str {
        "twitter-auth"
    }

    fn create_instance(self, _config: &Config) -> Self::Instance {
        TwitterAuthConfig {
            client_id: String::new(),
            client_secret: String::new(),
        }
    }
}

/// Google authentication config
#[derive(Debug, Object, Serialize, Deserialize, Default)]
pub struct GoogleAuthConfig {
    pub client_id: String,
}

impl DynamicConfig for GoogleAuthConfig {
    type Instance = GoogleAuthConfig;

    fn name() -> &'static str {
        "google-auth"
    }

    fn create_instance(self, _config: &Config) -> Self::Instance {
        GoogleAuthConfig {
            client_id: String::new(),
        }
    }
}



pub struct ApiAdminAuth;

/// Github authentication config
#[derive(Debug, Object, Serialize, Deserialize, Default)]
pub struct GithubAuthConfig {
    pub client_id: String,
    pub client_secret: String,
}

impl DynamicConfig for GithubAuthConfig {
    type Instance = GithubAuthConfig;

    fn name() -> &'static str {
        "github-auth"
    }

    fn create_instance(self, _config: &Config) -> Self::Instance {
        GithubAuthConfig {
            client_id: String::new(),
            client_secret: String::new(),
        }
    }
}

#[OpenApi(prefix_path = "/admin", tag = "ApiTags::AdminThridAuth")]
impl ApiAdminAuth {
    /// Set Github auth config
    #[oai(path = "/github_auth/config", method = "post")]
    async fn set_github_config(
        &self,
        state: Data<&State>,
        token: Token,
        config: Json<GithubAuthConfig>,
    ) -> Result<()> {
        if !token.is_admin {
            return Err(Error::from_status(StatusCode::FORBIDDEN));
        }
        state
            .set_dynamic_config(DynamicConfigEntry {
                enabled: true,
                config: config.0,
            })
            .await?;
        Ok(())
    }

    /// Get Github auth config
    #[oai(path = "/github_auth/config", method = "get")]
    async fn get_github_config(&self, state: Data<&State>) -> Result<Json<GithubAuthConfig>> {
        let entry = state.load_dynamic_config::<GithubAuthConfig>().await?;
        Ok(Json(entry.config))
    }

    /// Set Github auth config
    #[oai(path = "/twitter_auth/config", method = "post")]
    async fn set_twitter_config(
        &self,
        state: Data<&State>,
        token: Token,
        config: Json<TwitterAuthConfig>,
    ) -> Result<()> {
        if !token.is_admin {
            return Err(Error::from_status(StatusCode::FORBIDDEN));
        }
        state
            .set_dynamic_config::<TwitterAuthConfig>(DynamicConfigEntry {
                enabled: true,
                config: config.0,
            })
            .await?;
        Ok(())
    }

    /// Get Github auth config
    #[oai(path = "/twitter_auth/config", method = "get")]
    async fn get_twitter_config(&self, state: Data<&State>) -> Result<Json<TwitterAuthConfig>> {
        let entry = state.load_dynamic_config::<TwitterAuthConfig>().await?;
        Ok(Json(entry.config))
    }

    /// Set Google auth config
    #[oai(path = "/google_auth/config", method = "post")]
    async fn set_config(
        &self,
        state: Data<&State>,
        token: Token,
        config: Json<GoogleAuthConfig>,
    ) -> Result<()> {
        if !token.is_admin {
            return Err(Error::from_status(StatusCode::FORBIDDEN));
        }
        state
            .set_dynamic_config(DynamicConfigEntry {
                enabled: true,
                config: config.0,
            })
            .await?;
        Ok(())
    }

    /// Get Google auth config
    #[oai(path = "/google_auth/config", method = "get")]
    async fn get_config(&self, state: Data<&State>) -> Result<Json<GoogleAuthConfig>> {
        let entry = state.load_dynamic_config::<GoogleAuthConfig>().await?;
        Ok(Json(entry.config))
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use crate::test_harness::TestServer;

    #[tokio::test]
    async fn set_get_github_oauth() {
        let server = TestServer::new().await;
        let admin_token = server.login_admin().await;

        let resp = server
            .post("/api/admin/github_auth/config")
            .header("X-API-Key", &admin_token)
            .body_json(&json!({
                "client_id": "test",
                "client_secret": "test",
            }))
            .send()
            .await;
        resp.assert_status_is_ok();

        let resp = server
            .get("/api/admin/github_auth/config")
            .header("X-API-Key", &admin_token)
            .send()
            .await;
        resp.assert_status_is_ok();

        // let body = resp.0.take_body().into_string().await.unwrap();
        // dbg!(body);

        let json = resp.json().await;
        json.value().object().get("client_id").assert_string("test");
    }



    #[tokio::test]
    async fn set_get_twitter_oauth() {
        use serde_json::json;
        use tracing::info;

        use crate::test_harness::TestServer;
        let server = TestServer::new().await;
        let admin_token = server.login_admin().await;

        let resp = server
            .post("/api/admin/twitter_auth/config")
            .header("X-API-Key", &admin_token)
            .body_json(&json!({
                "client_id": "twiterclient",
                "client_secret": "twitersecret",
            }))
            .send()
            .await;
        resp.assert_status_is_ok();

        let resp = server
            .get("/api/admin/twitter_auth/config")
            .header("X-API-Key", &admin_token)
            .send()
            .await;
        resp.assert_status_is_ok();

        // let body = resp.0.take_body().into_string().await.unwrap();
        // dbg!(body);

        let json = resp.json().await;
        let client_id = json.value().object().get("client_id");
        info!("client_id is:{:?}",client_id);
        json.value().object().get("client_id").assert_string("twiterclient");
        json.value().object().get("client_secret").assert_string("twitersecret");
    }
}

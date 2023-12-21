use reqwest::Client;

pub fn get_client(proxy: Option<&str>) -> anyhow::Result<Client> {
    let client = match proxy {
        Some(proxy_url) => reqwest::Client::builder()
            .proxy(reqwest::Proxy::all(proxy_url)?)
            .build()?,
        None => reqwest::Client::builder().build()?,
    };
    return Ok(client);
}

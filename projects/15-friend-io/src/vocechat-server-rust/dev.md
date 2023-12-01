魏小平:
Bear Token
AAAAAAAAAAAAAAAAAAAAAA%2FHpgEAAAAAuqB6uSSHqLeSKluHdwztZO0sSW4%3DBpfqx6IicSzpidfhUVUuYD0Ak7VZhAIDuZ79Xvcdf6s5ZmgbA3


access token :1394211886833430529-xHjStyyWIUyrT2JdeeiHEs3A50pIx7


Access Token Secret:
reliI8hvERW0BgLSbuLzw48t2yZ0r3vzLTyY2k3dVNOiV


API Key:
goiYCV4LaPx4D7dL4sNhiMJzk
API Key Secret:
c29stKDw8MTiV4y0RC7RhyyY2A1H7GeEZChxgkI3BO2Rfr43Yq

TWITTER_OAUTH2_CLIENT_ID:kfmeWr3MAv92ZNbamZ2PeiruO
TWITTER_OAUTH2_CLIENT_SECRET:Gkxhkhm3pcpEkbTQ0PIupFXXmf2LqTxidCv1CyR2Xn7XYUZQyR
TWITTER_OAUTH2_ACCESS_TOKEN:1394211886833430529-UNXNq7mbOUFDTlPYzT58NDj8lVoE6b
TWITTER_OAUTH2_REFRESH_TOKEN:

Client ID:
VDJXUzBESDhhUDlyWjBDa0FtckE6MTpjaQ
Client Secret:
90cmt12HTENsJPlEuZbKBAO6YVnM96CGKwV_dEcl4-Lyi_O2gM

https://twitter.com/i/oauth2/authorize?response_type=code&client_id=VDJXUzBESDhhUDlyWjBDa0FtckE6MTpjaQ&redirect_uri=${location.origin}/twitter/cb/webapp.html&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain

http://127.0.0.1/twitter/cb/webapp.html?state=state&code=SEh4Y3RhRHNJcC1DbW5QRURydjg1ejNza1lrR1NCMGNHVG5TVWVEUHBuSkFkOjE2OTM2Njk1ODEzNzE6MToxOmFjOjE


      
curl --location --request POST 'https://api.twitter.com/2/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'code=VGNibzFWSWREZm01bjN1N3dicWlNUG1oa2xRRVNNdmVHelJGY2hPWGxNd2dxOjE2MjIxNjA4MjU4MjU6MToxOmFjOjE' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'client_id=rG9n6402A3dbUJKzXTNX4oWHJ' \
--data-urlencode 'redirect_uri=https://www.example.com' \
--data-urlencode 'code_verifier=challenge'

    

INSERT INTO config (name,enabled,value) VALUES
	 ('twitter-auth',1,'{"client_id":"VDJXUzBESDhhUDlyWjBDa0FtckE6MTpjaQ","client_secret":"90cmt12HTENsJPlEuZbKBAO6YVnM96CGKwV_dEcl4-Lyi_O2gM"}');


twitterAccount
asd1170941265@163.com
LoveThrowException
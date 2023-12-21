package v1

import "github.com/gogf/gf/v2/frame/g"

type UserLoginReq struct {
	g.Meta  `path:"/user/login" method:"post" tags:"UserService" summary:"Login with exist account"`
	Address string `v:"required" json:"address"`
}
type UserLoginRes struct {
	Address  string  `json:"address,omitempty"`
	Uid      string  `json:"uid,omitempty"`
	UserName string  `json:"username,omitempty"`
	Score    float64 `json:"score,omitempty"`
	Desc     string  `json:"desc,omitempty"`
	Avatar   string  `json:"avatar,omitempty"`
}

type UserChangeProfileReq struct {
	g.Meta   `path:"/user/changeProfile" method:"post" tags:"UserService" summary:"Login with exist account"`
	Uid      string `json:"uid,omitempty"`
	UserName string `json:"username,omitempty"`
	Desc     string `json:"desc,omitempty"`
	Avatar   string `json:"avatar,omitempty"`
}
type UserChangeProfileRes struct {
}

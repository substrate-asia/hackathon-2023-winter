package v1

import (
	"github.com/gogf/gf-demo-user/v2/internal/model/entity"
	"github.com/gogf/gf/v2/frame/g"
)

type CreatePromptReq struct {
	g.Meta     `path:"/prompt/make" method:"post" tags:"PromptService" summary:"Create Prompt"`
	Uid        string   `json:"uid" v:"required"`
	PromptName string   `json:"prompt_name" v:"required"`
	PromptId   string   `json:"prompt_id"`
	Price      float64  `json:"price" v:"required"`
	Desc       string   `json:"desc" v:"required"`
	Type       int64    `json:"type" v:"required"`
	Params     []string `json:"params"`
	Tags       []string `json:"tags"`
	Content    string   `json:"content" v:"required"`
	Avatar     string   `json:"avatar"`
	Examples   []struct {
		Input  string `json:"input"`
		Output string `json:"output"`
	} `form:"examples" json:"examples"`
}

type CreatePromptRes struct {
	Pid string `json:"pid,omitempty"`
}

type GetPromptReq struct {
	g.Meta `path:"/prompt/getContent" method:"post" tags:"PromptService" summary:"Get Prompt with uid"`
	Uid    string `json:"uid" v:"required"`
	Pid    string `json:"pid" v:"required"`
}

type GetPromptRes struct {
	PromptInfo
}

type GetPromptDetailReq struct {
	g.Meta `path:"/prompt/getDetail" method:"post" tags:"PromptService" summary:"Get Prompt without uid"`
	Pid    string `json:"pid" v:"required"`
	Uid    string `json:"uid"`
}

type GetPromptDetailRes struct {
	PromptInfo
	AuthLevel int `json:"auth_level"`
}

type EditPromptReq struct {
	g.Meta     `path:"/prompt/change" method:"post" tags:"PromptService" summary:"Edit Prompt"`
	Uid        string   `json:"uid" v:"required"`
	Pid        string   `json:"pid" v:"required"`
	PromptName string   `json:"prompt_name,omitempty"`
	Price      float64  `json:"price,omitempty"`
	Desc       string   `json:"desc,omitempty"`
	Type       int64    `json:"type,omitempty"`
	Params     []string `json:"params,omitempty"`
	Tags       []string `json:"tags,omitempty"`
	Content    string   `json:"content,omitempty"`
	Avatar     string   `json:"avatar,omitempty"`
	Examples   []struct {
		Input  string `json:"input"`
		Output string `json:"output"`
	} `form:"examples" json:"examples,omitempty"`
}

type EditPromptRes struct {
}

type LikePromptReq struct {
	g.Meta `path:"/prompt/like" method:"post" tags:"PromptService" summary:"Like Prompt"`
	Uid    string `json:"uid" v:"required"`
	Pid    string `json:"pid" v:"required"`
	Like   int    `json:"like" v:"required"`
}

type LikePromptRes struct {
}

type GetPromptByTypeReq struct {
	g.Meta `path:"/prompt/getByType" method:"post" tags:"PromptService" summary:"Get Prompt By Type"`
	Type   int `json:"type" v:"required"`
	Offset int `json:"offset" v:"required"`
	Limit  int `json:"limit" v:"required"`
}

type PromptInfos []*PromptInfo
type GetPromptByTypeRes struct {
	PromptInfos
	Total int `json:"total"`
}
type PromptInfo struct {
	*entity.Prompt
	Likes    int `json:"likes"`
	Dislikes int `json:"dislikes"`
	Attitude int `json:"attitude"`
}

type GetPromptByKeyReq struct {
	g.Meta `path:"/prompt/getByKey" method:"post" tags:"PromptService" summary:"Get Prompt By key"`
	Key    string `json:"key"`
	Offset int    `json:"offset" v:"required"`
	Limit  int    `json:"limit" v:"required"`
}

type GetPromptByKeyRes struct {
	PromptInfos
	Total int `json:"total"`
}

type GetPromptBoughtReq struct {
	g.Meta `path:"/prompt/getBought" method:"post" tags:"PromptService" summary:"Get Prompt Bought"`
	Uid    string `json:"uid" v:"required"`
	Offset int    `json:"offset" v:"required"`
	Limit  int    `json:"limit" v:"required"`
}

type GetPromptBoughtRes struct {
	PromptInfos
	Total int `json:"total"`
}

type BuyPromptReq struct {
	g.Meta `path:"/prompt/purchase" method:"post" tags:"PromptService" summary:"Buy Prompt"`
	Uid    string `json:"uid" v:"required"`
	Pid    string `json:"pid" v:"required"`
}

type BuyPromptRes struct {
}

type GetMyPromptReq struct {
	g.Meta `path:"/prompt/getMyPrompt" method:"post" tags:"PromptService" summary:"Get Prompt Bought"`
	Uid    string `json:"uid" v:"required"`
	Offset int    `json:"offset" v:"required"`
	Limit  int    `json:"limit" v:"required"`
}

type GetMyPromptRes struct {
	PromptInfos
	Total int `json:"total"`
}

type BuyNFTReq struct {
	g.Meta  `path:"/prompt/buyNFT" method:"post" tags:"PromptService" summary:"By NFT"`
	Address string `json:"address" v:"required"`
	Pid     string `json:"pid" v:"required"`
}

type BuyNFTRes struct {
}

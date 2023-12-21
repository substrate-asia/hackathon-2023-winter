package v1

import "github.com/gogf/gf/v2/frame/g"

type AskReq struct {
	g.Meta `path:"/chatgpt/ask" method:"post" tags:"ChatgptAskService" summary:"AskReq"`
	Uid    int64
	Data   []*AskData `json:"data"`
}

type AskRes struct {
	//BaseRes
	Data string `json:"data"`
}

type AskData struct {
	DataType AskDataType `json:"type"`
	Pid      string      `json:"pid"`
	Params   []string    `json:"params"`
	Content  string      `json:"content"`
}

type AskDataType int32

const (
	Answer     AskDataType = 1
	PromptAsk  AskDataType = 2
	ContentAsk AskDataType = 3
)

type GetPromptParamsReq struct {
	g.Meta `path:"/chatgpt/getPromptParams" method:"post" tags:"GetPromptParamsService" summary:"GetPromptParamsReq"`
	Uid    string `json:"uid" v:"required"`
	Pid    string `json:"pid" v:"required"`
}

type GetPromptParamsRes struct {
	BaseRes
	Data *GetPromptParamsData `json:"data"`
}

type GetPromptParamsData struct {
	Params []string `json:"params"`
}

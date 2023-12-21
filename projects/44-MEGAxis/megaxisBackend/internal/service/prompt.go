package service

import (
	"context"

	v1 "github.com/gogf/gf-demo-user/v2/api/v1"
)

type IPrompt interface {
	CreatePrompt(ctx context.Context, in *v1.CreatePromptReq) (*v1.CreatePromptRes, error)
	GetPrompt(ctx context.Context, in *v1.GetPromptReq) (*v1.GetPromptRes, error)
	GetPromptDetail(ctx context.Context, in *v1.GetPromptDetailReq) (*v1.GetPromptDetailRes, error)
	EditPrompt(ctx context.Context, in *v1.EditPromptReq) error
	LikePrompt(ctx context.Context, in *v1.LikePromptReq) error
	GetPromptByType(ctx context.Context, in *v1.GetPromptByTypeReq) (*v1.GetPromptByTypeRes, error)
	GetPromptById(ctx context.Context, in *v1.GetPromptParamsReq) (*v1.GetPromptParamsRes, error)
	GetPromptByKey(ctx context.Context, in *v1.GetPromptByKeyReq) (*v1.GetPromptByKeyRes, error)
	GetPromptBought(ctx context.Context, in *v1.GetPromptBoughtReq) (*v1.GetPromptBoughtRes, error)
	BuyPrompt(ctx context.Context, in *v1.BuyPromptReq) error
	GetMyPrompt(ctx context.Context, in *v1.GetMyPromptReq) (*v1.GetMyPromptRes, error)
	BuyNFT(ctx context.Context, in *v1.BuyNFTReq) error
}

var localPrompt IPrompt

// TODO file is manually maintained

func Prompt() IPrompt {
	if localPrompt == nil {
		panic("implement not found for interface IPrompt, forgot register?")
	}
	return localPrompt
}

func RegisterPrompt(i IPrompt) {
	localPrompt = i
}

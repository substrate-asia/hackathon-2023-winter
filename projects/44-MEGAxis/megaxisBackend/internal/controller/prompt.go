package controller

import (
	"context"
	v1 "github.com/gogf/gf-demo-user/v2/api/v1"
	"github.com/gogf/gf-demo-user/v2/internal/service"
)

var Prompt = cPrompt{}

type cPrompt struct{}

func (c *cPrompt) MakePrompt(ctx context.Context, req *v1.CreatePromptReq) (res *v1.CreatePromptRes, err error) {
	res, err = service.Prompt().CreatePrompt(ctx, req)
	return
}

func (c *cPrompt) GetPrompt(ctx context.Context, req *v1.GetPromptReq) (res *v1.GetPromptRes, err error) {
	res, err = service.Prompt().GetPrompt(ctx, req)
	return
}

func (c *cPrompt) GetPromptDetail(ctx context.Context, req *v1.GetPromptDetailReq) (res *v1.GetPromptDetailRes, err error) {
	res, err = service.Prompt().GetPromptDetail(ctx, req)
	return
}

func (c *cPrompt) EditPrompt(ctx context.Context, req *v1.EditPromptReq) (res *v1.EditPromptRes, err error) {
	err = service.Prompt().EditPrompt(ctx, req)
	return
}

func (c *cPrompt) LikePrompt(ctx context.Context, req *v1.LikePromptReq) (res *v1.LikePromptRes, err error) {
	err = service.Prompt().LikePrompt(ctx, req)
	return
}

func (c *cPrompt) GetPromptByType(ctx context.Context, req *v1.GetPromptByTypeReq) (res *v1.GetPromptByTypeRes, err error) {
	res, err = service.Prompt().GetPromptByType(ctx, req)
	return
}

func (c *cPrompt) GetPromptByKey(ctx context.Context, req *v1.GetPromptByKeyReq) (res *v1.GetPromptByKeyRes, err error) {
	res, err = service.Prompt().GetPromptByKey(ctx, req)
	return
}

func (c *cPrompt) GetPromptBought(ctx context.Context, req *v1.GetPromptBoughtReq) (res *v1.GetPromptBoughtRes, err error) {
	res, err = service.Prompt().GetPromptBought(ctx, req)
	return
}

func (c *cPrompt) BuyPrompt(ctx context.Context, req *v1.BuyPromptReq) (res *v1.BuyPromptRes, err error) {
	err = service.Prompt().BuyPrompt(ctx, req)
	return
}

func (c *cPrompt) GetMyPrompt(ctx context.Context, req *v1.GetMyPromptReq) (res *v1.GetMyPromptRes, err error) {
	res, err = service.Prompt().GetMyPrompt(ctx, req)
	return
}

func (c *cPrompt) BuyNFT(ctx context.Context, req *v1.BuyNFTReq) (res *v1.BuyNFTRes, err error) {
	err = service.Prompt().BuyNFT(ctx, req)
	return
}

package controller

import (
	"context"
	v1 "github.com/gogf/gf-demo-user/v2/api/v1"
	"github.com/gogf/gf-demo-user/v2/internal/service"
)

var User = cUser{}

type cUser struct{}

// SignIn is the API for user sign in.
func (c *cUser) SignIn(ctx context.Context, req *v1.UserLoginReq) (res *v1.UserLoginRes, err error) {
	res, err = service.User().Login(ctx, req)
	return
}

func (c *cUser) ChangeProfile(ctx context.Context, req *v1.UserChangeProfileReq) (res *v1.UserChangeProfileRes, err error) {
	err = service.User().ChangeProfile(ctx, req)
	return
}

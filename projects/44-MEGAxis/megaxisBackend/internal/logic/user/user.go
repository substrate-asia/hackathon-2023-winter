package user

import (
	"context"
	v1 "github.com/gogf/gf-demo-user/v2/api/v1"
	"github.com/gogf/gf-demo-user/v2/internal/dao"
	"github.com/gogf/gf-demo-user/v2/internal/model/do"
	"github.com/gogf/gf-demo-user/v2/internal/model/entity"
	"github.com/gogf/gf-demo-user/v2/internal/service"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/google/uuid"
	"strings"
)

type (
	sUser struct{}
)

func (s *sUser) ChangeProfile(ctx context.Context, in *v1.UserChangeProfileReq) (err error) {
	var user *entity.User
	err = dao.User.Ctx(ctx).Where(do.User{
		Uid: in.Uid,
	}).Scan(&user)
	if err != nil {
		return err
	}
	if user == nil {
		return gerror.New(`User not exist`)
	}
	_, err = dao.User.Ctx(ctx).Where("uid", in.Uid).Data(g.Map{
		"username": in.UserName,
		"avatar":   in.Avatar,
		"desc":     in.Desc,
	}).Update()
	if err != nil {
		return err
	}
	return
}

func (s *sUser) Login(ctx context.Context, in *v1.UserLoginReq) (*v1.UserLoginRes, error) {
	user := &entity.User{}
	count, err := dao.User.Ctx(ctx).Where("address", in.Address).Count()
	if err != nil {
		return nil, err
	}
	if count == 0 {
		//生成用户信息
		uid := strings.Replace(uuid.NewString(), "-", "", -1)
		username := uid[:6]
		data := g.Map{
			"uid":      uid,
			"username": username,
			"score":    0,
			"address":  in.Address,
			"avatar":   "",
			"desc":     "",
		}
		if _, err = dao.User.Ctx(ctx).Data(data).Insert(); err != nil {
			return nil, err
		} else {
			return &v1.UserLoginRes{
				Uid:      uid,
				UserName: username,
				Score:    0,
				Address:  in.Address,
				Avatar:   "",
				Desc:     "",
			}, nil
		}
	} else {
		//查询用户信息
		dao.User.Ctx(ctx).Where("address", in.Address).Scan(user)
		return &v1.UserLoginRes{
			Address:  user.Address,
			Uid:      user.Uid,
			UserName: user.Username,
			Score:    user.Score,
			Desc:     user.Desc,
			Avatar:   user.Avatar,
		}, nil
	}

}

func (s *sUser) IsSignedIn(ctx context.Context) bool {
	if v := service.BizCtx().Get(ctx); v != nil && v.User != nil {
		return true
	}
	return false
}

func init() {
	service.RegisterUser(New())
}

func New() service.IUser {
	return &sUser{}
}

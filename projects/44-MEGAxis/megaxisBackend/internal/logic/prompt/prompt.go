package prompt

import (
	"context"
	"encoding/json"
	v1 "github.com/gogf/gf-demo-user/v2/api/v1"
	"github.com/gogf/gf-demo-user/v2/internal/dao"
	"github.com/gogf/gf-demo-user/v2/internal/model/entity"
	"github.com/gogf/gf-demo-user/v2/internal/service"
	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/google/uuid"
	"log"
	"reflect"
	"regexp"
	"strings"
)

type (
	SPrompt struct{}
)

func (s *SPrompt) BuyNFT(ctx context.Context, in *v1.BuyNFTReq) error {
	var user *entity.User
	err := dao.User.Ctx(ctx).Where("address", in.Address).Scan(&user)
	if err != nil {
		return nil
	}
	if user == nil {
		return gerror.New("买家不存在")
	}
	var prompt *entity.Prompt
	if err = dao.Prompt.Ctx(ctx).Where("pid", in.Pid).Scan(&prompt); err != nil {
		return err
	}
	if prompt == nil {
		return gerror.New("prompt不存在")
	}
	if user.Uid == prompt.Author {
		return gerror.New("不能购买自己已有的prompt")
	}
	data := g.Map{
		"uid": prompt.Author,
		"pid": in.Pid,
	}
	//todo 事务
	_, err = dao.Buy.Ctx(ctx).Data(data).Insert()
	if err != nil {
		return err
	}
	_, err = dao.Prompt.Ctx(ctx).Where("pid", in.Pid).Data(g.Map{
		"author": user.Uid,
	}).Update()
	if err != nil {
		return err
	}
	return nil
}

func (s *SPrompt) GetPromptDetail(ctx context.Context, in *v1.GetPromptDetailReq) (*v1.GetPromptDetailRes, error) {
	all, err := dao.Prompt.Ctx(ctx).LeftJoin("`promptlike`", "prompt.pid = promptlike.pid").Fields("prompt.*,"+
		" COUNT(CASE WHEN promptlike.like = 1 THEN promptlike.id END) likes, COUNT(CASE WHEN promptlike.like = -1 THEN promptlike.id END) dislikes").
		Where("prompt.pid ", in.Pid).Group("prompt.pid").All()
	if err != nil {
		return nil, err
	}
	authLevel := s.GetAuthLevel(ctx, in.Uid, in.Pid)
	res := s.GetResult(ctx, all, authLevel)
	if len(res) < 1 {
		return nil, gerror.New("该prompt不存在")
	} else {
		return &v1.GetPromptDetailRes{PromptInfo: *(res[0]), AuthLevel: authLevel}, nil
	}
}

func (s *SPrompt) GetAuthLevel(ctx context.Context, uid, pid string) int {
	if uid == "" {
		return 3
	} else {
		isAuthor, _ := dao.Prompt.Ctx(ctx).Where("pid", pid).Where("author", uid).Count()
		if isAuthor == 1 {
			return 1
		}
		bought, _ := dao.Buy.Ctx(ctx).Where("pid", pid).Where("uid", uid).Count()
		if bought == 1 {
			return 2
		}
		return 3
	}
}

func (s *SPrompt) GetMyPrompt(ctx context.Context, in *v1.GetMyPromptReq) (*v1.GetMyPromptRes, error) {
	res := ([]*v1.PromptInfo)(nil)
	all, err := dao.Prompt.Ctx(ctx).LeftJoin("`promptlike`", "prompt.pid = promptlike.pid").Fields("prompt.*,"+
		" COUNT(CASE WHEN promptlike.like = 1 THEN promptlike.id END) likes, COUNT(CASE WHEN promptlike.like = -1 THEN promptlike.id END) dislikes, promptlike.like attitude").
		Where("prompt.author ", in.Uid).Group("prompt.pid").Order("likes desc").Limit(in.Offset, in.Limit).All()
	if err != nil {
		return nil, err
	}
	res = s.GetResult(ctx, all, 1)
	total, _ := dao.Prompt.Ctx(ctx).Where("author", in.Uid).Count()
	return &v1.GetMyPromptRes{PromptInfos: res, Total: total}, nil
}

func (s *SPrompt) BuyPrompt(ctx context.Context, in *v1.BuyPromptReq) error {

	var prompt *entity.Prompt
	err := dao.Prompt.Ctx(ctx).Where("pid", in.Pid).Scan(&prompt)
	if err != nil {
		return err
	}
	if prompt == nil {
		return gerror.New("prompt不存在")
	}
	var user *entity.User
	err = dao.User.Ctx(ctx).Where("uid", in.Uid).Scan(&user)
	if err != nil {
		return err
	}
	if user == nil {
		return gerror.New("user不存在")
	}
	if user.Uid == prompt.Author {
		return gerror.New("当前prompt作者无需购买")
	}
	if user.Score < prompt.Price {
		return gerror.New("用户积分不足，无法购买")
	}
	err = g.DB().Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
		_, err = tx.Ctx(ctx).Update("user", g.Map{
			"score": user.Score - prompt.Price,
		}, "uid", user.Uid)
		if err != nil {
			return err
		}
		_, err = tx.Ctx(ctx).Insert("buy", g.Map{
			"uid":         user.Uid,
			"pid":         prompt.Pid,
			"create_time": gtime.Now(),
		})
		if err != nil {
			return err
		}
		return nil
	})
	return err
}

func (s *SPrompt) GetPromptBought(ctx context.Context, in *v1.GetPromptBoughtReq) (*v1.GetPromptBoughtRes, error) {
	res := ([]*v1.PromptInfo)(nil)
	var buy []*entity.Buy
	pids := []string{}
	err := dao.Buy.Ctx(ctx).Where("uid", in.Uid).Scan(&buy)
	if err != nil {
		return nil, err
	}
	for _, b := range buy {
		pids = append(pids, b.Pid)
	}
	all, err := dao.Prompt.Ctx(ctx).LeftJoin("`promptlike`", "prompt.pid = promptlike.pid").Fields("prompt.*,"+
		" COUNT(CASE WHEN promptlike.like = 1 THEN promptlike.id END) likes, COUNT(CASE WHEN promptlike.like = -1 THEN promptlike.id END) dislikes, promptlike.like attitude").
		WhereIn("prompt.pid", pids).Group("prompt.pid").Order("likes desc").Limit(in.Offset, in.Limit).All()
	if err != nil {
		return nil, err
	}
	res = s.GetResult(ctx, all, 2)
	return &v1.GetPromptBoughtRes{PromptInfos: res, Total: len(buy)}, nil
}

func (s *SPrompt) GetPromptByKey(ctx context.Context, in *v1.GetPromptByKeyReq) (*v1.GetPromptByKeyRes, error) {
	//todo 实现功能，待优化查询速度
	res := ([]*v1.PromptInfo)(nil)
	all, err := dao.Prompt.Ctx(ctx).LeftJoin("`promptlike`", "prompt.pid = promptlike.pid").Fields("prompt.*,"+
		" COUNT(CASE WHEN promptlike.like = 1 THEN promptlike.id END) likes, COUNT(CASE WHEN promptlike.like = -1 THEN promptlike.id END) dislikes").
		WhereOrLike("name", "%"+in.Key+"%").WhereOrLike("desc", "%"+in.Key+"%").WhereOrLike("content", "%"+in.Key+"%").
		WhereOrLike("taglist", "%"+in.Key+"%").Group("prompt.pid").Order("likes desc").Limit(in.Offset, in.Limit).All()
	if err != nil {
		return nil, err
	}
	count, _ := dao.Prompt.Ctx(ctx).WhereOrLike("name", "%"+in.Key+"%").WhereOrLike("desc", "%"+in.Key+"%").WhereOrLike("content", "%"+in.Key+"%").
		WhereOrLike("taglist", "%"+in.Key+"%").Count()
	res = s.GetResult(ctx, all, 3)
	return &v1.GetPromptByKeyRes{PromptInfos: res, Total: count}, nil
}

func (s *SPrompt) GetPromptById(ctx context.Context, in *v1.GetPromptParamsReq) (*v1.GetPromptParamsRes, error) {
	//pid, _ := strconv.ParseInt(in.Pid, 10, 64)
	res, err := dao.Prompt.GetPromptById(ctx, in.Pid)
	if err != nil {
		log.Fatalf("service GetPromptById error:%v", err)
		return nil, err
	}
	//temp, _ := json.Marshal(res.Params)
	//log.Println(string(temp))
	var params []string
	if err := json.Unmarshal([]byte(res.Params), &params); err != nil {
		log.Fatalf("service GetPromptById unmarshal error:%v", err)
		return nil, err
	}
	return &v1.GetPromptParamsRes{
		BaseRes: v1.BaseRes{},
		Data:    &v1.GetPromptParamsData{Params: params},
	}, nil
}

func (s *SPrompt) GetPromptByType(ctx context.Context, in *v1.GetPromptByTypeReq) (*v1.GetPromptByTypeRes, error) {
	res := ([]*v1.PromptInfo)(nil)
	all, err := dao.Prompt.Ctx(ctx).LeftJoin("`promptlike`", "prompt.pid = promptlike.pid").Fields("prompt.*,"+
		" COUNT(CASE WHEN promptlike.like = 1 THEN promptlike.id END) likes, COUNT(CASE WHEN promptlike.like = -1 THEN promptlike.id END) dislikes").
		Where("prompt.type = ", in.Type).Group("prompt.pid").Order("likes desc").Limit(in.Offset, in.Limit).All()
	if err != nil {
		return nil, err
	}
	count, _ := dao.Prompt.Ctx(ctx).Where("type", in.Type).Count()
	res = s.GetResult(ctx, all, 3)
	return &v1.GetPromptByTypeRes{PromptInfos: res, Total: count}, nil
}

func (s *SPrompt) GetResult(ctx context.Context, all gdb.Result, authLevel int) []*v1.PromptInfo {
	res := ([]*v1.PromptInfo)(nil)
	for _, prompt := range all {
		m := prompt.Map()
		id, _ := m["id"]
		pid, _ := m["pid"]
		name, _ := m["name"]
		desc, _ := m["desc"]
		price, _ := m["price"]
		ttype, _ := m["type"]
		content, _ := m["content"]
		params, _ := m["params"]
		author, _ := m["author"]
		taglist, _ := m["taglist"]
		avatar, _ := m["avatar"]
		examples, _ := m["examples"]
		likes, _ := m["likes"]
		dislikes, _ := m["dislikes"]
		attitude, _ := m["attitude"]
		pi := &v1.PromptInfo{
			Prompt: &entity.Prompt{
				Id:         uint(id.(int)),
				Pid:        pid.(string),
				Name:       name.(string),
				Desc:       desc.(string),
				Price:      price.(float64),
				Type:       uint(ttype.(int)),
				Content:    content.(string),
				Author:     author.(string),
				CreateTime: gtime.Now(),
			},
			Likes:    int(likes.(int64)),
			Dislikes: int(dislikes.(int64)),
		}
		if params != nil {
			pi.Params = params.(string)
		}
		if taglist != nil {
			pi.Taglist = taglist.(string)
		}
		if avatar != nil {
			pi.Avatar = avatar.(string)
		}
		if examples != nil {
			pi.Examples = examples.(string)
		}
		if attitude != nil {
			pi.Attitude = attitude.(int)
		} else {
			pi.Attitude = 0 //表示没有操作
		}
		if authLevel == 2 {
			pi.Content = ""
		} else if authLevel == 3 {
			pi.Content = ""
			pi.Params = ""
		}
		res = append(res, pi)
	}
	return res
}

func (s *SPrompt) AttitudeOfPrompt(ctx context.Context, uid, pid string) int {
	var pl *entity.Promptlike
	dao.Promptlike.Ctx(ctx).Where("uid", uid).Where("pid", pid).Scan(&pl)
	if pl == nil {
		return 0
	} else {
		return pl.Like
	}
}

func (s *SPrompt) LikePrompt(ctx context.Context, in *v1.LikePromptReq) error {
	attitude := s.AttitudeOfPrompt(ctx, in.Uid, in.Pid)
	if in.Like != 0 && attitude == 0 {
		//👍或者👎
		_, err := dao.Promptlike.Ctx(ctx).Insert(&entity.Promptlike{
			Uid:        in.Uid,
			Pid:        in.Pid,
			Like:       in.Like,
			CreateTime: gtime.Now(),
		})
		if err != nil {
			return err
		}
	} else {
		//取消
		_, err := dao.Promptlike.Ctx(ctx).Where("uid", in.Uid).Where("pid", in.Pid).Delete()
		if err != nil {
			return err
		}
	}
	return nil
}

func (s *SPrompt) EditPrompt(ctx context.Context, in *v1.EditPromptReq) error {
	var prompt *entity.Prompt
	err := dao.Prompt.Ctx(ctx).Where("pid", in.Pid).Where("author", in.Uid).Scan(&prompt)
	if err != nil {
		return err
	}
	if prompt == nil {
		return gerror.New("非本prompt作者无法修改")
	}
	data := g.Map{}
	t := reflect.ValueOf(*in)
	if t.FieldByName("PromptName").IsValid() {
		data["name"] = in.PromptName
	}
	if t.FieldByName("Desc").IsValid() {
		data["desc"] = in.Desc
	}
	if t.FieldByName("Price").IsValid() {
		data["price"] = in.Price
	}
	if t.FieldByName("Type").IsValid() {
		data["type"] = in.Type
	}
	if t.FieldByName("Content").IsValid() {
		data["content"] = in.Content
	}
	if t.FieldByName("Params").IsValid() {
		data["params"] = in.Params
	}
	if t.FieldByName("Tags").IsValid() {
		data["taglist"] = in.Tags
	}
	if t.FieldByName("Avatar").IsValid() {
		data["avatar"] = in.Avatar
	}
	if t.FieldByName("Examples").IsValid() {
		data["examples"] = in.Examples
	}
	if len(data) == 0 {
		return gerror.New("没有要更新的内容")
	}
	_, err = dao.Prompt.Ctx(ctx).Where("pid", in.Pid).Data(data).Update()
	if err != nil {
		return err
	}
	return nil
}

func (s *SPrompt) GetPrompt(ctx context.Context, in *v1.GetPromptReq) (*v1.GetPromptRes, error) {
	var prompt *entity.Prompt
	err := dao.Prompt.Ctx(ctx).Where("pid", in.Pid).Where("author", in.Uid).Scan(&prompt)
	if err != nil {
		return nil, err
	}
	all, err := dao.Prompt.Ctx(ctx).LeftJoin("`promptlike`", "prompt.pid = promptlike.pid").Fields("prompt.*,"+
		" COUNT(CASE WHEN promptlike.like = 1 THEN promptlike.id END) likes, COUNT(CASE WHEN promptlike.like = -1 THEN promptlike.id END) dislikes, promptlike.like attitude").
		Where("prompt.pid ", in.Pid).Group("prompt.pid").Order("likes desc").All()
	if err != nil {
		return nil, err
	}
	if prompt == nil {
		return nil, gerror.New("非创作者，无法查看")
	}
	res := s.GetResult(ctx, all, 1)
	likes, dislikes, attitude := -1, -1, -1
	if len(res) > 0 {
		likes = res[0].Likes
		dislikes = res[0].Dislikes
		attitude = res[0].Attitude
	}
	promptInfo := &v1.GetPromptRes{PromptInfo: v1.PromptInfo{
		Prompt:   prompt,
		Likes:    likes,
		Dislikes: dislikes,
		Attitude: attitude,
	}}
	// 该用户自己创建的prompt
	return promptInfo, nil
}

func extractTextInSquareBrackets(text string) []string {
	// Define the regular expression pattern to match text within square brackets
	pattern := `\{(.*?)\}`

	// Compile the regular expression pattern
	re := regexp.MustCompile(pattern)

	// Find all matches of the pattern in the input string
	matches := re.FindAllStringSubmatch(text, -1)

	// Create a string array to store the matches
	result := make([]string, len(matches))

	// Extract the matched text and add it to the result array
	for i, match := range matches {
		result[i] = match[1]
	}

	// Return the result array
	return result
}

func (s *SPrompt) CreatePrompt(ctx context.Context, in *v1.CreatePromptReq) (*v1.CreatePromptRes, error) {
	var pid string
	if in.PromptId == "" {
		pid = strings.Replace(uuid.NewString(), "-", "", -1)
	} else {
		pid = in.PromptId
	}
	var examplesStr string
	if len(in.Examples) > 0 {
		if examples, err := json.Marshal(in.Examples); err != nil {
			return nil, err
		} else {
			examplesStr = string(examples)
		}
	}
	params := extractTextInSquareBrackets(in.Content)
	g.Log().Info(ctx, "params: ", params)
	_, err := dao.Prompt.Ctx(ctx).Insert(&entity.Prompt{
		Pid:        pid,
		Name:       in.PromptName,
		Desc:       in.Desc,
		Price:      in.Price,
		Type:       uint(in.Type),
		Content:    in.Content,
		Params:     strings.Join(params, ","),
		Author:     in.Uid,
		Taglist:    strings.Join(in.Tags, ","),
		Avatar:     in.Avatar,
		Examples:   examplesStr,
		CreateTime: gtime.Now(),
	})
	if err != nil {
		return nil, err
	}
	return &v1.CreatePromptRes{Pid: pid}, nil
}

func init() {
	service.RegisterPrompt(New())
}

func New() service.IPrompt {
	return &SPrompt{}
}

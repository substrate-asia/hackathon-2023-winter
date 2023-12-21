package prompt

import (
	"context"
	"fmt"
	v1 "github.com/gogf/gf-demo-user/v2/api/v1"
	"github.com/gogf/gf/v2/frame/g"
	"testing"
)

func TestSPrompt_GetPromptById(t *testing.T) {

	SPrompt := SPrompt{}
	res, err := SPrompt.GetPromptById(context.Background(), &v1.GetPromptParamsReq{
		Meta: g.Meta{},
		Uid:  "1",
		Pid:  "bf40299a4b424240bd871721adc25a0d",
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(res)
}

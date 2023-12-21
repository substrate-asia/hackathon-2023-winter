package openai

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	v1 "github.com/gogf/gf-demo-user/v2/api/v1"
	"github.com/gogf/gf-demo-user/v2/internal/dao"
	"github.com/gogf/gf-demo-user/v2/internal/model/entity"
	"github.com/gogf/gf-demo-user/v2/internal/service"
	"log"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
)

type (
	SChatgpt struct{}
)

func (s *SChatgpt) Ask(ctx context.Context, in *v1.AskReq) (*v1.AskRes, error) {
	defer func() {
		temp1, _ := json.Marshal(in)
		log.Printf("Ask receive req:%v", string(temp1))
	}()
	if len(in.Data) == 0 {
		return &v1.AskRes{}, nil
	}
	pidList := make([]string, 0)
	for _, item := range in.Data {
		if item.DataType != v1.PromptAsk {
			continue
		}
		pidList = append(pidList, item.Pid)
	}
	promptModelMap := make(map[string]*entity.Prompt)
	if len(pidList) != 0 {
		var err error
		//pid, _ := strconv.ParseInt(in.Pid, 10, 64)
		promptModelMap, err = dao.Prompt.GetPromptByIdList(ctx, pidList)
		if err != nil {
			return nil, err
		}
	}
	userPrompt := buildAllPrompt(in.Data, promptModelMap)
	log.Printf("userprompt:%v", userPrompt)
	res, err := callOpenAI(ctx, userPrompt)
	if err != nil {
		log.Printf("callOpenAI err:%v", err)
		return nil, err
	}
	return &v1.AskRes{
		BaseRes: v1.BaseRes{},
		Data:    res,
	}, nil
}

func buildAllPrompt(oriData []*v1.AskData, promptDataMap map[string]*entity.Prompt) []string {
	res := make([]string, 0)
	for _, item := range oriData {
		switch item.DataType {
		case v1.Answer, v1.ContentAsk:
			res = append(res, item.Content)
		case v1.PromptAsk:
			promptData, ok := promptDataMap[item.Pid]
			if !ok {
				log.Printf("buildAllPrompt promptId not found:%v", item.Pid)
				continue
			}
			res = append(res, fillParamsToContent(item.Params, promptData.Content))
		}
	}
	return res
}

func fillParamsToContent(params []string, content string) string {
	for i := 0; i < len(params); i++ {
		content = fillBlank(content, params[i])
	}
	return content
}

func fillBlank(str, replacement string) string {
	indexStart := strings.Index(str, "{")
	indexEnd := strings.Index(str, "}")
	if indexStart == -1 || indexEnd == -1 || indexStart >= indexEnd {
		return str
	}
	return str[:indexStart] + replacement + str[indexEnd+1:]
}

func fillBlankRegex(input string, replacement string) string {
	regex := regexp.MustCompile(`{[^}]*}`)
	result := regex.ReplaceAllString(input, replacement)
	return result
}

func callOpenAI(ctx context.Context, prompt []string) (string, error) {
	if len(prompt) == 0 {
		return "", errors.New("empty prompt")
	}
	// 第三个参数整体是一个参数，不会因为中间有空格而变成多个参数
	path, err := getCurrentFilePath()
	if err != nil {
		log.Printf("callOpenAI error:%v", err)
		return "", err
	}
	scriptPath := filepath.Dir(path) + "/openai_api.py"
	cmd := exec.Command("python3", append([]string{scriptPath}, prompt...)...)
	log.Println(cmd.String())
	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("callOpenAI error:%v", err)
		return "", err
	}
	return string(out), nil
}

func getCurrentFilePath() (string, error) {
	_, filename, _, ok := runtime.Caller(1)
	if !ok {
		return "", fmt.Errorf("failed to get current file path")
	}
	return filepath.Abs(filename)
}

func init() {
	service.RegisterChatgpt(New())
}

func New() service.IChatgpt {
	return &SChatgpt{}
}

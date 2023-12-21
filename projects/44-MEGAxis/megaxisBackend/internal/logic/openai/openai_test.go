package openai

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"testing"
)

func replaceString(input string, replacement string) string {
	regex := regexp.MustCompile(`{[^}]*}`)
	result := regex.ReplaceAllString(input, replacement)
	return result
}

func TestAsd(t *testing.T) {
	str := "买一件{color} 的 {product}，现在优惠价{price}元"
	newStr := replaceString(str, "替换内容")
	fmt.Println(newStr)
}

func TestDsd(t *testing.T) {
	str := []string{"a", "b"}
	str1 := `["a","b"]`
	temp, _ := json.Marshal(str)
	fmt.Println(string(temp))
	temp, _ = json.Marshal(str1)
	fmt.Println(string(temp))
}

func TestCallOpenai(t *testing.T) {
	res, err := callOpenAI(context.Background(), []string{"什么是0", "0是一个数字，表示没有值或数量为零。它是基本的整数，同时也是一种十进制计数系统中的数字。其符号为“0”，在数学和计算机科学等领域有着重要的应用。\n", "能把刚刚的回答用英文给我吗"})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(res)
}

func Test_fillParamsToContent(t *testing.T) {
	fmt.Println(fillParamsToContent([]string{"我爱你", "english"}, "pls translate this sentence `{text1}` to {text2}"))
}

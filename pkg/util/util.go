package util

import (
	"fmt"
	"net/url"
	"strings"
)

// CalcBitValueByString 计算字符串位运算后的值(字符串以逗号分隔)
func CalcBitValueByString(s string) *int {
	val := 0
	if s == "" {
		return &val
	}

	for _, v := range strings.Split(s, ",") {
		val = val | 1<<S(v).DefaultUint(0)
	}

	return &val
}

// ConvStringToFloatInt 转换字符串为浮点数的整数（b为需要乘的基数）
func ConvStringToFloatInt(s string, b int) *int {
	var v int
	f, err := S(s).Float64()
	if err != nil {
		return &v
	}

	if b > 0 {
		v = int(f * float64(b))
	} else {
		v = int(f)
	}

	return &v
}

// ContentDisposition implements a simple version of https://tools.ietf.org/html/rfc2183
// Use mime.ParseMediaType to parse Content-Disposition header.
func ContentDisposition(fileName, dispositionType string) (header string) {
	if dispositionType == "" {
		dispositionType = "attachment"
	}
	if fileName == "" {
		return dispositionType
	}

	header = fmt.Sprintf(`%s; filename="%s"`, dispositionType, url.QueryEscape(fileName))
	fallbackName := url.PathEscape(fileName)
	if len(fallbackName) != len(fileName) {
		header = fmt.Sprintf(`%s; filename*=UTF-8''%s`, header, fallbackName)
	}
	return
}

// FillZero 填充零
func FillZero(i int) string {
	if i < 10 {
		return fmt.Sprintf("0%d", i)
	}
	return fmt.Sprintf("%d", i)
}

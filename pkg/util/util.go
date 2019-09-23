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

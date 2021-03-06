package util

import (
	"fmt"
	"math"
	"net/url"
	"strconv"
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

// FormatNumberString 格式化数字字符串
func FormatNumberString(s string, f int) string {
	if i := strings.Index(s, "."); i > -1 {
		if len(s[i:]) > f+1 {
			return s[:i+f+1]
		}
	}
	return s
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

// FracFloat 取小数
func FracFloat(f float64) float64 {
	if f == 0 {
		return 0
	}
	_, fr := math.Modf(f)
	return fr
}

// BoolToInt 布尔转int
func BoolToInt(b bool) int {
	if b {
		return 1
	} else {
		return 0
	}
}

// DecimalFloat64 保留两位小数
func DecimalFloat64(value float64) float64 {
	value, _ = strconv.ParseFloat(fmt.Sprintf("%.2f", value), 64)
	return value
}

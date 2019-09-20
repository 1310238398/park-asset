package util

import "strings"

// CalcBitValueByString 计算字符串位运算后的值(字符串以逗号分隔)
func CalcBitValueByString(s string) *int {
	val := 0
	if s == "" {
		return &val
	}

	for _, v := range strings.Split(s, ",") {
		val = val | 1<<S(v).DefaultInt(0)
	}

	return &val
}

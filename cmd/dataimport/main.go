package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"gxt-park-assets/internal/app"
	"gxt-park-assets/internal/app/config"
	"log"
	"os"
	"strings"

	"github.com/tealeg/xlsx"
	"go.uber.org/dig"
)

var (
	cfgFile        string
	dataFile       string
	dataConfigFile string
	container      *dig.Container
)

func init() {
	flag.StringVar(&cfgFile, "c", "configs/config.toml", "配置文件")
	flag.StringVar(&dataFile, "d", "", "数据文件文件")
	flag.StringVar(&dataConfigFile, "dc", "", "数据配置文件")
}

func main() {
	flag.Parse()

	if cfgFile == "" || dataFile == "" || dataConfigFile == "" {
		panic("无效的配置文件")
	}

	log.Println("读取excel数据...")
	excelData, err := parseExcel(dataFile)
	handleError(err)

	err = config.LoadGlobalConfig(cfgFile)
	handleError(err)

	container = dig.New()
	log.Println("建立数据库连接...")
	callback, err := app.InitStore(container)
	handleError(err)
	if callback != nil {
		defer callback()
	}

	dataCfg, err := parseDataConfigItems(dataConfigFile)
	handleError(err)

	log.Printf("开始执行数据导入，子公司:[%s]，资产类型:[%d],工作表:[%d]...\n", dataCfg.CompanyName, dataCfg.AssetType, dataCfg.SheetIndex)

	err = execImport(dataCfg, excelData)
	handleError(err)

	log.Println("数据导入完成")
}

func handleError(err error) {
	if err != nil {
		panic(err)
	}
}

// DataConfigItem 数据配置项
type DataConfigItem struct {
	CompanyName   string `json:"company_name"`
	AssetType     int    `json:"asset_type"`
	SheetIndex    int    `json:"sheet_index"`
	RowStartIndex int    `json:"row_start_index"`
	MaxIndex      int    `json:"max_index"`
	Items         []struct {
		Key   string `json:"key"`
		Index string `json:"index"`
	}
}

// ConvToIndexes 转换为索引
func (a *DataConfigItem) ConvToIndexes(c string) []int {
	if c == "" {
		return nil
	}

	var idx []int
	midx := make(map[string]int)
	for i := 0; i < 26; i++ {
		midx[fmt.Sprintf("%c", i+'A')] = i
		midx[fmt.Sprintf("A%c", i+'A')] = 26 + i
	}

	if strings.Index(c, "-") > -1 {
		ss := strings.Split(c, "-")
		start, end := midx[ss[0]], midx[ss[1]]
		for i := start; i <= end; i++ {
			idx = append(idx, i)
		}
		return idx
	}
	idx = append(idx, midx[c])
	return idx
}

// ToMapItem 转换为键名索引映射
func (a *DataConfigItem) ToMapItem() map[string][]int {
	m := make(map[string][]int)
	for _, item := range a.Items {
		m[item.Key] = a.ConvToIndexes(item.Index)
	}
	return m
}

// GetIndex 获取键索引
func (a *DataConfigItem) GetIndex(key string) int {
	m := a.ToMapItem()
	if v, ok := m[key]; ok && len(v) > 0 {
		return v[0]
	}
	return 0
}

// GetValue 获取值
func (a *DataConfigItem) GetValue(data []string, key string) string {
	m := a.ToMapItem()
	if v, ok := m[key]; ok && len(v) > 0 {
		return data[v[0]]
	}
	return ""
}

// GetIndexes 获取键索引
func (a *DataConfigItem) GetIndexes(key string) []int {
	m := a.ToMapItem()
	return m[key]
}

// 解析数据配置文件
func parseDataConfigItems(name string) (*DataConfigItem, error) {
	f, err := os.Open(name)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var item DataConfigItem
	err = json.NewDecoder(f).Decode(&item)
	if err != nil {
		return nil, err
	}
	return &item, nil
}

// 解析excel
func parseExcel(name string) ([][][]string, error) {
	f, err := xlsx.OpenFile(name)
	if err != nil {
		return nil, err
	}

	var items [][][]string

	for _, sheet := range f.Sheets {
		var rows [][]string
		for _, row := range sheet.Rows {
			var cols []string
			for _, cell := range row.Cells {
				cols = append(cols, cell.String())
			}
			rows = append(rows, cols)
		}
		items = append(items, rows)
	}

	return items, nil
}

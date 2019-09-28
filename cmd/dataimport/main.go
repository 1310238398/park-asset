package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"gxt-park-assets/internal/app"
	"gxt-park-assets/internal/app/config"
	"os"

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
	flag.StringVar(&dataFile, "d", "data/data_tpl.excel", "数据文件文件")
	flag.StringVar(&dataConfigFile, "dc", "configs/data.json", "数据配置文件")
}

func main() {
	flag.Parse()

	if cfgFile == "" || dataFile == "" || dataConfigFile == "" {
		panic("无效的配置文件")
	}

	fmt.Println("读取excel数据...")
	excelData, err := parseExcel(dataFile)
	handleError(err)

	err = config.LoadGlobalConfig(cfgFile)
	handleError(err)

	container = dig.New()
	fmt.Println("建立数据库连接...")
	callback, err := app.InitStore(container)
	handleError(err)
	if callback != nil {
		defer callback()
	}

	fmt.Println("开始执行数据导入...")

	dcItems, err := parseDataConfigItems(dataConfigFile)
	handleError(err)

	for i, dcItem := range dcItems {
		fmt.Printf("[%d] 执行数据导入，类型：%d,工作表：%d \n", i+1, dcItem.Type, dcItem.Sheet)
		err := execImport(dcItem, excelData)
		if err != nil {
			fmt.Printf("[%d] 执行导入发生错误：%s", i+1, err.Error())
		}
	}

	fmt.Println("数据导入完成")
}

func handleError(err error) {
	if err != nil {
		panic(err)
	}
}

// DataConfigItem 数据配置项
type DataConfigItem struct {
	Type  int
	Sheet int
	Index map[string]int
}

// 解析数据配置文件
func parseDataConfigItems(name string) ([]*DataConfigItem, error) {
	f, err := os.Open(name)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var items []*DataConfigItem
	err = json.NewDecoder(f).Decode(&items)
	return items, err
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

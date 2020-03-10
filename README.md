# 测试demo

## 获取项目

```
cd ~/go/src
git clone https://gogs.xiaoyuanjijiehao.com/jingutong/gxt-park-assets.git
```

## 编译并运行

```
go build -o ./cmd/server/server ./cmd/server
./cmd/server -c ./configs/config.toml -m ./configs/model.conf -swagger ./internal/app/swagger
```

## 生成swagger

```
swaggo -s ./internal/app/routers/api/swagger.go -p . -o ./internal/app/swagger
```

go build -o ./cmd/server/server ./cmd/server
./cmd/server/server  -c ./configs/config.toml -m ./configs/model.conf -swagger ./internal/app/swagger
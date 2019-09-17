package internal

import (
	"context"

	"gxt-park-assets/internal/app/config"
	icontext "gxt-park-assets/internal/app/context"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/logger"
	"gxt-park-assets/pkg/util"
)

// GetRootUser 获取root用户
func GetRootUser() *schema.User {
	user := config.GetGlobalConfig().Root
	return &schema.User{
		RecordID: user.UserName,
		UserName: user.UserName,
		RealName: user.RealName,
		Password: util.MD5HashString(user.Password),
	}
}

// CheckIsRootUser 检查是否是root用户
func CheckIsRootUser(ctx context.Context, userID string) bool {
	return GetRootUser().RecordID == userID
}

// TransFunc 定义事务执行函数
type TransFunc func(context.Context) error

// ExecTrans 执行事务
func ExecTrans(ctx context.Context, transModel model.ITrans, fn TransFunc) error {
	if _, ok := icontext.FromTrans(ctx); ok {
		return fn(ctx)
	}
	trans, err := transModel.Begin(ctx)
	if err != nil {
		return err
	}

	err = fn(icontext.NewTrans(ctx, trans))
	if err != nil {
		_ = transModel.Rollback(ctx, trans)
		return err
	}
	return transModel.Commit(ctx, trans)
}

// GetSystemParameterValue 获取系统参数值
func GetSystemParameterValue(ctx context.Context, mSystemParameter model.ISystemParameter, code string) (util.S, error) {
	result, err := mSystemParameter.Query(ctx, schema.SystemParameterQueryParam{
		Status: 1,
		Code:   code,
	})
	if err != nil {
		return "", err
	} else if len(result.Data) > 0 {
		return util.S(result.Data[0].Value), nil
	}
	return "", nil
}

// DefaultSystemParameterValue 获取系统参数值(如果出现错误或值为空，则使用默认值)
func DefaultSystemParameterValue(ctx context.Context, mSystemParameter model.ISystemParameter, code, defValue string) util.S {
	val, err := GetSystemParameterValue(ctx, mSystemParameter, code)
	if err != nil || val == "" {
		if err != nil {
			logger.StartSpan(ctx, logger.SetSpanTitle("查询系统参数")).WithField("code", code).Errorf(err.Error())
		}
		return util.S(defValue)
	}
	return val
}

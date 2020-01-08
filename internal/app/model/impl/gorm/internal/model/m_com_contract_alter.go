package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewComContractAlter 创建变更管理存储实例
func NewComContractAlter(db *gorm.DB) *ComContractAlter {
	return &ComContractAlter{db}
}

// ComContractAlter 变更管理存储
type ComContractAlter struct {
	db *gorm.DB
}

func (a *ComContractAlter) getQueryOption(opts ...schema.ComContractAlterQueryOptions) schema.ComContractAlterQueryOptions {
	var opt schema.ComContractAlterQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ComContractAlter) Query(ctx context.Context, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Order("id DESC")

	var list entity.ComContractAlters
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlters(),
	}

	return qr, nil
}

// QueryDesignByComContractID 通过合同id查询设计变更
func (a *ComContractAlter) QueryDesignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterDesignDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("comcontract_id = ?", comContractID)
	db = db.Order("id DESC")

	var list entity.ComContractAlterDesigns
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterDesignQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterDesigns(),
	}

	return qr, nil
}

// QuerySignByComContractID 通过合同id查询设计变更
func (a *ComContractAlter) QuerySignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterSignDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("comcontract_id = ?", comContractID)
	db = db.Order("id DESC")

	var list entity.ComContractAlterSigns
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterSignQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterSigns(),
	}

	return qr, nil
}

// QueryStuffPriceByComContractID 通过合同id查询设计变更
func (a *ComContractAlter) QueryStuffPriceByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterStuffPriceDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("comcontract_id = ?", comContractID)
	db = db.Order("id DESC")

	var list entity.ComContractAlterStuffPrices
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterStuffPriceQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterStuffPrices(),
	}

	return qr, nil
}

// QueryStuffPriceItemByStuffPriceID 通过材料批价id查询材料批价列表
func (a *ComContractAlter) QueryStuffPriceItemByStuffPriceID(ctx context.Context, SFID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItemQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterStuffPriceItemDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("alter_stuff_price_id = ?", SFID)
	db = db.Order("id DESC")

	var list entity.ComContractAlterStuffPriceItems
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterStuffPriceItemQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterStuffPriceItems(),
	}

	return qr, nil
}

// QueryDesignByProjectID 通过项目id查询设计变更
func (a *ComContractAlter) QueryDesignByProjectID(ctx context.Context, projectID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterDesignDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("project_id = ?", projectID)
	if params.SN != "" {
		db = db.Where("sn = ?", params.SN)
	}
	if params.Name != "" {
		db = db.Where("name like ?", "%"+params.Name+"%")
	}
	if params.ContractName != "" {
		db = db.Where("comcontract_id like ?", "%"+params.ContractName+"%")
	}
	db = db.Order("comcontract_id DESC,id DESC")

	var list entity.ComContractAlterDesigns
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterDesignQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterDesigns(),
	}

	return qr, nil
}

// QuerySignByProjectID 通过项目id查询设计变更
func (a *ComContractAlter) QuerySignByProjectID(ctx context.Context, projectID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterSignDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("project_id = ?", projectID)
	if params.SN != "" {
		db = db.Where("sn = ?", params.SN)
	}
	if params.Name != "" {
		db = db.Where("name like ?", "%"+params.Name+"%")
	}
	if params.ContractName != "" {
		db = db.Where("comcontract_id like ?", "%"+params.ContractName+"%")
	}
	db = db.Order("comcontract_id DESC,id DESC")

	var list entity.ComContractAlterSigns
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterSignQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterSigns(),
	}

	return qr, nil
}

// QueryStuffPriceByProjectID 通过项目id查询设计变更
func (a *ComContractAlter) QueryStuffPriceByProjectID(ctx context.Context, projectID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterStuffPriceDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("project_id = ?", projectID)
	if params.SN != "" {
		db = db.Where("sn = ?", params.SN)
	}
	if params.Name != "" {
		db = db.Where("name like ?", "%"+params.Name+"%")
	}
	if params.ContractName != "" {
		db = db.Where("comcontract_id like ?", "%"+params.ContractName+"%")
	}
	db = db.Order("comcontract_id DESC,id DESC")

	var list entity.ComContractAlterStuffPrices
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	listStuffPriceSchema := list.ToSchemaComContractAlterStuffPrices()
	// fetch quotes
	for _, pI := range listStuffPriceSchema {
		p := schema.ComContractAlterQueryParam{}
		qopts := schema.ComContractAlterQueryOptions{
			PageParam: &schema.PaginationParam{PageIndex: 0, PageSize: 9999},
		}
		itemList, err := a.QueryStuffPriceItemByStuffPriceID(ctx, pI.RecordID, p, qopts)
		if err == nil {
			pI.Quotes = itemList.Data
		}
	}
	qr := &schema.ComContractAlterStuffPriceQueryResult{
		PageResult: pr,
		Data:       listStuffPriceSchema,
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ComContractAlter) Get(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlter, error) {
	db := entity.GetComContractAlterDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContractAlter
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaComContractAlter(), nil
}

// GetDesign 查询指定数据
func (a *ComContractAlter) GetDesign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesign, error) {
	db := entity.GetComContractAlterDesignDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContractAlterDesign
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaComContractAlterDesign(), nil
}

// GetSign 查询指定数据
func (a *ComContractAlter) GetSign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSign, error) {
	db := entity.GetComContractAlterSignDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContractAlterSign
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaComContractAlterSign(), nil
}

// GetStuffPrice 查询指定数据
func (a *ComContractAlter) GetStuffPrice(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPrice, error) {
	db := entity.GetComContractAlterStuffPriceDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContractAlterStuffPrice
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	sItem := item.ToSchemaComContractAlterStuffPrice()

	p := schema.ComContractAlterQueryParam{}
	qopts := schema.ComContractAlterQueryOptions{
		PageParam: &schema.PaginationParam{PageIndex: 0, PageSize: 9999},
	}
	itemList, err := a.QueryStuffPriceItemByStuffPriceID(ctx, sItem.RecordID, p, qopts)
	if err == nil {
		sItem.Quotes = itemList.Data
	}

	return sItem, nil
}

// GetStuffPriceItem 查询指定数据
func (a *ComContractAlter) GetStuffPriceItem(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItem, error) {
	db := entity.GetComContractAlterStuffPriceItemDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContractAlterStuffPriceItem
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaComContractAlterStuffPriceItem(), nil
}

// Create 创建数据
func (a *ComContractAlter) Create(ctx context.Context, item schema.ComContractAlter) error {
	eitem := entity.SchemaComContractAlter(item).ToComContractAlter()
	result := entity.GetComContractAlterDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CreateDesign 创建数据
func (a *ComContractAlter) CreateDesign(ctx context.Context, item schema.ComContractAlterDesign) error {
	eitem := entity.SchemaComContractAlterDesign(item).ToComContractAlterDesign()
	result := entity.GetComContractAlterDesignDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CreateSign 创建数据
func (a *ComContractAlter) CreateSign(ctx context.Context, item schema.ComContractAlterSign) error {
	eitem := entity.SchemaComContractAlterSign(item).ToComContractAlterSign()
	result := entity.GetComContractAlterSignDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CreateStuffPrice 创建数据
func (a *ComContractAlter) CreateStuffPrice(ctx context.Context, item schema.ComContractAlterStuffPrice) error {
	eitem := entity.SchemaComContractAlterStuffPrice(item).ToComContractAlterStuffPrice()
	result := entity.GetComContractAlterStuffPriceDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CreateStuffPriceItem 创建数据
func (a *ComContractAlter) CreateStuffPriceItem(ctx context.Context, item schema.ComContractAlterStuffPriceItem) error {
	eitem := entity.SchemaComContractAlterStuffPriceItem(item).ToComContractAlterStuffPriceItem()
	result := entity.GetComContractAlterStuffPriceItemDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ComContractAlter) Update(ctx context.Context, recordID string, item schema.ComContractAlter) error {
	eitem := entity.SchemaComContractAlter(item).ToComContractAlter()
	result := entity.GetComContractAlterDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateDesign 更新数据
func (a *ComContractAlter) UpdateDesign(ctx context.Context, recordID string, item schema.ComContractAlterDesign) error {
	eitem := entity.SchemaComContractAlterDesign(item).ToComContractAlterDesign()
	result := entity.GetComContractAlterDesignDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateSign 更新数据
func (a *ComContractAlter) UpdateSign(ctx context.Context, recordID string, item schema.ComContractAlterSign) error {
	eitem := entity.SchemaComContractAlterSign(item).ToComContractAlterSign()
	result := entity.GetComContractAlterSignDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateStuffPrice 更新数据
func (a *ComContractAlter) UpdateStuffPrice(ctx context.Context, recordID string, item schema.ComContractAlterStuffPrice) error {
	eitem := entity.SchemaComContractAlterStuffPrice(item).ToComContractAlterStuffPrice()
	result := entity.GetComContractAlterStuffPriceDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateStuffPriceItem 更新数据
func (a *ComContractAlter) UpdateStuffPriceItem(ctx context.Context, recordID string, item schema.ComContractAlterStuffPriceItem) error {
	eitem := entity.SchemaComContractAlterStuffPriceItem(item).ToComContractAlterStuffPriceItem()
	result := entity.GetComContractAlterStuffPriceItemDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ComContractAlter) Delete(ctx context.Context, recordID string) error {
	result := entity.GetComContractAlterDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContractAlter{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// DeleteDesign 删除数据
func (a *ComContractAlter) DeleteDesign(ctx context.Context, recordID string) error {
	result := entity.GetComContractAlterDesignDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContractAlterDesign{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// DeleteSign 删除数据
func (a *ComContractAlter) DeleteSign(ctx context.Context, recordID string) error {
	result := entity.GetComContractAlterSignDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContractAlterSign{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// DeleteStuffPrice 删除数据
func (a *ComContractAlter) DeleteStuffPrice(ctx context.Context, recordID string) error {
	result := entity.GetComContractAlterStuffPriceDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContractAlterStuffPrice{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// DeleteStuffPriceItem 删除数据
func (a *ComContractAlter) DeleteStuffPriceItem(ctx context.Context, recordID string) error {
	result := entity.GetComContractAlterStuffPriceItemDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContractAlterStuffPriceItem{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// SetDesignStatus 设置design status字段
func (a *ComContractAlter) SetDesignStatus(ctx context.Context, recordID string, val uint8) error {
	result := entity.GetComContractAlterDesignDB(ctx, a.db).Where("record_id=?", recordID).Update("status", val)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// SetSignStatus 设置design status字段
func (a *ComContractAlter) SetSignStatus(ctx context.Context, recordID string, val uint8) error {
	result := entity.GetComContractAlterSignDB(ctx, a.db).Where("record_id=?", recordID).Update("status", val)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// SetStuffPriceStatus 设置design status字段
func (a *ComContractAlter) SetStuffPriceStatus(ctx context.Context, recordID string, val uint8) error {
	result := entity.GetComContractAlterStuffPriceDB(ctx, a.db).Where("record_id=?", recordID).Update("status", val)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// DeleteAllStuffPriceItem 根据alter_stuff_price_id删除所有 stuffpriceitem数据
func (a *ComContractAlter) DeleteAllStuffPriceItem(ctx context.Context, recordID string) error {
	result := entity.GetComContractAlterStuffPriceDB(ctx, a.db).Where("alter_stuff_price_id=?", recordID).Delete(&entity.ComContractAlterStuffPriceItem{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// AffirmDesign 确认设计变更
func (a *ComContractAlter) AffirmDesign(ctx context.Context, recordID string, info schema.ComContractAlterDesignAffirmInfo) error {
	vals := map[string]interface{}{
		"affirm_amount": info.AffirmAmount,
		"affirm_remark": info.AffirmRemark,
		"status":        3,
		"affirm_date":   info.AffirmDate}
	result := entity.GetComContractAlterDesignDB(ctx, a.db).Where("record_id=?", recordID).Updates(vals)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

//AffirmSign 确认签证变更
func (a *ComContractAlter) AffirmSign(ctx context.Context, recordID string, info schema.ComContractAlterSignAffirmInfo) error {
	vals := map[string]interface{}{
		"affirm_amount":          info.AffirmAmount,
		"affirm_remark":          info.AffirmRemark,
		"affirm_working_company": info.AffirmWorkingCompany,
		"affirm_working_name":    info.AffirmWorkingName,
		"affirm_work_num":        info.AffirmWorkNum,
		"status":                 3,
		"affirm_date":            info.AffirmDate}
	result := entity.GetComContractAlterSignDB(ctx, a.db).Where("record_id=?", recordID).Updates(vals)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

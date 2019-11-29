package test

import (
	"gxt-park-assets/internal/app/schema"
	"testing"
)

func TestProjExpendCost(t *testing.T) {
	list := schema.ProjExpendCosts{
		&schema.ProjExpendCost{
			RecordID:          "pec1",
			Amount:            12.12,
			ProjCostID:        "pc1",
			ProjExpenditureID: "pe1",
		},
		&schema.ProjExpendCost{
			RecordID:          "pec2",
			Amount:            12.12,
			ProjCostID:        "pc2",
			ProjExpenditureID: "pe2",
		},
		&schema.ProjExpendCost{
			RecordID:          "pec3",
			Amount:            12.12,
			ProjCostID:        "pc2",
			ProjExpenditureID: "pe2",
		},
		&schema.ProjExpendCost{
			RecordID:          "pec4",
			Amount:            12.12,
			ProjCostID:        "pc3",
			ProjExpenditureID: "pe3",
		},
	}

	r := list.ToProjExpendCostsMap()
	t.Logf("%v+", r)
}

package test

import "testing"

func TestProjExpendCost(t *testing.T) {
	list := ProjExpendCosts{
		&ProjExpendCost{
			RecordID:          "pec1",
			Amount:            12.12,
			ProjCostID:        "pc1",
			ProjExpenditureID: "pe1",
		},
		&ProjExpendCost{
			RecordID:          "pec2",
			Amount:            12.12,
			ProjCostID:        "pc2",
			ProjExpenditureID: "pe2",
		},
		&ProjExpendCost{
			RecordID:          "pec3",
			Amount:            12.12,
			ProjCostID:        "pc2",
			ProjExpenditureID: "pe2",
		},
		&ProjExpendCost{
			RecordID:          "pec4",
			Amount:            12.12,
			ProjCostID:        "pc3",
			ProjExpenditureID: "pe3",
		},
	}

	r := list.ToProjExpendCostsMap()
	t.Logf("%v+", r)
}

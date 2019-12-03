package test

import (
	"gxt-park-assets/internal/app/schema"
	"testing"
)

func TestExpenditure(t *testing.T) {
	list := schema.ExpenditureTrees{
		&schema.ExpenditureTree{
			RecordID:   "1",
			Name:       "test1",
			ParentID:   "",
			ParentPath: "",
			Children: &schema.ExpenditureTrees{
				&schema.ExpenditureTree{
					RecordID:   "11",
					Name:       "test1child",
					ParentID:   "1",
					ParentPath: "1",
					Children: &schema.ExpenditureTrees{
						&schema.ExpenditureTree{
							RecordID:   "111",
							Name:       "test1childchild",
							ParentID:   "11",
							ParentPath: "1/11",
						},
					},
				},
				&schema.ExpenditureTree{
					RecordID:   "12",
					Name:       "test1child2",
					ParentID:   "1",
					ParentPath: "1",
				},
			},
		},
		&schema.ExpenditureTree{
			RecordID:   "c2",
			Name:       "test2",
			ParentID:   "",
			ParentPath: "",
			Children: &schema.ExpenditureTrees{
				&schema.ExpenditureTree{
					Name:       "test2child",
					ParentID:   "c2",
					ParentPath: "c2",
				},
			},
		},
	}

	var items schema.ProjExpenditures
	items = *list.ToProjEx(&items)
	for _, item := range items {
		t.Logf("%v+\n", item)
	}

}

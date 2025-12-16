export default {
    button_addIncome() {
        addIncome.run((response) => {
            // Check the response for affected rows
            const affectedRows = response[0].affectedRows;
            if (affectedRows > 0) {
                showAlert("操作成功，新增记录: " + affectedRows, "success");
							   closeModal(mdl_add_income.name);
							{{Select_feeway1.run()}};
            } else {
                showAlert("未能成功执行，请检查数据完整性或已存在同编号数据", "info");
            }
        }, (error) => {
            showAlert("Error executing query: " + error, "error");
        });
    },
	
	
	table_feeway1_refresh() {
		{{Select_feeway1.run()}};
		
		
	}
}
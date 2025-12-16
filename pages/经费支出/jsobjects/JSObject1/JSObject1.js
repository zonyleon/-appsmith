export default {
    button_addOut() {
			  // First validate that ipt_outAdd_proId is not empty
    if (!ipt_outAdd_proId.text || ipt_outAdd_proId.text.trim() === '') {
        showAlert("项目ID/名称不能为空,请点选相关项目后再上传", "error");
        return; // Exit the function early if validation fails
    }
		
   // 执行新增记录操作
        insert_addOut.run((response) => {
            // Check the response for affected rows
            const affectedRows = response[0].affectedRows;
            if (affectedRows > 0) {
							FetchLastInsertedId_feeout.run()
                .then((affectedRows) => {
                  showAlert("操作成功，新增记录: " + affectedRows, "success");
                  JSObject1.uploadFapiao(); // 确保在 run() 成功后执行
					select_feeout.run();
					{{closeModal(mdl_add_out.name);}}
							})
            } else {
                showAlert("未能成功执行，请检查数据完整性或已存在同编号数据", "info");
            }
        }, (error) => {
					 // 错误处理（改进错误消息显示）
            const errorMsg = error?.message || error || "未知错误";
            showAlert("执行查询时出错: " + errorMsg, "error");
        });
    },
	
	
	table_feeout_refresh() {
		{{Select_feeway_out.run()}};
		
		
	},
	
	 tbl_selectRow() {
    select_balance.run((response) => {
        ipt_outAdd_balance.setValue(select_balance.data[0].balance);
        ipt_outAdd_proId.setValue(tbl_income_serch.selectedRow.proId);    
        ipt_outAdd_proName.setValue(tbl_income_serch.selectedRow.proName);
			ipt_outAdd_proLeader.setValue(tbl_income_serch.selectedRow.proLeader);
    });
},
	

uploadFapiao() {
  // 确保在获取到LastID后再执行
  if (!FetchLastInsertedId_feeout.data[0]?.LastID) {
    showAlert("系统繁忙，请稍后重试", "error");
    return;
  }

  // 使用立即执行async函数处理异步流程
  (async () => {
    try {
      // 1. 等待文件上传完成
      await new Promise((resolve, reject) => {
        api_upload_fapiao.run(resolve, reject);
      });

      // 2. 等待数据库插入完成
      await new Promise((resolve, reject) => {
        insert_filelink.run(resolve, reject);
      });

      // 3. 全部成功后的提示
      showAlert("文件上传成功！");
    } catch (error) {
      // 统一错误处理
      const errorMsg = error?.message || 
        (error === "upload" ? "文件上传服务异常" : "数据库记录插入失败");
      showAlert(`文件上传失败：${errorMsg}`, "error");
    }
  })();
},
	
	extractFilenamesFromLinks(linkField) {
    // 新的主机地址
    const newHost = 'host.docker.internal';

    // 将字符串转换为数组
    const links = JSON.parse(linkField);

    // 替换主机地址
    const updatedLinks = links.map(link => {
        return link.replace('127.0.0.1', newHost);
    });

    return updatedLinks;
},
	
splitFileLink(data) {
	
    try {
        // 使用 flatMap 和 map 来处理数据并构建新的数组
        return data.flatMap(item => {
            if (!item.fileLink) {
                return []; // 如果 fileLink 为空，返回空数组
            }

            const fileLinks = JSON.parse(item.fileLink);
            if (!Array.isArray(fileLinks)) {
                return []; // 如果 fileLinks 不是数组，返回空数组
            }

            return fileLinks.map(fileLink => {
                // 替换 http://host.docker.internal:8000 为 ./files
                const newFileLink = fileLink.replace('http://127.0.0.1:8000/files/', 'http://60.8.16.118:60602/files/');
                // 提取文件名
               //原文件名重写方法 const fileName = newFileLink.split('/').pop();
							const fileName = item.fileName
                return {
                    ord_no: item.ord_no,
                    fileLink: newFileLink,
                    name: fileName
                };
            });
        });
    } catch (error) {
        console.error("Error parsing file links:", error);
        return []; // 在出现错误时返回空数组
    }
}







	
	
}
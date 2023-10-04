import exceljs from "exceljs";

class ExcelExporter {
  async exportDataToExcel(data, filePath, columnWidths) {
    if (!data || data.length === 0) {
      throw new Error("No data to export.");
    }
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      data.forEach((item) => {
        const row = [];
        headers.forEach((header) => {
          row.push(item[header]);
        });
        worksheet.addRow(row);
      });
    } else if (typeof data === "object") {
      const headers = Object.keys(data);
      worksheet.addRow(headers);

      const row = [];
      headers.forEach((header) => {
        row.push(data[header]);
      });
      worksheet.addRow(row);
    } else {
      throw new Error("Invalid data format for export.");
    }
    if (columnWidths && typeof columnWidths === "object") {
      for (const columnKey in columnWidths) {
        if (columnWidths.hasOwnProperty(columnKey)) {
          const column = worksheet.getColumn(columnKey);
          const width = columnWidths[columnKey];
          if (column) {
            column.width = width;
          }
        }
      }
    }

    await workbook.xlsx.writeFile(filePath);
  }
}

export default new ExcelExporter();

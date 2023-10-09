import exceljs from "exceljs";

class ExcelExporter {
  async exportDataToExcel(data, filePath, columnWidths, formatFunction) {
    if (!data || data.length === 0) {
      throw new Error("No data to export.");
    }
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Determine headers based on the first item in the data
    const headers = Array.isArray(data)
      ? Object.keys(data[0])
      : Object.keys(data);

    // Add column headers
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    if (formatFunction && typeof formatFunction === "function") {
      data.forEach((item) => {
        const row = headers.map((header) => item[header]);
        formatFunction(item, row, headers); // Pass headers to the custom format function
        worksheet.addRow(row);
      });
    } else if (data.length > 0) {
      data.forEach((item) => {
        const row = headers.map((header) => item[header]);
        worksheet.addRow(row);
      });
    } else {
      throw new Error("Invalid data format for export.");
    }

    // Set column widths if provided
    if (columnWidths && typeof columnWidths === "object") {
      headers.forEach((header, index) => {
        const column = worksheet.getColumn(index + 1); // Columns are 1-based
        const width = columnWidths[header];
        if (column) {
          column.width = width;
        }
      });
    }

    await workbook.xlsx.writeFile(filePath);
  }
}

export default new ExcelExporter();

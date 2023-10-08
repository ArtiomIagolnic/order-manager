import asyncHandler from "express-async-handler";
import Export from "../models/Export.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// @desc getting all customers
// route GET /api/customers/all
// @access public

const getExports = asyncHandler(async (req, res) => {
  const exports = await Export.getAll();
  if (!exports) {
    res.status(404).json({ error: "Export not found" });
  }
  res.status(200).json(exports);
});

// @desc delete customer
// route DELETE /api/customers/delete
// @access public
const deleteExport = asyncHandler(async (req, res) => {
  const exportId = req.params.exports.split(",");

  const exportsToDelete = await Export.getById(exportId);

  if (!exportsToDelete) {
    res.status(404).json({ error: "Export not found" });
    return;
  }
  const deletedExport = await Export.delete(exportId);

  //Logic for deleting files
  for (const exportToDelete of exportsToDelete) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const exportDirectory = path.resolve(
        __dirname,
        `../storage/exports/${exportToDelete.exportedFile}`
      );
      await fs.promises.unlink(exportDirectory); // Delete the export file
    } catch (error) {
      // Handle any errors that occur during file deletion (optional)
      console.error(
        `Error deleting export file ${exportToDelete.exportedFile}: ${error}`
      );
    }
  }
  res.status(204).send(deletedExport);
});

export { getExports, deleteExport };

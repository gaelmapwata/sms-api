import XLSX from 'xlsx';

export default {
  importExcelToDb: (filePath : string) => {
    try {
      // Lire le fichier Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convertir les données de la feuille Excel en JSON
      const data = XLSX.utils.sheet_to_json(sheet);

      return data;
    } catch (error) {
      console.log('Erreur lors de l\'importation :', error);
    }
  },
};

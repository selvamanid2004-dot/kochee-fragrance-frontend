import * as XLSX from 'xlsx';

export const SAMPLE_PRODUCTS = [
  {
    title: 'KOCHEE VELVET NOIR OUD',
    category_name: 'Oriental Ouds & Amber',
    price: 1899,
    compare_price: 2499,
    stock: 25,
    gender: 'Unisex',
    volume: '50ml',
    concentration: 'Extrait de Parfum (25% Oil)',
    inspired_by: 'Inspired by Tom Ford Oud Wood',
    description: 'A dark, smoky masterpiece blending rare Cambodian agarwood, roasted tonka bean, and velvety Bulgarian rose.',
    top_notes: 'Rosewood, Cardamom, Chinese Pepper',
    heart_notes: 'Agarwood (Oud), Sandalwood, Vetiver',
    base_notes: 'Tonka Bean, Amber, Bourbon Vanilla',
    image_url_1: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    image_url_2: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
    image_url_3: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    image_url_4: '',
    is_featured: 1,
    is_best_seller: 1
  },
  {
    title: 'KOCHEE AZURE CITRUS BREEZE',
    category_name: 'Fresh & Aquatic',
    price: 1499,
    compare_price: 1999,
    stock: 40,
    gender: 'Men',
    volume: '50ml',
    concentration: 'Eau de Parfum (20% Oil)',
    inspired_by: 'Inspired by Acqua di Gio Profondo',
    description: 'An invigorating splash of Sicilian bergamot, crystalline marine minerals, and crisp rosemary.',
    top_notes: 'Calabrian Bergamot, Green Mandarin, Aquatic Marine Notes',
    heart_notes: 'Rosemary, Lavender, Cypress',
    base_notes: 'Mineral Amber, Patchouli, Musk',
    image_url_1: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    image_url_2: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    image_url_3: '',
    image_url_4: '',
    is_featured: 1,
    is_best_seller: 0
  }
];

export function downloadProductExcelTemplate() {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_PRODUCTS);

  // Set column widths for comfortable editing
  worksheet['!cols'] = [
    { wch: 28 }, // title
    { wch: 24 }, // category_name
    { wch: 10 }, // price
    { wch: 14 }, // compare_price
    { wch: 8 },  // stock
    { wch: 10 }, // gender
    { wch: 10 }, // volume
    { wch: 26 }, // concentration
    { wch: 30 }, // inspired_by
    { wch: 45 }, // description
    { wch: 35 }, // top_notes
    { wch: 35 }, // heart_notes
    { wch: 35 }, // base_notes
    { wch: 40 }, // image_url_1
    { wch: 40 }, // image_url_2
    { wch: 40 }, // image_url_3
    { wch: 40 }, // image_url_4
    { wch: 12 }, // is_featured
    { wch: 14 }  // is_best_seller
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products_Template');

  XLSX.writeFile(workbook, 'Kochee_Product_Import_Template.xlsx');
}

export async function parseProductsExcel(file, categories = []) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rows || rows.length === 0) {
          return resolve({ validProducts: [], errors: ['Excel sheet is empty.'] });
        }

        const validProducts = [];
        const errors = [];

        // Build category lookup
        const categoryMap = new Map();
        categories.forEach(c => {
          categoryMap.set(c.name.trim().toLowerCase(), c.id);
          categoryMap.set(c.slug.trim().toLowerCase(), c.id);
          categoryMap.set(String(c.id), c.id);
        });

        rows.forEach((row, index) => {
          const rowNumber = index + 2; // +1 for 0-index, +1 for header
          const rowErrors = [];

          const title = String(row.title || '').trim();
          if (!title) {
            rowErrors.push('Missing product title');
          }

          const price = parseFloat(row.price);
          if (isNaN(price) || price <= 0) {
            rowErrors.push(`Invalid price "${row.price}"`);
          }

          const stock = parseInt(row.stock, 10);
          const validStock = isNaN(stock) || stock < 0 ? 10 : stock;

          // Determine category_id
          let category_id = null;
          const catName = String(row.category_name || row.category || '').trim().toLowerCase();
          if (catName && categoryMap.has(catName)) {
            category_id = categoryMap.get(catName);
          } else if (categories.length > 0) {
            category_id = categories[0].id; // Fallback to first available category
          }

          // Gather images
          const images = [];
          ['image_url_1', 'image_url_2', 'image_url_3', 'image_url_4'].forEach(key => {
            if (row[key] && String(row[key]).trim().startsWith('http')) {
              images.push(String(row[key]).trim());
            }
          });
          if (images.length === 0) {
            images.push('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800');
          }

          if (rowErrors.length > 0) {
            errors.push(`Row ${rowNumber} ("${title || 'Unknown'}"): ${rowErrors.join(', ')}`);
          } else {
            validProducts.push({
              title,
              category_id,
              price,
              compare_price: parseFloat(row.compare_price) || Math.round(price * 1.3),
              stock: validStock,
              volume: String(row.volume || '50ml').trim(),
              concentration: String(row.concentration || 'Extrait de Parfum (25% Oil)').trim(),
              gender: String(row.gender || 'Unisex').trim(),
              inspired_by: String(row.inspired_by || '').trim(),
              description: String(row.description || `Crafted for discerning connoisseurs by Kochee Haute Parfumerie.`).trim(),
              top_notes: String(row.top_notes || '').trim(),
              heart_notes: String(row.heart_notes || '').trim(),
              base_notes: String(row.base_notes || '').trim(),
              longevity: String(row.longevity || '10-12 Hours').trim(),
              projection: String(row.projection || 'Strong').trim(),
              images,
              is_featured: Number(row.is_featured) === 1 ? 1 : 0,
              is_best_seller: Number(row.is_best_seller) === 1 ? 1 : 0
            });
          }
        });

        resolve({ validProducts, errors });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}


const Category = require('../../models/Categories');
const { dbConnect, isConnected } = require('../../utils/dbConnect');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Chỉ connect nếu chưa connected


  if (!isConnected()) {


    await dbConnect();


  }
  const { method, query, body } = req;
  const { id } = query;

  if (method === 'GET') {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({ categories });
  }
  if (method === 'POST') {
    const { name, description } = body;
    if (!name) return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = new Category({ name, description, slug });
    await category.save();
    return res.status(201).json({ message: 'Tạo danh mục thành công', category });
  }
  if (method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'Thiếu id' });
    const { name, description } = body;
    let update = { description, updatedAt: Date.now() };
    if (name) {
      update.name = name;
      update.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const category = await Category.findByIdAndUpdate(id, update, { new: true });
    return res.status(200).json({ message: 'Cập nhật danh mục thành công', category });
  }
  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Thiếu id' });
    await Category.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Xóa danh mục thành công' });
  }
  res.status(405).json({ message: 'Method not allowed' });
}; 
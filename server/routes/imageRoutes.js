const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Image = require('../models/Image');

// Upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file để tải lên' });
    }

    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    await image.save();

    res.status(201).json({
      success: true,
      message: 'Tải ảnh lên thành công',
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải ảnh lên',
      error: error.message
    });
  }
});

// Get all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách ảnh',
      error: error.message
    });
  }
});

// Get images by tin dang ID
router.get('/tindang/:id', async (req, res) => {
  try {
    const images = await Image.find({ tin_dang_id: req.params.id }).sort({ thu_tu: 1 });
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy ảnh tin đăng',
      error: error.message
    });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ảnh'
      });
    }
    res.json({
      success: true,
      message: 'Xóa ảnh thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh',
      error: error.message
    });
  }
});

module.exports = router;
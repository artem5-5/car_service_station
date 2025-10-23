const Part = require('../models/Part');

exports.getAllParts = async (req, res) => {
  try {
    const parts = await Part.findAll();
    res.json({
      success: true,
      data: parts,
      count: parts.length
    });
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parts'
    });
  }
};

exports.getPartById = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({
        success: false,
        error: 'Part not found'
      });
    }
    res.json({
      success: true,
      data: part
    });
  } catch (error) {
    console.error('Error fetching part:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch part'
    });
  }
};

exports.getLowStockParts = async (req, res) => {
  try {
    const parts = await Part.findLowStock();
    res.json({
      success: true,
      data: parts,
      count: parts.length
    });
  } catch (error) {
    console.error('Error fetching low stock parts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch low stock parts'
    });
  }
};

exports.createPart = async (req, res) => {
  try {
    const part = await Part.create(req.body);
    res.status(201).json({
      success: true,
      data: part,
      message: 'Part created successfully'
    });
  } catch (error) {
    console.error('Error creating part:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create part'
    });
  }
};

exports.updatePart = async (req, res) => {
  try {
    const part = await Part.update(req.params.id, req.body);
    res.json({
      success: true,
      data: part,
      message: 'Part updated successfully'
    });
  } catch (error) {
    console.error('Error updating part:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update part'
    });
  }
};

exports.deletePart = async (req, res) => {
  try {
    await Part.delete(req.params.id);
    res.json({
      success: true,
      message: 'Part deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting part:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete part'
    });
  }
};
const Financial = require('../models/Financial');

exports.getFinancialOperations = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    console.log('📊 Filter params:', { startDate, endDate, type });

    // Подготавливаем параметры для фильтрации
    const filterParams = {};
    
    if (startDate) {
      filterParams.startDate = startDate;
      console.log('✅ Start date filter:', startDate);
    }
    
    if (endDate) {
      filterParams.endDate = endDate;
      console.log('✅ End date filter:', endDate);
    }
    
    if (type && (type === 'income' || type === 'expense')) {
      filterParams.type = type;
      console.log('✅ Type filter:', type);
    }

    const operations = await Financial.findAll(filterParams);
    const summary = await Financial.getSummary(filterParams);

    console.log(`📈 Found ${operations.length} operations`);

    res.json({
      success: true,
      data: {
        operations,
        summary
      },
      filters: filterParams // Отправляем обратно примененные фильтры для отладки
    });
  } catch (error) {
    console.error('❌ Error fetching financial operations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch financial operations'
    });
  }
};

exports.createFinancialOperation = async (req, res) => {
  try {
    const operationId = await Financial.create(req.body);
    res.status(201).json({
      success: true,
      data: { id: operationId },
      message: 'Financial operation created successfully'
    });
  } catch (error) {
    console.error('Error creating financial operation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create financial operation'
    });
  }
};
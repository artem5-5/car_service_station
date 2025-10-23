import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col,
  Badge,
  Card
} from 'react-bootstrap';
import { financialAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Financial = () => {
  const [operations, setOperations] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: ''
  });
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    related_order_id: ''
  });

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async (filterParams = filters) => {
    try {
      setLoading(true);
      
      const cleanParams = {};
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key] !== '') {
          cleanParams[key] = filterParams[key];
        }
      });
      
      const response = await financialAPI.getOperations(cleanParams);
      setOperations(response.data.operations);
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = () => {
    setFormData({
      type: 'income',
      amount: '',
      description: '',
      category: '',
      related_order_id: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        related_order_id: formData.related_order_id || null
      };

      await financialAPI.createOperation(submitData);
      handleCloseModal();
      loadFinancialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
  };

  const applyFilters = (e) => {
    e?.preventDefault();
    loadFinancialData();
  };

  const clearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      type: ''
    };
    setFilters(clearedFilters);
    loadFinancialData(clearedFilters);
  };

  const getTypeBadge = (type) => {
    return type === 'income' ? 
      <Badge bg="success">Доход</Badge> : 
      <Badge bg="danger">Расход</Badge>;
  };

  const getCategoryBadge = (category) => {
    if (!category) return null;
    
    const categoryColors = {
      'service_income': 'primary',
      'parts_sale': 'info',
      'salary': 'warning',
      'rent': 'secondary',
      'utilities': 'dark',
      'supplies': 'dark',
      'other': 'dark'
    };

    return (
      <Badge bg={categoryColors[category] || 'secondary'} className="text-capitalize">
        {getCategoryText(category)}
      </Badge>
    );
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'service_income': 'Доход от услуг',
      'parts_sale': 'Продажа запчастей',
      'salary': 'Зарплаты',
      'rent': 'Аренда',
      'utilities': 'Коммунальные услуги',
      'supplies': 'Расходные материалы',
      'other': 'Прочее'
    };
    return categoryMap[category] || category;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Финансовые операции</h1>
          <p className="text-muted">
            Управление доходами и расходами автосервиса
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleShowModal}>
            Добавить операцию
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <Card.Title>Доходы</Card.Title>
                  <h3>{formatCurrency(summary.income)} ₽</h3>
                </div>
                <div className="fs-1">📈</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-danger text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <Card.Title>Расходы</Card.Title>
                  <h3>{formatCurrency(summary.expense)} ₽</h3>
                </div>
                <div className="fs-1">📉</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className={`bg-${summary.balance >= 0 ? 'info' : 'warning'} text-white`}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <Card.Title>Баланс</Card.Title>
                  <h3>{formatCurrency(summary.balance)} ₽</h3>
                </div>
                <div className="fs-1">
                  {summary.balance >= 0 ? '💰' : '⚠️'}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Фильтры</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={applyFilters}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>С даты</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>По дату</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Тип операции</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">Все операции</option>
                    <option value="income">Доходы</option>
                    <option value="expense">Расходы</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button variant="primary" type="submit" className="flex-grow-1">
                    Применить
                  </Button>
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    Сбросить
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">История операций</h5>
            <Badge bg="secondary">
              Всего: {operations.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Дата</th>
                  <th>Тип</th>
                  <th>Сумма</th>
                  <th>Описание</th>
                  <th>Категория</th>
                  <th>Связанный заказ</th>
                  <th>Создано</th>
                </tr>
              </thead>
              <tbody>
                {operations.map(operation => (
                  <tr key={operation.id}>
                    <td>
                      <strong>{formatDate(operation.operation_date)}</strong>
                    </td>
                    <td>{getTypeBadge(operation.type)}</td>
                    <td>
                      <span className={operation.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                        {operation.type === 'income' ? '+' : '-'}{formatCurrency(operation.amount)} ₽
                      </span>
                    </td>
                    <td>
                      {operation.description || (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {getCategoryBadge(operation.category)}
                    </td>
                    <td>
                      {operation.related_order_id ? (
                        <Badge bg="outline-primary">
                          Заказ #{operation.related_order_id}
                        </Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(operation.created_at).toLocaleDateString('ru-RU')}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {operations.length === 0 && (
              <div className="text-center py-5">
                <div className="fs-1 text-muted mb-3">💸</div>
                <p className="text-muted">Нет финансовых операций</p>
                <Button variant="primary" onClick={handleShowModal}>
                  Добавить первую операцию
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Добавить финансовую операцию</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Тип операции *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Сумма (₽) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Описание *</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Например: Замена масла Toyota Camry, Зарплата механика..."
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Категория *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    <optgroup label="Доходы">
                      <option value="service_income">Доход от услуг</option>
                      <option value="parts_sale">Продажа запчастей</option>
                    </optgroup>
                    <optgroup label="Расходы">
                      <option value="salary">Зарплаты</option>
                      <option value="rent">Аренда</option>
                      <option value="utilities">Коммунальные услуги</option>
                      <option value="supplies">Расходные материалы</option>
                      <option value="other">Прочее</option>
                    </optgroup>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Связанный заказ ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="related_order_id"
                    min="1"
                    value={formData.related_order_id}
                    onChange={handleChange}
                    placeholder="Необязательно"
                  />
                  <Form.Text className="text-muted">
                    ID заказа, если операция связана с конкретным заказом
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {formData.amount && formData.description && (
              <Alert variant={formData.type === 'income' ? 'success' : 'danger'}>
                <h6>Предпросмотр операции:</h6>
                <p className="mb-1">
                  <strong>{formData.type === 'income' ? '📈 Доход' : '📉 Расход'}:</strong>{' '}
                  {formData.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(formData.amount))} ₽
                </p>
                <p className="mb-1">
                  <strong>Описание:</strong> {formData.description}
                </p>
                {formData.category && (
                  <p className="mb-0">
                    <strong>Категория:</strong> {getCategoryBadge(formData.category)}
                  </p>
                )}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Добавить операцию
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Financial;
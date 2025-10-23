import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col,
  Badge
} from 'react-bootstrap';
import { partsAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    part_number: '',
    manufacturer: '',
    price: '',
    quantity: '',
    min_quantity: '5',
    location: ''
  });

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      setLoading(true);
      const response = await partsAPI.getAll();
      setParts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (part = null) => {
    if (part) {
      setEditingPart(part);
      setFormData({
        name: part.name,
        category_id: part.category_id || '',
        part_number: part.part_number || '',
        manufacturer: part.manufacturer || '',
        price: part.price,
        quantity: part.quantity,
        min_quantity: part.min_quantity,
        location: part.location || ''
      });
    } else {
      setEditingPart(null);
      setFormData({
        name: '',
        category_id: '',
        part_number: '',
        manufacturer: '',
        price: '',
        quantity: '',
        min_quantity: '5',
        location: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPart(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Преобразуем числовые поля
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        min_quantity: parseInt(formData.min_quantity),
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };

      if (editingPart) {
        await partsAPI.update(editingPart.id, submitData);
      } else {
        await partsAPI.create(submitData);
      }
      handleCloseModal();
      loadParts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту деталь?')) {
      try {
        await partsAPI.delete(id);
        loadParts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStockStatus = (part) => {
    if (part.quantity === 0) {
      return <Badge bg="danger">Нет в наличии</Badge>;
    } else if (part.quantity <= part.min_quantity) {
      return <Badge bg="warning">Низкий запас</Badge>;
    } else {
      return <Badge bg="success">В наличии</Badge>;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Управление деталями</h1>
          <p className="text-muted">
            Всего деталей на складе: {parts.reduce((sum, part) => sum + part.quantity, 0)}
            {', '}
            Деталей с низким запасом: {parts.filter(part => part.quantity <= part.min_quantity).length}
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            Добавить деталь
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>
        {error}
      </Alert>}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Производитель</th>
              <th>Артикул</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Мин. запас</th>
              <th>Статус</th>
              <th>Место</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part.id} className={part.quantity <= part.min_quantity ? 'table-warning' : ''}>
                <td>{part.id}</td>
                <td>
                  <strong>{part.name}</strong>
                </td>
                <td>{part.category_name || '-'}</td>
                <td>{part.manufacturer || '-'}</td>
                <td>{part.part_number || '-'}</td>
                <td>
                  <strong>{part.price} ₽</strong>
                </td>
                <td>
                  <span className={part.quantity === 0 ? 'text-danger fw-bold' : ''}>
                    {part.quantity}
                  </span>
                </td>
                <td>{part.min_quantity}</td>
                <td>{getStockStatus(part)}</td>
                <td>{part.location || '-'}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowModal(part)}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(part.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {parts.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">Нет деталей в базе данных</p>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Добавить первую деталь
            </Button>
          </div>
        )}
      </div>

      {/* Модальное окно для добавления/редактирования */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPart ? 'Редактировать деталь' : 'Добавить новую деталь'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Название детали *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Например: Тормозные колодки передние"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Категория ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    placeholder="1-5"
                    min="1"
                    max="5"
                  />
                  <Form.Text className="text-muted">
                    Доступные категории: 1-Двигатель, 2-Тормоза, 3-Подвеска, 4-Электрика, 5-Фильтры
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Производитель</Form.Label>
                  <Form.Control
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="Например: Bosch, Brembo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Артикул</Form.Label>
                  <Form.Control
                    type="text"
                    name="part_number"
                    value={formData.part_number}
                    onChange={handleChange}
                    placeholder="Например: BP123, OF456"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Цена (₽) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Количество *</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Мин. запас *</Form.Label>
                  <Form.Control
                    type="number"
                    name="min_quantity"
                    min="0"
                    value={formData.min_quantity}
                    onChange={handleChange}
                    placeholder="5"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Место хранения</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Например: Стеллаж A-1, Полка 2"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              {editingPart ? 'Обновить деталь' : 'Добавить деталь'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Parts;
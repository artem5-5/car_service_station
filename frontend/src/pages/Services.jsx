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
  Badge
} from 'react-bootstrap';
import { servicesAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    category: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || '',
        price: service.price,
        duration_minutes: service.duration_minutes || '',
        category: service.category || ''
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration_minutes: '',
        category: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null
      };

      if (editingService) {
        await servicesAPI.update(editingService.id, submitData);
      } else {
        await servicesAPI.create(submitData);
      }
      handleCloseModal();
      loadServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        await servicesAPI.delete(id);
        loadServices();
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

  const getCategoryBadge = (category) => {
    if (!category) return null;
    
    const categoryColors = {
      'Техобслуживание': 'primary',
      'Ремонт': 'warning',
      'Диагностика': 'info',
      'Регулировка': 'success',
      'Шиномонтаж': 'secondary',
      'Кузовные работы': 'danger'
    };

    return (
      <Badge bg={categoryColors[category] || 'secondary'}>
        {category}
      </Badge>
    );
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Управление услугами</h1>
          <p className="text-muted">
            Всего услуг: {services.length}
            {', '}
            Средняя цена: {services.length > 0 ? (services.reduce((sum, service) => sum + parseFloat(service.price), 0) / services.length).toFixed(2) : 0} ₽
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            Добавить услугу
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Название услуги</th>
              <th>Описание</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Длительность</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>
                  <strong>{service.name}</strong>
                </td>
                <td>
                  {service.description ? (
                    <small className="text-muted">{service.description}</small>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  {getCategoryBadge(service.category)}
                </td>
                <td>
                  <strong className="text-success">{service.price} ₽</strong>
                </td>
                <td>
                  {formatDuration(service.duration_minutes)}
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowModal(service)}
                      title="Редактировать"
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      title="Удалить"
                    >
                      🗑️
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {services.length === 0 && (
          <div className="text-center py-4">
            <div className="fs-1 text-muted mb-3">🔧</div>
            <p className="text-muted">Нет услуг в базе данных</p>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Добавить первую услугу
            </Button>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingService ? 'Редактировать услугу' : 'Добавить новую услугу'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Название услуги *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: Замена масла, Диагностика двигателя"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание услуги</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Подробное описание услуги, что входит в работу..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Длительность (минуты)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration_minutes"
                    min="0"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    placeholder="Например: 60"
                  />
                  <Form.Text className="text-muted">
                    Оставьте пустым, если длительность не определена
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Выберите категорию</option>
                <option value="Техобслуживание">Техобслуживание</option>
                <option value="Ремонт">Ремонт</option>
                <option value="Диагностика">Диагностика</option>
                <option value="Регулировка">Регулировка</option>
                <option value="Шиномонтаж">Шиномонтаж</option>
                <option value="Кузовные работы">Кузовные работы</option>
                <option value="Электрика">Электрика</option>
                <option value="Двигатель">Двигатель</option>
              </Form.Select>
            </Form.Group>

            {formData.name && (
              <Alert variant="light" className="mt-3">
                <h6>Предпросмотр:</h6>
                <p className="mb-1">
                  <strong>{formData.name}</strong>
                  {formData.price && ` - ${formData.price} ₽`}
                  {formData.duration_minutes && ` (${formatDuration(formData.duration_minutes)})`}
                </p>
                {formData.category && (
                  <p className="mb-1">
                    Категория: {getCategoryBadge(formData.category)}
                  </p>
                )}
                {formData.description && (
                  <p className="mb-0 text-muted small">
                    {formData.description}
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
              {editingService ? 'Обновить услугу' : 'Добавить услугу'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Services;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { employeeAPI, partsAPI, servicesAPI, ordersAPI, financialAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalParts: 0,
    totalPartsItems: 0,
    totalServices: 0,
    activeOrders: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyBalance: 0,
    lowStockParts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [employees, parts, services, orders, financial] = await Promise.all([
        employeeAPI.getAll(),
        partsAPI.getAll(),
        servicesAPI.getAll(),
        ordersAPI.getAll(),
        financialAPI.getOperations({ 
          startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString().split('T')[0] 
        })
      ]);

      const activeOrders = orders.data.filter(order => 
        order.status !== 'completed' && order.status !== 'cancelled'
      );

      const lowStockParts = parts.data.filter(part => 
        part.quantity <= part.min_quantity
      );

      const averageServicePrice = services.data.length > 0 
        ? (services.data.reduce((sum, service) => sum + parseFloat(service.price), 0) / services.data.length).toFixed(2)
        : 0;

      const financialSummary = financial.data?.summary || { income: 0, expense: 0, balance: 0 };

      setStats({
        totalEmployees: employees.data.length,
        totalParts: parts.data.length,
        totalPartsItems: parts.data.reduce((sum, part) => sum + part.quantity, 0),
        totalServices: services.data.length,
        averageServicePrice: averageServicePrice,
        activeOrders: activeOrders.length,
        monthlyIncome: financialSummary.income || 0,
        monthlyExpense: financialSummary.expense || 0,
        monthlyBalance: financialSummary.balance || 0,
        lowStockParts,
        recentOrders: orders.data.slice(0, 5)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Главная панель</h1>
        <Button variant="outline-primary" onClick={refreshData}>
          🔄 Обновить
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col xl={2} lg={4} md={5} className="mb-3">
          <Card className="text-white bg-primary h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="display-6">{stats.totalEmployees}</Card.Title>
                  <Card.Text>Сотрудников</Card.Text>
                </div>
                <div className="fs-1">👥</div>
              </div>
              <Button 
                as={Link} 
                to="/employees" 
                variant="outline-light" 
                size="sm" 
                className="mt-auto"
              >
                Управление →
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={2} lg={4} md={5} className="mb-3">
          <Card className="text-white bg-success h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="display-6">{stats.totalParts}</Card.Title>
                  <Card.Text>Наименований деталей</Card.Text>
                  <small>Всего: {stats.totalPartsItems} шт.</small>
                </div>
                <div className="fs-1">🔧</div>
              </div>
              <Button 
                as={Link} 
                to="/parts" 
                variant="outline-light" 
                size="sm" 
                className="mt-auto"
              >
                Управление →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} lg={4} md={5} className="mb-3">
          <Card className="text-white bg-info h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="display-6">{stats.totalServices}</Card.Title>
                  <Card.Text>Услуг</Card.Text>
                  <small>Средняя цена: {stats.averageServicePrice} ₽</small>
                </div>
                <div className="fs-1">🛠️</div>
              </div>
              <Button 
                as={Link} 
                to="/services" 
                variant="outline-light" 
                size="sm" 
                className="mt-auto"
              >
                Управление →
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={2} lg={4} md={5} className="mb-3">
          <Card className="text-white bg-warning h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="display-6">{stats.activeOrders}</Card.Title>
                  <Card.Text>Активных заказов</Card.Text>
                </div>
                <div className="fs-1">📋</div>
              </div>
              <Button 
                as={Link} 
                to="/orders" 
                variant="outline-light" 
                size="sm" 
                className="mt-auto"
              >
                Управление →
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={2} lg={4} md={5} className="mb-3">
          <Card className={`text-white bg-${stats.monthlyBalance >= 0 ? 'success' : 'danger'} h-100`}>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="display-6">{formatCurrency(stats.monthlyBalance)} ₽</Card.Title>
                  <Card.Text>Баланс за месяц</Card.Text>
                  <small>
                    Доход: {formatCurrency(stats.monthlyIncome)} ₽
                    <br />
                    Расход: {formatCurrency(stats.monthlyExpense)} ₽
                  </small>
                </div>
                <div className="fs-1">
                  {stats.monthlyBalance >= 0 ? '💰' : '⚠️'}
                </div>
              </div>
              <Button 
                as={Link} 
                to="/financial" 
                variant="outline-light" 
                size="sm" 
                className="mt-auto"
              >
                Детали →
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">⚠️ Детали с низким запасом</h5>
              <Badge bg="warning">{stats.lowStockParts.length}</Badge>
            </Card.Header>
            <Card.Body>
              {stats.lowStockParts.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <div className="fs-1">✅</div>
                  <p className="mb-0">Все детали в норме</p>
                </div>
              ) : (
                <>
                  {stats.lowStockParts.map(part => (
                    <Alert key={part.id} variant="warning" className="p-3 mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{part.name}</strong>
                          <br />
                          <small>
                            Остаток: <strong>{part.quantity} шт.</strong> 
                            (мин: {part.min_quantity} шт.)
                          </small>
                          {part.manufacturer && (
                            <div>
                              <small className="text-muted">
                                Производитель: {part.manufacturer}
                              </small>
                            </div>
                          )}
                        </div>
                        <Button 
                          as={Link} 
                          to="/parts" 
                          variant="outline-warning" 
                          size="sm"
                        >
                          Пополнить
                        </Button>
                      </div>
                    </Alert>
                  ))}
                  <div className="text-center">
                    <Button as={Link} to="/parts" variant="warning">
                      Перейти к управлению деталями
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📋 Последние заказы</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentOrders.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <div className="fs-1">📭</div>
                  <p className="mb-0">Нет заказов</p>
                </div>
              ) : (
                <>
                  {stats.recentOrders.map(order => (
                    <div key={order.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>Заказ #{order.id}</strong>
                          <br />
                          <small>
                            Клиент: {order.client_first_name} {order.client_last_name}
                          </small>
                          <br />
                          <small>
                            Статус: <Badge bg={getStatusBadgeColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </small>
                        </div>
                        <div className="text-end">
                          <strong>{order.total_amount || 0} ₽</strong>
                          <br />
                          <small className="text-muted">
                            {new Date(order.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Button as={Link} to="/orders" variant="primary">
                      Все заказы
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Ожидание',
    'in_progress': 'В работе',
    'completed': 'Завершен',
    'cancelled': 'Отменен'
  };
  return statusMap[status] || status;
};

const getStatusBadgeColor = (status) => {
  const colorMap = {
    'pending': 'secondary',
    'in_progress': 'warning',
    'completed': 'success',
    'cancelled': 'danger'
  };
  return colorMap[status] || 'secondary';
};

const Badge = ({ bg, children }) => (
  <span className={`badge bg-${bg}`}>{children}</span>
);

export default Dashboard;
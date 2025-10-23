import React from 'react';
import { Container, Alert, Card } from 'react-bootstrap';

const Orders = () => {
  return (
    <Container>
      <div className="mb-4">
        <h1>Управление заказами</h1>
        <p className="text-muted">
          Раздел находится в разработке
        </p>
      </div>

      <Alert variant="info" className="mb-4">
        <Alert.Heading>🚧 Страница в разработке</Alert.Heading>
        <p>
          Функционал управления заказами будет добавлен в ближайшее время.
          Здесь будет возможность создавать новые заказы, отслеживать их статус 
          и управлять процессом обслуживания клиентов.
        </p>
        <hr />
        <p className="mb-0">
          Планируемые функции: создание заказов, назначение сотрудников, 
          учет использованных деталей и услуг, отслеживание статусов.
        </p>
      </Alert>

      <div className="row">
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📋 Новые заказы</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <div className="fs-1 text-muted mb-3">⏳</div>
              <p className="text-muted">Функционал будет добавлен позже</p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">🔧 Заказы в работе</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <div className="fs-1 text-muted mb-3">🛠️</div>
              <p className="text-muted">Функционал будет добавлен позже</p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">✅ Завершенные заказы</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <div className="fs-1 text-muted mb-3">🎯</div>
              <p className="text-muted">Функционал будет добавлен позже</p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📊 Статистика заказов</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <div className="fs-1 text-muted mb-3">📈</div>
              <p className="text-muted">Функционал будет добавлен позже</p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Orders;
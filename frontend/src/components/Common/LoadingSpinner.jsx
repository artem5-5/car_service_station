import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
    </Container>
  );
};

export default LoadingSpinner;
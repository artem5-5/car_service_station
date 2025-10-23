import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const AppNavbar = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🚗 СТО НЕКСТ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              Главная
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/employees"
              active={location.pathname === "/employees"}
            >
              Сотрудники
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/parts"
              active={location.pathname === "/parts"}
            >
              Детали
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/services"
              active={location.pathname === "/services"}
            >
              Услуги
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/financial"
              active={location.pathname === "/financial"}
            >
              Финансы
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/orders"
              active={location.pathname === "/orders"}
            >
              Заказы
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

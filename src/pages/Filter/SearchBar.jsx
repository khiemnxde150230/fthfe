import React from 'react';
import { Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';

const SearchBar = () => {
    return (
        <Container className="my-3">
            <Row>
                <Col>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Tìm kiếm"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light">Tìm kiếm</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SearchBar;
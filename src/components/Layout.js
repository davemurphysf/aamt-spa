import React from 'react';
import { Col, Grid, Row, Nav, Navbar, NavItem } from 'react-bootstrap';

export default props => (
    <div>
        <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#brand">Azure Analyze My Tweets Demo</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <NavItem eventKey={1} href="#">
                        Link Right
                    </NavItem>
                    <NavItem eventKey={2} href="#">
                        Link Right
                    </NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Grid>
            <Row>
                <Col smOffset={1} sm={10}>
                    {props.children}
                </Col>
            </Row>
        </Grid>
    </div>
);

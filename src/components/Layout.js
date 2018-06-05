import React from 'react';
import { Col, Grid, Row, Nav, Navbar, NavItem } from 'react-bootstrap';
import StatsComponent from "./StatsComponent";

export default props => (
    <div>
        <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    Azure Analyze My Tweets Demo
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <NavItem href={'https://github.com/davemurphysf/aamt-spa'}>
                        <i className="fa fa-github" aria-hidden="true"></i> SPA
                    </NavItem>
                    <NavItem href={'https://github.com/davemurphysf/aamt-functions'}>
                        <i className="fa fa-github" aria-hidden="true"></i> Functions
                    </NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Grid>
            <Row>
                <Col sm={8}>
                    {props.children}
                </Col>
                <StatsComponent />
            </Row>
        </Grid>
    </div>
);

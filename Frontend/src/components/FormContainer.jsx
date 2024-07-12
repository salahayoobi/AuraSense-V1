import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
Container

const FormContainer = ({children}) => {
  return (
    <Container >
        <Row className='justify-content-md-center mt-0'>
            <Col xs={ 12 } md={ 6 } className='card p-5' style={{ backgroundColor: '#c1c1c1' }}>
            { children }
            </Col>
        </Row>
    </Container>
  )
}

export default FormContainer

import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import Product from '../components/Product'
// import logger from 'use-reducer-logger'
import { Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state

    }
}

function HomeScreen() {

    const [{ loading, error, products }, dispatch] = useReducer((reducer), {
        loading: true,
        error: '',
        products: []
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const result = await axios.get('/api/products')
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
                // console.log(result)
                // console.log(result.data)
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }
        }
        fetchData()
    }, [])

    return (
        <div>
            <Helmet>
                <title>Billu's Store</title>
            </Helmet>
            <h1>Featured Products</h1>
            <div className="products">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <Row>
                        {products.map((product) => (
                            <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                <Product product={product}></Product>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    )
}

export default HomeScreen
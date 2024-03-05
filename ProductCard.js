import { Card, Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';

function ProductCard() {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <Card style={{ width: "18rem" }}>
            <Card.Body>
                {editing === false ?
                    <>
                        <Card.Title>Product Name</Card.Title>
                        <Card.Text>Product Description</Card.Text>
                        <Button variant="danger">Delete Product</Button>
                        <Button variant="secondary" onClick={() => setEditing(true)}>Edit Product</Button>
                    </>
                    :
                    <>
                        <h4>Editing Product</h4>
                        <Button size="sm" onClick={() => setEditing(false)}>Go Back</Button>
                        <br></br>
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            id="description"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <br></br>
                        <Button>Create Product in Supabase DB</Button>
                    </>
                }
            </Card.Body>
        </Card>
    )
}

export default ProductCard;

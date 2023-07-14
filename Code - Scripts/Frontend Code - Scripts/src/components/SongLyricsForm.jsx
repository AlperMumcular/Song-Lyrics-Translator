import React from 'react'
import Form from "react-bootstrap/Form";


export default function SongLyricsForm() {
  return (
    <Form>
        
      <Form.Group style={{width:'40%', marginLeft:'50px'}} className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Song Lyrics</Form.Label>
        <Form.Control as="textarea" rows={50} />
      </Form.Group>
    </Form>
  );
}

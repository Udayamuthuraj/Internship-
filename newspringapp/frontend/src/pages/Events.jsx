import './CustomTabs.css';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Card,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import axios from 'axios';

function EventCard({ event, isPast = false }) {
  return (
    <Card className="mb-4 shadow border-0">
      <Row className="g-0">
        <Col md={4}>
          <Card.Img src={event.image} className="h-100 w-100 object-fit-cover" />
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>{event.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{event.date}</Card.Subtitle>
            <Card.Text>{event.desc}</Card.Text>
            {isPast ? (
              <Button variant="outline-secondary">View Recap</Button>
            ) : (
              <Button variant="primary">Register</Button>
            )}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

function EventPage() {
  const [key, setKey] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const today = new Date();

  const upcoming = events.filter(e => new Date(e.date) >= today);
  const past = events.filter(e => new Date(e.date) < today);
  const allEvents = [...upcoming, ...past];

  const filter = (list) =>
    list.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <img src="/images/unom1.jpg" alt="College Logo" height="70" className="mb-3" />
        <h2 className="fw-bold text-white">Alumni Event Portal</h2>
        <p className="text-light">Celebrate, Connect, Contribute</p>
        <InputGroup className="my-3 w-50 mx-auto">
          <FormControl
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="dark" onClick={() => setSearch('')}>Clear</Button>
        </InputGroup>
      </div>

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4 justify-content-center"
        fill
      >
        <Tab eventKey="upcoming" title="Upcoming Events">
          {filter(upcoming).map((e, i) => (
            <EventCard key={i} event={e} />
          ))}
        </Tab>
        <Tab eventKey="past" title="Past Events">
          {filter(past).map((e, i) => (
            <EventCard key={i} event={e} isPast />
          ))}
        </Tab>
        <Tab eventKey="all" title="All Events">
          {filter(allEvents).map((e, i) => (
            <EventCard key={i} event={e} isPast={new Date(e.date) < today} />
          ))}
        </Tab>
      </Tabs>
    </Container>
  );
}

export default EventPage;

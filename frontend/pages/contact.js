import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'danger', message: 'Please fill in all required fields.' });
      return;
    }
    // Simulate API Call
    setTimeout(() => {
      setStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <Layout title="Contact Us | Digital Career Advisor">
      <Head>
        <title>Contact Us — Get In Touch</title>
      </Head>

      <div style={{ background: 'var(--light)', minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)', padding: '4rem 0 4rem', color: 'white', position: 'relative', overflow: 'hidden', borderRadius: '0 0 32px 32px' }}>
          <div className="container position-relative" style={{ zIndex: 2, textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '3rem', marginBottom: '1rem' }}>
              Get in <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Touch</span>
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
              Have questions or need support? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 3 }}>
          <Row className="g-4">
            <Col lg={4}>
              <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ background: 'white', padding: '2.5rem' }}>
                  <h4 className="fw-bold mb-4" style={{ fontFamily: 'Outfit' }}>Contact Information</h4>
                  <p className="text-muted mb-5">Fill up the form and our team will get back to you within 24 hours.</p>
                  
                  <div className="d-flex align-items-center mb-4">
                    <div style={{ width: '45px', height: '45px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', color: 'var(--primary)' }}>
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div>
                      <p className="mb-0 text-muted small fw-semibold text-uppercase">Phone</p>
                      <p className="mb-0 fw-bold">+91 1800 123 4567</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <div style={{ width: '45px', height: '45px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', color: 'var(--primary)' }}>
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div>
                      <p className="mb-0 text-muted small fw-semibold text-uppercase">Email</p>
                      <p className="mb-0 fw-bold">support@educationadvisor.in</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div style={{ width: '45px', height: '45px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', color: 'var(--primary)' }}>
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <p className="mb-0 text-muted small fw-semibold text-uppercase">Office</p>
                      <p className="mb-0 fw-bold">Innovation Hub, New Delhi, 110001</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col lg={8}>
              <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ background: 'white', padding: '2.5rem' }}>
                  <h4 className="fw-bold mb-4" style={{ fontFamily: 'Outfit' }}>Send us a Message</h4>
                  
                  {status && (
                    <Alert variant={status.type} onClose={() => setStatus(null)} dismissible className="rounded-3 border-0 shadow-sm">
                      {status.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold small">Full Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold small">Email Address <span className="text-danger">*</span></Form.Label>
                          <Form.Control type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold small">Subject</Form.Label>
                          <Form.Control type="text" placeholder="How can we help?" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} style={{ padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold small">Message <span className="text-danger">*</span></Form.Label>
                          <Form.Control as="textarea" rows={5} placeholder="Write your message here..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', resize: 'none' }} />
                        </Form.Group>
                      </Col>
                      <Col md={12} className="text-end">
                        <Button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '0.75rem 2rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                          <i className="bi bi-send-fill me-2"></i> Send Message
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;

import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Layout title="About Us | Digital Career Advisor">
      <Head>
        <title>About Us — Digital Educational & Career Advisor</title>
        <meta name="description" content="Learn more about our mission to empower Indian students with the right educational and career opportunities." />
      </Head>

      <div style={{ background: 'var(--light)', minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)', padding: '4rem 0 4rem', color: 'white', position: 'relative', overflow: 'hidden', borderRadius: '0 0 32px 32px' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', animation: 'heroGlow 8s ease-in-out infinite' }}></div>
          <div className="container position-relative" style={{ zIndex: 2, textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', backdropFilter: 'blur(10px)' }}>
              <i className="bi bi-info-circle-fill me-2"></i>About Us
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.1 }}>
              Our <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Story</span> & Mission
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
              Empowering students across India with personalized career guidance, college admissions info, and scholarship opportunities.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 3 }}>
          <Card className="border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ background: 'white', padding: '3rem' }}>
              <Row className="g-5 align-items-center">
                <Col lg={6}>
                  <h3 className="fw-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--primary-dark)' }}>Who We Are</h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--dark-600)', lineHeight: 1.8 }}>
                    The <strong>Digital Career & Education Advisor</strong> is a comprehensive AI-powered platform designed specifically to guide students through the complexities of career planning and higher education.
                  </p>
                  <p style={{ fontSize: '1.05rem', color: 'var(--dark-600)', lineHeight: 1.8 }}>
                    We started with a vision to democratize access to high-quality career advice. Often, students in Tier-2 and Tier-3 cities lack the proper guidance to make informed decisions about their college and professional futures. Our platform bridges this gap by combining cutting-edge AI with rich data on colleges, scholarships, and real-world mentor networks.
                  </p>
                </Col>
                <Col lg={6}>
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students learning" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                </Col>
              </Row>

              <hr className="my-5" style={{ opacity: 0.1 }} />

              <Row className="g-4 text-center">
                <Col md={4}>
                  <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px' }}>
                    <i className="bi bi-eye text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
                    <h4 className="fw-bold">Our Vision</h4>
                    <p className="text-muted mb-0">To ensure every student in India has free access to personalized, state-of-the-art career guidance and resources.</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px' }}>
                    <i className="bi bi-bullseye text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
                    <h4 className="fw-bold">Our Mission</h4>
                    <p className="text-muted mb-0">To leverage AI technology to map students' unique skills to their ideal career paths and match them with the right educational institutions.</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px' }}>
                    <i className="bi bi-heart text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
                    <h4 className="fw-bold">Core Values</h4>
                    <p className="text-muted mb-0">Inclusivity, innovation, transparency, and a relentless focus on student success above all else.</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

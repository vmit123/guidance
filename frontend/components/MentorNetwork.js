import React from 'react';
import { useRouter } from 'next/router';
import { Card, Button, Row, Col } from 'react-bootstrap';

const mentorsPreview = [
  {
    id: 1,
    name: 'Dr. Raghuram Rajan',
    role: 'Economics & Career Strategy',
    title: 'Former RBI Governor',
    expertise: ['Economics', 'Finance Careers', 'Public Policy'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    sessions: 1200,
    availability: 'Limited'
  },
  {
    id: 3,
    name: 'Prof. Ashish Nanda',
    role: 'Management & Leadership',
    title: 'Former Director, IIM Ahmedabad',
    expertise: ['MBA Admissions', 'Leadership', 'Consulting'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    sessions: 2100,
    availability: 'Available'
  },
  {
    id: 4,
    name: 'Sudha Murty',
    role: 'Education & Social Impact',
    title: 'Chairperson, Infosys Foundation',
    expertise: ['Engineering', 'Scholarships', 'Women Empowerment'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    sessions: 3200,
    availability: 'Available'
  },
  {
    id: 7,
    name: 'Kunal Shah',
    role: 'Fintech & Startups',
    title: 'Founder & CEO, CRED',
    expertise: ['Fintech', 'Product Management', 'Startups'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    sessions: 480,
    availability: 'Available'
  }
];

const MentorNetwork = () => {
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/mentors');
  };

  const getAvailabilityStyle = (avail) => {
    if (avail === 'Available') return { bg: '#10b981', glow: 'rgba(16,185,129,0.4)' };
    if (avail === 'Limited') return { bg: '#f59e0b', glow: 'rgba(245,158,11,0.4)' };
    return { bg: '#ef4444', glow: 'rgba(239,68,68,0.4)' };
  };

  return (
    <div id="mentors" style={{ padding: '5rem 0', background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(99,102,241,0.08)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem', border: '1px solid rgba(99,102,241,0.15)' }}>
            <i className="bi bi-people-fill me-2"></i>Expert Mentorship
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--dark)' }}>
            Learn from India's <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Top Leaders</span>
          </h2>
          <p className="lead" style={{ color: 'var(--dark-600)', maxWidth: '600px', margin: '0 auto' }}>
            Get direct career guidance from renowned industry leaders, professors, and entrepreneurs
          </p>
        </div>

        <Row className="g-4">
          {mentorsPreview.map((mentor, idx) => {
            const availStyle = getAvailabilityStyle(mentor.availability);
            return (
              <Col lg={3} md={6} key={mentor.id}>
                <Card
                  className="h-100 border-0"
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onClick={() => router.push('/mentors')}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(99,102,241,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                >
                  {/* Top gradient band */}
                  <div style={{ height: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #06b6d4)', transition: 'height 0.3s ease' }}></div>
                  
                  <div className="text-center" style={{ padding: '1.75rem 1.25rem 0' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        style={{
                          width: '90px', height: '90px', borderRadius: '50%',
                          objectFit: 'cover', border: '3px solid white',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
                        }}
                      />
                      <span style={{
                        position: 'absolute', bottom: '4px', right: '4px',
                        width: '14px', height: '14px', borderRadius: '50%',
                        background: availStyle.bg, border: '2.5px solid white',
                        boxShadow: `0 0 6px ${availStyle.glow}`
                      }}></span>
                    </div>

                    <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '2px', fontSize: '1.05rem' }}>{mentor.name}</h5>
                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '2px' }}>{mentor.role}</p>
                    <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>{mentor.title}</p>

                    {/* Rating */}
                    <div className="d-flex align-items-center justify-content-center gap-1 mb-3">
                      <i className="bi bi-star-fill" style={{ color: '#f59e0b', fontSize: '0.8rem' }}></i>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e' }}>{mentor.rating}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>• {mentor.sessions}+ sessions</span>
                    </div>
                  </div>

                  <Card.Body className="pt-0 px-3 pb-2">
                    <div className="d-flex flex-wrap justify-content-center gap-1 mb-3">
                      {mentor.expertise.map((skill, i) => (
                        <span key={i} style={{
                          fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))',
                          color: 'var(--primary-dark)',
                          border: '1px solid rgba(99,102,241,0.1)'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card.Body>

                  <div style={{ padding: '0 1rem 1.25rem' }}>
                    <Button
                      className="w-100"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none', borderRadius: '10px',
                        padding: '0.55rem', fontWeight: 600, fontSize: '0.8rem',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
                        letterSpacing: '0.3px'
                      }}
                      onClick={(e) => { e.stopPropagation(); router.push('/mentors'); }}
                    >
                      <i className="bi bi-calendar-plus me-1"></i>Schedule Session
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        <div className="text-center mt-5">
          <Button 
            onClick={handleViewAll}
            style={{
              background: 'transparent',
              border: '2px solid var(--primary)',
              color: 'var(--primary)',
              borderRadius: '50px',
              padding: '0.75rem 2.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            View All 8 Mentors <i className="bi bi-arrow-right ms-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorNetwork;
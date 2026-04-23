import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Card, Button, Row, Col, Badge, Modal, Form, Alert, InputGroup } from 'react-bootstrap';

// ── Real Indian Career Mentors ──────────────────────────────────
const mentors = [
  {
    id: 1,
    name: 'Ankur Warikoo',
    role: 'Entrepreneurship & Personal Growth',
    title: 'Founder of WebVeda, Content Creator',
    expertise: ['Personal Branding', 'Entrepreneurship', 'Content Creation', 'Time Management'],
    bio: 'Ankur Warikoo is an Internet entrepreneur, bestselling author, and a top content creator in India. He conducts courses on personal growth, entrepreneurship, and management for millions of students.',
    linkedin: 'https://www.linkedin.com/in/warikoo/',
    availability: 'Available',
    rating: 4.8,
    sessions: 2500,
    yearsExp: 15,
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi'],
    nextSlot: '2026-04-15',
    fee: '₹1500 / session',
    specialNote: 'Available for personalized career coaching'
  },
  {
    id: 2,
    name: 'Shradha Sharma',
    role: 'Startup Ecosystem & Media',
    title: 'Founder & CEO, YourStory',
    expertise: ['Startup Mentorship', 'Media & Journalism', 'Networking', 'Fundraising Basics'],
    bio: 'Shradha Sharma is the founder of YourStory, India\'s biggest media platform for startups. She has interviewed thousands of entrepreneurs and provides unmatched insights into the Indian startup ecosystem.',
    linkedin: 'https://www.linkedin.com/in/sharmashradha/',
    availability: 'Limited',
    rating: 4.9,
    sessions: 1200,
    yearsExp: 18,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi'],
    nextSlot: '2026-04-20',
    fee: 'Free (Selected founders only)',
    specialNote: 'Conducts selective mentoring for seed-stage startups'
  },
  {
    id: 3,
    name: 'Kunal Shah',
    role: 'Fintech & Startup Mentorship',
    title: 'Founder & CEO, CRED',
    expertise: ['Fintech', 'Product Management', 'Startup Building', 'Growth Strategy'],
    bio: 'Founder of CRED and FreeCharge, Kunal Shah is one of India\'s most influential startup founders. Known for his frameworks on wealth creation, delta-4 theory, and product thinking for entrepreneurs.',
    linkedin: 'https://www.linkedin.com/in/kunalshah1/',
    availability: 'Limited',
    rating: 4.9,
    sessions: 480,
    yearsExp: 20,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi', 'Gujarati'],
    nextSlot: '2026-04-25',
    fee: 'Free (AMA Sessions)',
    specialNote: 'Group group discussions and community AMA sessions'
  },
  {
    id: 4,
    name: 'Vineeta Singh',
    role: 'D2C Brands & Marketing',
    title: 'Co-founder & CEO, SUGAR Cosmetics',
    expertise: ['D2C Marketing', 'Brand Building', 'Women Entrepreneurship', 'Retail'],
    bio: 'Vineeta Singh is the co-founder of SUGAR Cosmetics and a prominent investor. She is passionate about mentoring young women entrepreneurs and offering strategies for building consumer brands in India.',
    linkedin: 'https://www.linkedin.com/in/vineetasingh/',
    availability: 'Available',
    rating: 4.8,
    sessions: 950,
    yearsExp: 15,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi'],
    nextSlot: '2026-04-12',
    fee: '₹2000 / session',
    specialNote: 'Special focus on women-led consumer startups'
  },
  {
    id: 5,
    name: 'Aman Gupta',
    role: 'Consumer Electronics & Marketing',
    title: 'Co-founder & CMO, boAt Lifestyle',
    expertise: ['Marketing Strategy', 'Bootstrapping', 'E-commerce', 'Consumer Behavior'],
    bio: 'Aman Gupta built boAt into India\'s leading audio and wearable brand. He mentors aspiring founders on aggressive brand building, millennial marketing, and navigating the vast Indian consumer landscape.',
    linkedin: 'https://www.linkedin.com/in/amanagupta/',
    availability: 'Available',
    rating: 4.9,
    sessions: 800,
    yearsExp: 14,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi'],
    nextSlot: '2026-04-18',
    fee: '₹2500 / session',
    specialNote: 'Mentoring for consumer hardware and D2C strategy'
  },
  {
    id: 6,
    name: 'Vani Kola',
    role: 'Venture Capital & Technology',
    title: 'Managing Director, Kalaari Capital',
    expertise: ['Venture Capital', 'Fundraising', 'B2B Tech', 'SaaS'],
    bio: 'Vani Kola is one of India\'s most influential early-stage venture capitalists. She has successfully backed several unicorns and guides tech startups on scaling, operational excellence, and fundraising.',
    linkedin: 'https://www.linkedin.com/in/vanikola/',
    availability: 'Limited',
    rating: 4.9,
    sessions: 600,
    yearsExp: 25,
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi', 'Telugu'],
    nextSlot: '2026-04-30',
    fee: 'Free (Pitch sessions)',
    specialNote: 'Mentorship tied to early-stage venture pitching'
  },
  {
    id: 7,
    name: 'Rajan Anandan',
    role: 'Tech Investments & Scaling',
    title: 'Managing Director, Peak XV Partners',
    expertise: ['Internet Ecosystems', 'SaaS Scaling', 'Angel Investing', 'Strategic Growth'],
    bio: 'Rajan Anandan leads investments at Peak XV Partners. Formerly the head of Google India, he is an expert on internet business models, scaling SaaS companies, and driving strategic hyper-growth.',
    linkedin: 'https://www.linkedin.com/in/rajananandan/',
    availability: 'Limited',
    rating: 4.8,
    sessions: 720,
    yearsExp: 30,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi'],
    nextSlot: '2026-05-05',
    fee: 'Free (Institutional sessions only)',
    specialNote: 'Focuses on B2B SaaS and consumer tech ecosystems'
  },
  {
    id: 8,
    name: 'Radhika Gupta',
    role: 'Finance & Asset Management',
    title: 'MD & CEO, Edelweiss AMC',
    expertise: ['Finance Careers', 'Wealth Management', 'Leadership', 'Resilience'],
    bio: 'Radhika Gupta is a celebrated finance leader, author, and CEO of Edelweiss AMC. She mentors young professionals on careers in finance, the "girl with a broken neck" resilience, and wealth building.',
    linkedin: 'https://www.linkedin.com/in/radhika-gupta-0359b34/',
    availability: 'Available',
    rating: 5.0,
    sessions: 1100,
    yearsExp: 18,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'Hindi'],
    nextSlot: '2026-04-14',
    fee: '₹1200 / session',
    specialNote: 'Provides guidance on financial careers and investments'
  }
];

// ── Session time slots ──────────────────────────────────────────
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 18 && min > 0) break;
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const display = `${h}:${min === 0 ? '00' : min} ${ampm}`;
      slots.push(display);
    }
  }
  return slots;
};

const sessionTopics = [
  'Career Path Guidance',
  'College Admissions Strategy',
  'Scholarship Application Review',
  'Resume / CV Review',
  'Interview Preparation',
  'Research Guidance',
  'Startup / Entrepreneurship Advice',
  'Study Abroad Planning',
  'Industry Insights',
  'Skill Development Roadmap',
  'Other (Please specify)'
];

// ── Generate next 14 available dates ─────────────────────────────
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) { // skip Sundays
      dates.push(d);
      if (dates.length >= 14) break;
    }
  }
  return dates;
};

const MentorsPage = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [scheduledSession, setScheduledSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  
  // Form state
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionMessage, setSessionMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [formError, setFormError] = useState('');

  const timeSlots = generateTimeSlots();
  const availableDates = getAvailableDates();

  // Get all unique expertise areas
  const allExpertise = useMemo(() => {
    const set = new Set();
    mentors.forEach(m => m.expertise.forEach(e => set.add(e)));
    return Array.from(set).sort();
  }, []);

  // Filter mentors
  const filteredMentors = useMemo(() => {
    let result = mentors;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(lower) ||
        m.role.toLowerCase().includes(lower) ||
        m.title.toLowerCase().includes(lower) ||
        m.expertise.some(e => e.toLowerCase().includes(lower))
      );
    }
    if (selectedExpertise) {
      result = result.filter(m => m.expertise.includes(selectedExpertise));
    }
    return result;
  }, [searchTerm, selectedExpertise]);

  const handleOpenSchedule = (mentor) => {
    setSelectedMentor(mentor);
    setShowScheduleModal(true);
    setFormError('');
    setSessionDate('');
    setSessionTime('');
    setSessionTopic('');
    setSessionMessage('');
    setStudentName('');
    setStudentEmail('');
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !sessionDate || !sessionTime || !sessionTopic) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    
    const dateObj = new Date(sessionDate);
    setScheduledSession({
      mentor: selectedMentor,
      date: dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: sessionTime,
      topic: sessionTopic
    });
    
    setShowScheduleModal(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 8000);
  };

  const getAvailabilityColors = (availability) => {
    switch (availability) {
      case 'Available': return { bg: 'rgba(16,185,129,0.1)', text: '#059669', border: '#10b981', dot: '#10b981' };
      case 'Limited': return { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: '#f59e0b', dot: '#f59e0b' };
      default: return { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', border: '#ef4444', dot: '#ef4444' };
    }
  };

  return (
    <Layout title="Expert Mentors | Digital Career Advisor">
      <Head>
        <title>Expert Mentors — Connect with India's Top Career Mentors</title>
        <meta name="description" content="Schedule sessions with verified career mentors including India's top industry leaders, professors, and entrepreneurs." />
      </Head>

      {/* ── Success Alert ─── */}
      {showSuccessAlert && scheduledSession && (
        <div style={{ position: 'fixed', top: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: '90%', maxWidth: '650px', animation: 'slideDown 0.5s ease-out' }}>
          <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible className="shadow-lg border-0" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))', borderLeft: '5px solid #10b981' }}>
            <div className="d-flex align-items-start gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="bi bi-check-lg text-white" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#065f46' }}>Session Scheduled Successfully! 🎉</h5>
                <p className="mb-1" style={{ color: '#047857' }}>
                  Your mentoring session with <strong>{scheduledSession.mentor.name}</strong> has been confirmed.
                </p>
                <p className="mb-0 small" style={{ color: '#059669' }}>
                  <i className="bi bi-calendar3 me-1"></i> {scheduledSession.date} at {scheduledSession.time} — <em>{scheduledSession.topic}</em>
                </p>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <div style={{ background: 'var(--light)', minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* ── Hero Header ─── */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)', padding: '4rem 0 3rem', color: 'white', position: 'relative', overflow: 'hidden', borderRadius: '0 0 32px 32px' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', animation: 'heroGlow 8s ease-in-out infinite' }}></div>
          <div style={{ position: 'absolute', bottom: '-120px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)', animation: 'heroGlow 10s ease-in-out infinite reverse' }}></div>
          <div className="container position-relative" style={{ zIndex: 2 }}>
            <Row className="align-items-center">
              <Col lg={7}>
                <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', backdropFilter: 'blur(10px)' }}>
                  <i className="bi bi-people-fill me-2"></i>India's Top Career Mentors
                </div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.75rem', marginBottom: '1rem', lineHeight: 1.1 }}>
                  Learn from the <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Best Minds</span> in India
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '500px', lineHeight: 1.7 }}>
                  Get one-on-one career guidance from renowned industry leaders, professors, and entrepreneurs. Schedule a free session today.
                </p>
              </Col>
              <Col lg={5} className="text-lg-end mt-4 mt-lg-0">
                <Row className="g-3">
                  {[
                    { icon: 'bi-people', num: '8+', label: 'Expert Mentors' },
                    { icon: 'bi-camera-video', num: '10K+', label: 'Sessions Done' },
                    { icon: 'bi-star', num: '4.9', label: 'Avg. Rating' },
                  ].map((s, i) => (
                    <Col xs={4} key={i}>
                      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem 0.75rem', textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <i className={`bi ${s.icon} d-block mb-1`} style={{ fontSize: '1.3rem', opacity: 0.8 }}></i>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>{s.num}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </div>

        <div className="container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 3 }}>
          {/* ── Search & Filter Bar ─── */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.25rem 1.75rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <InputGroup style={{ flex: '1 1 300px', maxWidth: '450px' }}>
              <InputGroup.Text style={{ background: 'transparent', border: '2px solid #e2e8f0', borderRight: 'none', borderRadius: '12px 0 0 12px', color: '#94a3b8' }}>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, role, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 12px 12px 0', boxShadow: 'none', padding: '0.75rem 1rem' }}
              />
            </InputGroup>
            <Form.Select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              style={{ flex: '0 1 250px', borderRadius: '12px', border: '2px solid #e2e8f0', padding: '0.75rem 1rem' }}
            >
              <option value="">All Expertise Areas</option>
              {allExpertise.map(exp => <option key={exp} value={exp}>{exp}</option>)}
            </Form.Select>
            {(searchTerm || selectedExpertise) && (
              <Button variant="link" className="text-decoration-none fw-semibold" style={{ color: 'var(--primary)' }} onClick={() => { setSearchTerm(''); setSelectedExpertise(''); }}>
                <i className="bi bi-x-circle me-1"></i>Clear
              </Button>
            )}
          </div>

          {/* ── Results Info ─── */}
          <p className="text-muted fw-semibold mb-4" style={{ fontSize: '0.95rem' }}>
            Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
          </p>

          {/* ── Mentor Cards ─── */}
          <Row className="g-4">
            {filteredMentors.map((mentor, index) => {
              const availColors = getAvailabilityColors(mentor.availability);
              return (
                <Col lg={6} key={mentor.id} style={{ animationDelay: `${index * 0.08}s` }} className="fade-in">
                  <Card className="border-0 h-100" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', overflow: 'visible' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(99,102,241,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                  >
                    <Card.Body className="p-0">
                      <div className="d-flex flex-column flex-md-row">
                        {/* Left — Avatar & Quick Stats */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '200px', borderRadius: '20px 0 0 20px', position: 'relative' }}>
                          <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <img
                              src={mentor.image}
                              alt={mentor.name}
                              style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                            />
                            <span style={{
                              position: 'absolute', bottom: '6px', right: '6px',
                              width: '18px', height: '18px', borderRadius: '50%',
                              background: availColors.dot,
                              border: '3px solid white',
                              boxShadow: `0 0 8px ${availColors.dot}40`
                            }}></span>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', background: availColors.bg, color: availColors.text, border: `1px solid ${availColors.border}30`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {mentor.availability}
                          </span>
                          <div className="d-flex gap-3 mt-3" style={{ fontSize: '0.8rem', color: 'var(--dark-600)' }}>
                            <div className="text-center">
                              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{mentor.sessions}+</div>
                              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Sessions</div>
                            </div>
                            <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                            <div className="text-center">
                              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{mentor.yearsExp}+</div>
                              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Years</div>
                            </div>
                          </div>
                        </div>

                        {/* Right — Details */}
                        <div style={{ padding: '1.75rem 1.75rem 1.25rem', flex: 1 }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '2px', fontSize: '1.25rem' }}>{mentor.name}</h4>
                              <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>{mentor.role}</p>
                              <p className="text-muted mb-0" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{mentor.title}</p>
                            </div>
                            <div className="d-flex align-items-center gap-1" style={{ background: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: '8px', flexShrink: 0 }}>
                              <i className="bi bi-star-fill" style={{ color: '#f59e0b', fontSize: '0.85rem' }}></i>
                              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#92400e' }}>{mentor.rating}</span>
                            </div>
                          </div>

                          <p className="mb-3" style={{ fontSize: '0.88rem', color: 'var(--dark-600)', lineHeight: 1.6 }}>{mentor.bio}</p>

                          {/* Expertise Tags */}
                          <div className="mb-3 d-flex flex-wrap gap-1">
                            {mentor.expertise.map((skill, i) => (
                              <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))', color: 'var(--primary-dark)', border: '1px solid rgba(99,102,241,0.12)' }}>
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Languages & Fee */}
                          <div className="d-flex flex-wrap gap-3 mb-3" style={{ fontSize: '0.8rem', color: 'var(--dark-600)' }}>
                            <span><i className="bi bi-translate me-1"></i>{mentor.languages.join(', ')}</span>
                            <span><i className="bi bi-wallet2 me-1"></i>{mentor.fee}</span>
                          </div>

                          {/* Actions */}
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              onClick={() => handleOpenSchedule(mentor)}
                              disabled={mentor.availability === 'Unavailable'}
                              style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none', borderRadius: '10px',
                                padding: '0.6rem 1.5rem', fontWeight: 600,
                                fontSize: '0.85rem',
                                boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <i className="bi bi-calendar-plus me-2"></i>Schedule Session
                            </Button>
                            <a
                              href={mentor.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="btn"
                              style={{
                                background: 'rgba(0,119,181,0.08)',
                                color: '#0077b5', borderRadius: '10px',
                                padding: '0.6rem 1.25rem', fontWeight: 600,
                                fontSize: '0.85rem',
                                border: '1px solid rgba(0,119,181,0.15)',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <i className="bi bi-linkedin me-1"></i>Profile
                            </a>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {filteredMentors.length === 0 && (
            <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '20px' }}>
              <Card.Body className="py-5">
                <i className="bi bi-people text-muted" style={{ fontSize: '4rem', opacity: 0.4 }}></i>
                <h3 className="fw-bold mt-3 mb-2">No Mentors Found</h3>
                <p className="text-muted mb-4">Try adjusting your search or filter criteria.</p>
                <Button variant="primary" className="rounded-pill px-4" onClick={() => { setSearchTerm(''); setSelectedExpertise(''); }}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>

      {/* ═══ Schedule Session Modal ═══ */}
      <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)} centered size="lg" style={{ zIndex: 9999 }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Modal Header */}
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4338ca, #6366f1)', padding: '1.75rem 2rem', color: 'white' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '4px' }}>
                  <i className="bi bi-calendar-plus me-2"></i>Schedule a Session
                </h4>
                {selectedMentor && (
                  <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.95rem' }}>
                    with <strong>{selectedMentor.name}</strong> — {selectedMentor.role}
                  </p>
                )}
              </div>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', width: '36px', height: '36px', color: 'white', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '2rem', background: '#fafbff' }}>
            {formError && (
              <Alert variant="danger" className="mb-3 rounded-3" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-exclamation-triangle me-2"></i>{formError}
              </Alert>
            )}

            <Form onSubmit={handleScheduleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--dark-700)' }}>
                      <i className="bi bi-person me-1"></i>Your Full Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Enter your full name" value={studentName} onChange={e => setStudentName(e.target.value)} style={{ borderRadius: '10px', padding: '0.7rem 1rem' }} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--dark-700)' }}>
                      <i className="bi bi-envelope me-1"></i>Email Address <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control type="email" placeholder="your@email.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} style={{ borderRadius: '10px', padding: '0.7rem 1rem' }} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--dark-700)' }}>
                      <i className="bi bi-calendar-event me-1"></i>Preferred Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select value={sessionDate} onChange={e => setSessionDate(e.target.value)} style={{ borderRadius: '10px', padding: '0.7rem 1rem' }}>
                      <option value="">Select a date</option>
                      {availableDates.map((d, i) => (
                        <option key={i} value={d.toISOString().split('T')[0]}>
                          {d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--dark-700)' }}>
                      <i className="bi bi-clock me-1"></i>Preferred Time <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select value={sessionTime} onChange={e => setSessionTime(e.target.value)} style={{ borderRadius: '10px', padding: '0.7rem 1rem' }}>
                      <option value="">Select a time slot</option>
                      {timeSlots.map((t, i) => <option key={i} value={t}>{t}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--dark-700)' }}>
                      <i className="bi bi-chat-dots me-1"></i>Session Topic <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select value={sessionTopic} onChange={e => setSessionTopic(e.target.value)} style={{ borderRadius: '10px', padding: '0.7rem 1rem' }}>
                      <option value="">What would you like to discuss?</option>
                      {sessionTopics.map((t, i) => <option key={i} value={t}>{t}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--dark-700)' }}>
                      <i className="bi bi-pencil me-1"></i>Additional Message <span className="text-muted">(optional)</span>
                    </Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Tell the mentor about yourself, your goals, and what you'd like to achieve from this session..." value={sessionMessage} onChange={e => setSessionMessage(e.target.value)} style={{ borderRadius: '10px', padding: '0.7rem 1rem', resize: 'none' }} />
                  </Form.Group>
                </Col>
              </Row>

              {/* Session Details Summary */}
              {selectedMentor && (
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', marginTop: '1.25rem', border: '1px solid #e2e8f0' }}>
                  <div className="d-flex align-items-center gap-3">
                    <img src={selectedMentor.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{selectedMentor.name}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>{selectedMentor.fee} • {selectedMentor.languages.join(', ')}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="mb-0 small text-muted"><i className="bi bi-camera-video me-1"></i>Video Call (Google Meet)</p>
                      <p className="mb-0 small text-muted"><i className="bi bi-clock me-1"></i>45 minutes</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Section */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="light" onClick={() => setShowScheduleModal(false)} style={{ borderRadius: '10px', padding: '0.65rem 1.5rem', fontWeight: 600 }}>
                  Cancel
                </Button>
                <Button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', padding: '0.65rem 2rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>
                  <i className="bi bi-check2-circle me-2"></i>Confirm Booking
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </Layout>
  );
};

export default MentorsPage;

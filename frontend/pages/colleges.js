import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { Container, Row, Col, Card, Form, InputGroup, Alert, Accordion } from 'react-bootstrap';
import { fetchColleges } from '../services/api';
import CollegeCard from '../components/CollegeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [sortBy, setSortBy] = useState('ranking'); // 'ranking', 'name', 'established'

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchColleges();
      setColleges(data);
    } catch (err) {
      console.error('Error loading colleges:', err);
      setError('Failed to load colleges. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique filter options from data
  const { states, types, streams } = useMemo(() => {
    const s = new Set();
    const t = new Set();
    const str = new Set();
    
    colleges.forEach(c => {
      if (c.state) s.add(c.state);
      if (c.type) t.add(c.type);
      if (c.streams) {
        c.streams.split(',').forEach(st => str.add(st.trim()));
      }
    });
    
    return {
      states: Array.from(s).sort(),
      types: Array.from(t).sort(),
      streams: Array.from(str).sort()
    };
  }, [colleges]);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleStreamChange = (stream) => {
    setSelectedStreams(prev => 
      prev.includes(stream) ? prev.filter(s => s !== stream) : [...prev, stream]
    );
  };

  // Apply Filters & Sort
  const filteredAndSortedColleges = useMemo(() => {
    let result = colleges;

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lowerSearch) || 
        (c.district && c.district.toLowerCase().includes(lowerSearch)) ||
        (c.state && c.state.toLowerCase().includes(lowerSearch))
      );
    }

    // Filter by state
    if (selectedState) {
      result = result.filter(c => c.state === selectedState);
    }

    // Filter by types
    if (selectedTypes.length > 0) {
      result = result.filter(c => selectedTypes.includes(c.type));
    }

    // Filter by streams
    if (selectedStreams.length > 0) {
      result = result.filter(c => {
        if (!c.streams) return false;
        const cStreams = c.streams.split(',').map(s => s.trim());
        return selectedStreams.some(s => cStreams.includes(s));
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'established') {
        return (a.established_year || 9999) - (b.established_year || 9999);
      } else if (sortBy === 'ranking') {
        const rankA = a.ranking && a.ranking > 0 ? a.ranking : 999;
        const rankB = b.ranking && b.ranking > 0 ? b.ranking : 999;
        return rankA - rankB;
      }
      return 0;
    });

    return result;
  }, [colleges, searchTerm, selectedState, selectedTypes, selectedStreams, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedTypes([]);
    setSelectedStreams([]);
    setSortBy('ranking');
  };

  if (loading) {
    return (
      <Layout title="Explore Colleges in India">
        <LoadingSpinner text="Exploring top colleges across India..." />
      </Layout>
    );
  }

  return (
    <Layout title="Explore Colleges in India">
      <Head>
        <title>Explore Top Colleges & Universities in India | Digital Career Advisor</title>
        <meta name="description" content="Discover top colleges and universities across India. Filter by state, type, streams, and rankings." />
      </Head>

      <div style={{ background: 'var(--light)', paddingBottom: '3rem' }}>
        {/* Header Section */}
        <div style={{ background: 'var(--gradient-primary)', padding: '3rem 0', marginBottom: '2rem', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', color: 'white', boxShadow: 'var(--shadow-md)' }}>
          <Container>
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  College Explorer
                </h1>
                <p className="lead opacity-75 mb-0" style={{ fontWeight: 400 }}>
                  Discover the perfect institution among {colleges.length}+ premier colleges and universities across India tailored to your aspirations.
                </p>
              </Col>
              <Col md={4} className="text-md-end mt-4 mt-md-0">
                  <div className="bg-white text-dark p-3 rounded-4 shadow-sm inline-block d-inline-flex flex-column align-items-center" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)'}}>
                     <span className="display-5 fw-bold" style={{ color: 'var(--primary)' }}>{colleges.length}</span>
                     <span className="text-uppercase fw-semibold" style={{ fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--dark-600)' }}>Institutions Listed</span>
                  </div>
              </Col>
            </Row>
          </Container>
        </div>

        <Container>
          {error && (
            <Row className="mb-4">
              <Col>
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Col>
            </Row>
          )}

          <Row>
            {/* Sidebar Filters */}
            <Col lg={3} className="mb-4">
                <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px', borderRadius: '16px' }}>
                   <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold" style={{ color: 'var(--dark)' }}><i className="bi bi-funnel-fill me-2 text-primary"></i>Filters</h5>
                      <span className="text-primary" style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }} onClick={clearFilters}>Reset All</span>
                   </Card.Header>
                   <Card.Body className="p-0">
                      <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen flush>
                        {/* State Filter */}
                        <Accordion.Item eventKey="0" className="border-bottom">
                          <Accordion.Header>Location</Accordion.Header>
                          <Accordion.Body>
                             <Form.Select 
                                value={selectedState} 
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="mb-2"
                             >
                                <option value="">All Over India</option>
                                {states.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                             </Form.Select>
                          </Accordion.Body>
                        </Accordion.Item>

                        {/* Institution Type Filter */}
                        <Accordion.Item eventKey="1" className="border-bottom">
                          <Accordion.Header>Institution Type</Accordion.Header>
                          <Accordion.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
                             {types.map(type => (
                                <Form.Check 
                                  key={type}
                                  type="checkbox"
                                  id={`type-${type}`}
                                  label={type}
                                  checked={selectedTypes.includes(type)}
                                  onChange={() => handleTypeChange(type)}
                                  className="mb-2"
                                />
                             ))}
                          </Accordion.Body>
                        </Accordion.Item>

                        {/* Streams Filter */}
                        <Accordion.Item eventKey="2">
                          <Accordion.Header>Streams / Courses</Accordion.Header>
                          <Accordion.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
                             {streams.map(stream => (
                                <Form.Check 
                                  key={stream}
                                  type="checkbox"
                                  id={`stream-${stream}`}
                                  label={stream}
                                  checked={selectedStreams.includes(stream)}
                                  onChange={() => handleStreamChange(stream)}
                                  className="mb-2"
                                />
                             ))}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                   </Card.Body>
                </Card>
            </Col>

            {/* Main Content Area */}
            <Col lg={9}>
              {/* Search and Sort Toolbar */}
              <div className="bg-white p-3 rounded-4 shadow-sm mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <InputGroup style={{ maxWidth: '400px' }}>
                    <InputGroup.Text className="bg-transparent border-end-0 text-muted">
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by college name, city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-start-0 ps-0 shadow-none"
                    />
                  </InputGroup>
                  
                  <div className="d-flex align-items-center gap-2">
                     <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Sort by:</span>
                     <Form.Select 
                       value={sortBy} 
                       onChange={(e) => setSortBy(e.target.value)}
                       style={{ minWidth: '150px' }}
                     >
                        <option value="ranking">NIRF Ranking (Asc)</option>
                        <option value="name">Institution Name (A-Z)</option>
                        <option value="established">Established Year (Oldest First)</option>
                     </Form.Select>
                  </div>
              </div>

              {/* Results Count Summary */}
              <div className="mb-4 text-muted fw-semibold">
                Showing {filteredAndSortedColleges.length} result{filteredAndSortedColleges.length !== 1 ? 's' : ''} based on your filters
              </div>

              {/* Colleges Grid */}
              {filteredAndSortedColleges.length > 0 ? (
                <Row>
                  {filteredAndSortedColleges.map(college => (
                    <Col key={college.id} md={6} className="mb-4">
                      <CollegeCard college={college} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card className="text-center py-5 border-0 shadow-sm rounded-4 bg-white mt-4">
                  <Card.Body className="py-5">
                    <div className="mb-4">
                      <i className="bi bi-search text-muted" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                    </div>
                    <h3 className="fw-bold mb-3">No Colleges Found</h3>
                    <p className="text-muted mb-4 lead" style={{ maxWidth: '500px', margin: '0 auto' }}>
                      We couldn't find any institutions matching your exact current filters. Try adjusting them or clearing the search.
                    </p>
                    <button
                      className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                      onClick={clearFilters}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2"></i> Reset All Filters
                    </button>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}
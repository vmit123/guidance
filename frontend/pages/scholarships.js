import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { Container, Row, Col, Card, Alert, Badge, Form, InputGroup, Accordion } from 'react-bootstrap';
import { fetchScholarships } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [sortBy, setSortBy] = useState('deadline_asc');

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchScholarships();
      setScholarships(data);
    } catch (err) {
      console.error('Error loading scholarships:', err);
      setError('Failed to load scholarships. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique filter options from data
  const { categories, types, states } = useMemo(() => {
    const c = new Set();
    const t = new Set();
    const s = new Set();
    
    scholarships.forEach(item => {
      if (item.category) c.add(item.category);
      if (item.type) t.add(item.type);
      if (item.state) s.add(item.state);
    });
    
    return {
      categories: Array.from(c).sort(),
      types: Array.from(t).sort(),
      states: Array.from(s).sort()
    };
  }, [scholarships]);

  // Apply Filters & Sort
  const filteredAndSortedScholarships = useMemo(() => {
    let result = scholarships;

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(lowerSearch) || 
        item.provider.toLowerCase().includes(lowerSearch) ||
        (item.description && item.description.toLowerCase().includes(lowerSearch))
      );
    }

    // Filters
    if (selectedCategory) result = result.filter(item => item.category === selectedCategory);
    if (selectedType) result = result.filter(item => item.type === selectedType);
    if (selectedState) result = result.filter(item => item.state === selectedState);

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'deadline_asc') {
        const dateA = a.deadline ? new Date(a.deadline) : new Date(9999, 1, 1);
        const dateB = b.deadline ? new Date(b.deadline) : new Date(9999, 1, 1);
        return dateA - dateB;
      } else if (sortBy === 'amount_desc') {
        return (b.amount || 0) - (a.amount || 0);
      }
      return 0;
    });

    return result;
  }, [scholarships, searchTerm, selectedCategory, selectedType, selectedState, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedState('');
    setSortBy('deadline_asc');
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Variable / Fully Funded';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return null;
    const diffTime = Math.abs(new Date(deadlineDate) - new Date());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  if (loading) {
    return (
      <Layout title="Explore Scholarships">
        <LoadingSpinner text="Finding the best financial aid opportunities..." />
      </Layout>
    );
  }

  return (
    <Layout title="Explore Scholarships & Financial Aid">
      <Head>
        <title>Scholarships & Financial Aid | All India Educational Opportunities</title>
        <meta name="description" content="Discover thousands of government and private scholarships across India. Filter by eligibility, state, and type." />
      </Head>

      <div style={{ background: 'var(--light)', paddingBottom: '3rem' }}>
        {/* Header Section */}
        <div style={{ background: 'var(--gradient-success)', padding: '3rem 0', marginBottom: '2rem', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', color: 'white', boxShadow: 'var(--shadow-md)' }}>
          <Container>
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Scholarships & Financial Aid
                </h1>
                <p className="lead opacity-75 mb-0" style={{ fontWeight: 400 }}>
                  Explore nationwide government, private, and merit-based financial aid opportunities to fund your dream education without barriers.
                </p>
              </Col>
              <Col md={4} className="text-md-end mt-4 mt-md-0">
                  <div className="bg-white text-dark p-3 rounded-4 shadow-sm inline-flex flex-column align-items-center" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)', display: 'inline-flex' }}>
                     <span className="display-5 fw-bold" style={{ color: 'var(--success)' }}>{scholarships.length}</span>
                     <span className="text-uppercase fw-semibold" style={{ fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--dark-600)' }}>Active Scholarships</span>
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
                      <h5 className="mb-0 fw-bold" style={{ color: 'var(--dark)' }}><i className="bi bi-funnel-fill me-2 text-success"></i>Filters</h5>
                      <span className="text-success" style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }} onClick={clearFilters}>Reset</span>
                   </Card.Header>
                   <Card.Body className="p-0">
                      <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen flush>
                        {/* Target State */}
                        <Accordion.Item eventKey="0" className="border-bottom">
                          <Accordion.Header>Region / State</Accordion.Header>
                          <Accordion.Body>
                             <Form.Select 
                                value={selectedState} 
                                onChange={(e) => setSelectedState(e.target.value)}
                             >
                                <option value="">All Regions</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                             </Form.Select>
                          </Accordion.Body>
                        </Accordion.Item>

                        {/* Category */}
                        <Accordion.Item eventKey="1" className="border-bottom">
                          <Accordion.Header>Funding Category</Accordion.Header>
                          <Accordion.Body>
                             {categories.map(cat => (
                                <Form.Check 
                                  key={cat}
                                  type="radio"
                                  name="category-filter"
                                  id={`cat-${cat}`}
                                  label={cat}
                                  checked={selectedCategory === cat}
                                  onChange={() => setSelectedCategory(cat)}
                                  className="mb-2"
                                />
                             ))}
                          </Accordion.Body>
                        </Accordion.Item>

                        {/* Type */}
                        <Accordion.Item eventKey="2">
                          <Accordion.Header>Scholarship Type</Accordion.Header>
                          <Accordion.Body>
                             {types.map(type => (
                                <Form.Check 
                                  key={type}
                                  type="radio"
                                  name="type-filter"
                                  id={`type-${type}`}
                                  label={type}
                                  checked={selectedType === type}
                                  onChange={() => setSelectedType(type)}
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
                      placeholder="Search scholarships, providers..."
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
                       style={{ minWidth: '180px' }}
                     >
                        <option value="deadline_asc">Deadline (Closing Soon)</option>
                        <option value="amount_desc">Amount (High to Low)</option>
                     </Form.Select>
                  </div>
              </div>

              {/* Results Count Summary */}
              <div className="mb-4 text-muted fw-semibold">
                Showing {filteredAndSortedScholarships.length} opportunity{filteredAndSortedScholarships.length !== 1 ? 's' : ''} based on your criteria
              </div>

              {/* Scholarships List */}
              {filteredAndSortedScholarships.length > 0 ? (
                <Row>
                  {filteredAndSortedScholarships.map(scholarship => {
                    const daysLeft = getDaysRemaining(scholarship.deadline);
                    const isUrgent = daysLeft && daysLeft <= 15;
                    
                    return (
                      <Col key={scholarship.id} md={12} className="mb-4">
                        <Card className={`border-0 shadow-sm hover-lift ${isUrgent ? 'border-start border-4 border-danger' : ''}`} style={{ borderRadius: '16px' }}>
                          <Card.Body className="p-4 p-md-5 d-flex flex-column flex-md-row gap-4">
                            
                            {/* Left content (Details) */}
                            <div className="flex-grow-1">
                               <div className="mb-2 d-flex flex-wrap gap-2">
                                  {scholarship.category && (
                                     <Badge bg="info" className="text-dark bg-opacity-10 fw-normal px-2 py-1 border border-info">
                                        <i className="bi bi-bank2 me-1"></i> {scholarship.category}
                                     </Badge>
                                  )}
                                  {scholarship.type && (
                                     <Badge bg="primary" className="text-primary bg-opacity-10 fw-normal px-2 py-1 border border-primary">
                                        <i className="bi bi-person-badge-fill me-1"></i> {scholarship.type}
                                     </Badge>
                                  )}
                                  {scholarship.state && (
                                     <Badge bg="secondary" className="text-secondary bg-opacity-10 fw-normal px-2 py-1 border border-secondary">
                                        <i className="bi bi-geo-alt-fill me-1"></i> {scholarship.state}
                                     </Badge>
                                  )}
                               </div>
                               
                               <h3 className="h4 fw-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{scholarship.name}</h3>
                               <p className="text-muted fw-semibold mb-3">Provided by: <span className="text-dark">{scholarship.provider}</span></p>
                               
                               <p className="mb-3" style={{ fontSize: '0.95rem' }}>{scholarship.description}</p>
                               
                               <div className="bg-light p-3 rounded-3 mb-0 border">
                                  <h6 className="fw-bold fs-6 mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Eligibility Criteria</h6>
                                  <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>{scholarship.eligibility}</p>
                               </div>
                            </div>
                            
                            {/* Right content (Action/Value) */}
                            <div className="d-flex flex-column align-items-md-end justify-content-between text-md-end" style={{ minWidth: '220px' }}>
                               <div className="mb-4 mb-md-0">
                                   <p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Scholarship Value</p>
                                   <h4 className="fw-bold mb-0 text-success">{formatCurrency(scholarship.amount)}</h4>
                               </div>
                               
                               <div className="w-100">
                                   {scholarship.deadline && (
                                      <div className={`mb-3 p-2 rounded-3 text-center ${isUrgent ? 'bg-danger text-white' : 'bg-light text-dark'}`}>
                                          <p className="mb-0 fw-semibold" style={{ fontSize: '0.85rem' }}>
                                              <i className="bi bi-calendar-event-fill me-2"></i>
                                              Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                          </p>
                                          {isUrgent && <small className="d-block mt-1 fw-bold">Only {daysLeft} days remaining!</small>}
                                      </div>
                                   )}
                                   
                                   <a href={scholarship.website || '#'} target="_blank" rel="noreferrer" className="btn btn-success w-100 py-2 fw-bold" style={{ borderRadius: '8px' }}>
                                      Apply Now <i className="bi bi-box-arrow-up-right ms-2"></i>
                                   </a>
                               </div>
                            </div>

                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <Card className="text-center py-5 border-0 shadow-sm rounded-4 bg-white mt-4">
                  <Card.Body className="py-5">
                    <div className="mb-4">
                      <i className="bi bi-cash-coin text-muted" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                    </div>
                    <h3 className="fw-bold mb-3">No Scholarships Found</h3>
                    <p className="text-muted mb-4 lead" style={{ maxWidth: '500px', margin: '0 auto' }}>
                      We couldn't find any financial aid programs matching your selected criteria. Try adjusting your filters.
                    </p>
                    <button
                      className="btn btn-success px-4 py-2 rounded-pill fw-bold"
                      onClick={clearFilters}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2"></i> Reset Filters
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

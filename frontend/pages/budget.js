import React, { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, Tabs, Tab, Badge, ProgressBar } from 'react-bootstrap';
import Layout from '../components/Layout';

export default function Budget() {
  const { t } = useTranslation();
  
  // Annual Educational Expenses
  const [tuition, setTuition] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [supplies, setSupplies] = useState('');

  // Monthly Living Expenses
  const [food, setFood] = useState('');
  const [transport, setTransport] = useState('');
  const [entertainment, setEntertainment] = useState('');
  const [misc, setMisc] = useState('');

  // Funding & Income
  const [scholarships, setScholarships] = useState('');
  const [partTime, setPartTime] = useState('');
  const [familySupport, setFamilySupport] = useState('');

  // Parsers safely handle empty strings
  const parseAmt = (val) => parseFloat(val) || 0;

  // Summaries
  const totalAnnualEd = parseAmt(tuition) + parseAmt(accommodation) + parseAmt(supplies);
  
  const totalMonthlyLiving = parseAmt(food) + parseAmt(transport) + parseAmt(entertainment) + parseAmt(misc);
  const totalDailyLiving = (totalMonthlyLiving / 30).toFixed(2);
  const totalAnnualLiving = totalMonthlyLiving * 12;

  const totalMonthlyIncome = parseAmt(partTime) + parseAmt(familySupport) + (parseAmt(scholarships) / 12);
  const totalAnnualIncome = totalMonthlyIncome * 12;

  const netMonthly = totalMonthlyIncome - totalMonthlyLiving - (totalAnnualEd / 12);
  const isSurplus = netMonthly >= 0;

  return (
    <Layout title={t('nav.budget', 'Budget Planner & Tracker')}>
      <Head>
        <title>Smart Budget Planner | Digital Career Advisor</title>
        <meta name="description" content="Plan your educational budget, daily expenses, and funding." />
      </Head>

      <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* Header Area */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)', padding: '4rem 0 3rem', color: 'white', position: 'relative', overflow: 'hidden', borderRadius: '0 0 32px 32px' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', animation: 'heroGlow 8s ease-in-out infinite' }}></div>
          <Container className="position-relative" style={{ zIndex: 2 }}>
            <h1 className="fw-bold display-5 mb-2" style={{ fontFamily: 'Outfit' }}>Smart <span style={{ color: '#fbbf24' }}>Budget Planner</span></h1>
            <p className="lead opacity-75 mb-0">Track your educational fees, plan your daily expenses, and manage your income sources.</p>
          </Container>
        </div>

        <Container style={{ marginTop: '-2rem', position: 'relative', zIndex: 3 }}>
          <Row className="g-4">
            
            {/* Main Tabs Column */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <Card.Body className="p-0">
                  <Tabs defaultActiveKey="daily" id="budget-tabs" className="mb-0 custom-tabs p-3 pb-0" fill>
                    
                    <Tab eventKey="daily" title={<span><i className="bi bi-clock-history me-2"></i>Daily/Monthly Planner</span>}>
                      <div className="p-4 bg-white">
                        <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-dark)' }}>Monthly Living Expenses</h5>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Groceries & Food (₹/month)</Form.Label>
                              <Form.Control type="number" placeholder="5000" value={food} onChange={(e) => setFood(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Transportation (₹/month)</Form.Label>
                              <Form.Control type="number" placeholder="1500" value={transport} onChange={(e) => setTransport(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Entertainment (₹/month)</Form.Label>
                              <Form.Control type="number" placeholder="1000" value={entertainment} onChange={(e) => setEntertainment(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Miscellaneous (₹/month)</Form.Label>
                              <Form.Control type="number" placeholder="800" value={misc} onChange={(e) => setMisc(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                        <div className="mt-4 p-3 rounded rounded-3" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
                          <h6 className="fw-bold text-primary mb-2">Daily Budget Limit</h6>
                          <p className="mb-0 text-muted small">Based on your monthly expenses, your daily spending limit is:</p>
                          <h3 className="fw-bold mt-2 mb-0" style={{ color: 'var(--dark-700)' }}>₹{totalDailyLiving} / day</h3>
                        </div>
                      </div>
                    </Tab>
                    
                    <Tab eventKey="annual" title={<span><i className="bi bi-mortarboard me-2"></i>Educational (Annual)</span>}>
                      <div className="p-4 bg-white">
                        <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-dark)' }}>Annual Fees & Supplies</h5>
                        <Row className="g-3">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Annual Tuition Fees (₹/year)</Form.Label>
                              <Form.Control type="number" placeholder="150000" value={tuition} onChange={(e) => setTuition(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Hostel / Accommodation (₹/year)</Form.Label>
                              <Form.Control type="number" placeholder="60000" value={accommodation} onChange={(e) => setAccommodation(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Books & Laptop (₹/year)</Form.Label>
                              <Form.Control type="number" placeholder="25000" value={supplies} onChange={(e) => setSupplies(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    
                    <Tab eventKey="funding" title={<span><i className="bi bi-wallet2 me-2"></i>Funding & Income</span>}>
                      <div className="p-4 bg-white">
                        <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-dark)' }}>Source of Income</h5>
                        <Row className="g-3">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Scholarships / Grants (₹/year)</Form.Label>
                              <Form.Control type="number" placeholder="50000" value={scholarships} onChange={(e) => setScholarships(e.target.value)} style={{ borderRadius: '10px' }} />
                              <Form.Text className="text-muted">Total financial aid received annually.</Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Part-Time Job (₹/month)</Form.Label>
                              <Form.Control type="number" placeholder="8000" value={partTime} onChange={(e) => setPartTime(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-semibold text-muted">Family Allowance (₹/month)</Form.Label>
                              <Form.Control type="number" placeholder="5000" value={familySupport} onChange={(e) => setFamilySupport(e.target.value)} style={{ borderRadius: '10px' }} />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>

            {/* Summary Column */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '20px', background: 'white' }}>
                <Card.Body className="p-4 pb-2">
                  <h5 className="fw-bold mb-4" style={{ fontFamily: 'Outfit' }}>Financial Summary</h5>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted fw-semibold small">Annual Educational</span>
                    <span className="fw-bold text-danger">- ₹{totalAnnualEd.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted fw-semibold small">Annual Living</span>
                    <span className="fw-bold text-danger">- ₹{totalAnnualLiving.toLocaleString()}</span>
                  </div>
                  <hr className="my-2 opacity-25" />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="text-muted fw-semibold small">Total Required (Year)</span>
                    <span className="fw-bold" style={{ color: 'var(--dark-700)' }}>₹{(totalAnnualEd + totalAnnualLiving).toLocaleString()}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted fw-semibold small">Total Income (Year)</span>
                    <span className="fw-bold text-success">+ ₹{totalAnnualIncome.toLocaleString()}</span>
                  </div>

                  <div className="mt-4 pt-4 border-top">
                    <p className="text-muted fw-semibold small mb-1">Net Flow (Per Month)</p>
                    <h2 className={`fw-bold display-6 mb-0 ${isSurplus ? 'text-success' : 'text-danger'}`}>
                      {isSurplus ? '+' : ''}₹{netMonthly.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </h2>
                    {isSurplus ? (
                      <Badge bg="success" className="mt-2 text-white">Surplus / Savings</Badge>
                    ) : (
                      <Badge bg="danger" className="mt-2 text-white">Shortfall / Deficit</Badge>
                    )}
                  </div>
                </Card.Body>
                
                {!isSurplus && totalAnnualEd > 0 && (
                 <Card.Footer className="bg-transparent border-0 p-4 pt-0">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <p className="small text-muted mb-2">Notice a shortfall? Explore scholarships to fund your education.</p>
                      <a href="/scholarships" className="btn btn-outline-primary btn-sm w-100 fw-bold">Find Scholarships</a>
                    </div>
                 </Card.Footer>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        :global(.custom-tabs .nav-link) {
          color: var(--dark-500);
          font-weight: 600;
          border: none !important;
          border-bottom: 3px solid transparent !important;
          padding: 1rem 0;
          transition: all 0.3s;
        }
        :global(.custom-tabs .nav-link:hover) {
          color: var(--primary);
        }
        :global(.custom-tabs .nav-link.active) {
          color: var(--primary) !important;
          background: transparent !important;
          border-bottom: 3px solid var(--primary) !important;
        }
      `}</style>
    </Layout>
  );
}

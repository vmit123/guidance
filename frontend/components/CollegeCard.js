import React from 'react';
import { Card, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

const CollegeCard = ({ college }) => {
  return (
    <Card className="mb-4 h-100 border-0 shadow-sm hover-lift" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{
        height: '8px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
      }} />
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex align-items-start mb-3" style={{ gap: '15px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(99,102,241,0.2)'
          }}>
            <i className="bi bi-buildings-fill" style={{ fontSize: '1.8rem', color: '#6366f1' }}></i>
          </div>
          <div>
            <Card.Title className="mb-1 h5 fw-bold text-dark" style={{ fontFamily: 'Outfit, sans-serif', lineHeight: '1.3' }}>
              {college.name}
            </Card.Title>
            <div className="d-flex align-items-center flex-wrap gap-2 mt-2" style={{ fontSize: '0.85rem' }}>
               {college.state && (
                 <span className="text-muted d-flex align-items-center bg-light px-2 py-1 rounded">
                   <i className="bi bi-geo-alt-fill me-1" style={{ color: '#ef4444' }}></i>
                   {college.district ? `${college.district}, ` : ''}{college.state}
                 </span>
               )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mb-3">
            {college.type && (
               <Badge bg="primary" style={{ backgroundColor: 'rgba(99,102,241,0.1) !important', color: '#4f46e5', border: '1px solid #818cf8' }} className="fw-normal px-2 py-1">
                 {college.type}
               </Badge>
            )}
            {college.ranking && college.ranking > 0 && (
                <OverlayTrigger placement="top" overlay={<Tooltip>NIRF Ranking / Institutional Rank</Tooltip>}>
                    <Badge style={{ backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' }} className="fw-normal px-2 py-1">
                       <i className="bi bi-trophy-fill me-1"></i> Rank #{college.ranking}
                    </Badge>
                </OverlayTrigger>
            )}
            {college.naac_grade && college.naac_grade !== 'N/A' && (
                <OverlayTrigger placement="top" overlay={<Tooltip>NAAC Accreditation Grade</Tooltip>}>
                    <Badge style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }} className="fw-normal px-2 py-1">
                        <i className="bi bi-award-fill me-1"></i> {college.naac_grade}
                    </Badge>
                </OverlayTrigger>
            )}
        </div>

        {college.streams && (
          <div className="mb-3">
             <span className="text-muted d-block mb-1" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Streams</span>
            {college.streams.split(',').slice(0, 4).map((stream, i) => (
              <Badge
                key={i}
                bg="light"
                text="dark"
                className="me-1 mb-1"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  border: '1px solid #e2e8f0',
                  color: '#475569'
                }}
              >
                {stream.trim()}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
            <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
              {college.established_year ? `Est. ${college.established_year}` : 'India'}
            </span>
            <a 
              href={college.website || `https://www.google.com/search?q=${encodeURIComponent(college.name)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-sm btn-outline-primary rounded-pill px-3" 
              style={{ fontWeight: 600, textDecoration: 'none' }}
            >
              View Details <i className="bi bi-arrow-right ms-1"></i>
            </a>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CollegeCard;
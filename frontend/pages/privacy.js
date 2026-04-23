import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Card } from 'react-bootstrap';

const PrivacyPage = () => {
  return (
    <Layout title="Privacy Policy | Digital Career Advisor">
      <Head>
        <title>Privacy Policy</title>
      </Head>

      <div style={{ background: 'var(--light)', minHeight: '100vh', paddingBottom: '4rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)', padding: '4rem 0 4rem', color: 'white', position: 'relative', overflow: 'hidden', borderRadius: '0 0 32px 32px' }}>
          <div className="container position-relative" style={{ zIndex: 2, textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '3rem', marginBottom: '1rem' }}>
              Privacy <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span>
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
              How we collect, use, and protect your data.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 3 }}>
          <Card className="border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ background: 'white', padding: '3rem' }}>
              
              <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--dark-600)', lineHeight: 1.8 }}>
                <p className="text-muted mb-4">Last Updated: April 2026</p>
                
                <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)', fontFamily: 'Outfit' }}>1. Introduction</h4>
                <p className="mb-4">
                  Welcome to the Digital Career & Education Advisor. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
                </p>

                <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)', fontFamily: 'Outfit' }}>2. Data We Collect</h4>
                <p className="mb-4">
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                  <ul className="mt-2">
                    <li><strong>Identity Data:</strong> first name, last name, username.</li>
                    <li><strong>Contact Data:</strong> email address and telephone numbers.</li>
                    <li><strong>Profile Data:</strong> your interests, aptitude test results, and educational preferences.</li>
                  </ul>
                </p>

                <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)', fontFamily: 'Outfit' }}>3. How We Use Your Data</h4>
                <p className="mb-4">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                  <ul className="mt-2">
                    <li>To register you as a new user.</li>
                    <li>To provide personalized career recommendations and college matching.</li>
                    <li>To power our AI Voice Chatbot effectively so it can assist you efficiently.</li>
                  </ul>
                </p>

                <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)', fontFamily: 'Outfit' }}>4. Data Security</h4>
                <p className="mb-4">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                </p>

                <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)', fontFamily: 'Outfit' }}>5. Contact Us</h4>
                <p className="mb-0">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at support@educationadvisor.in.
                </p>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;

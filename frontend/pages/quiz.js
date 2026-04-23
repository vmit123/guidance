import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import PersonalizedAssessment from '../components/PersonalizedAssessment';
import { useTranslation } from 'react-i18next';

export default function Quiz() {
  const { t } = useTranslation();

  return (
    <Layout title="Career Quiz">
      <Head>
        <title>Career Quiz | Digital Career Advisor</title>
        <meta name="description" content="Take our personalized career assessment quiz" />
      </Head>
      <div className="container py-4">
        <PersonalizedAssessment />
      </div>
    </Layout>
  );
}

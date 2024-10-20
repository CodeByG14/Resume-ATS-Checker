import React from "react";
import Head from "next/head";
import Footer from "./_footer";

const AboutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>About Us | ATS Checker</title>
        <meta
          name="description"
          content="Learn more about ATS Checker and our mission to help job seekers optimize their resumes."
        />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About ATS Checker</h1>
        <div className="prose max-w-none">
          <p>
            Welcome to ATS Checker, your trusted partner in navigating the
            complex world of Applicant Tracking Systems (ATS). Our mission is to
            empower job seekers by providing cutting-edge tools and insights to
            optimize their resumes for ATS compatibility.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Story</h2>
          <p>
            Founded in [year], ATS Checker was born out of a passion for helping
            talented individuals overcome the hurdles of modern job application
            processes. We recognized the growing importance of ATS in
            recruitment and set out to create a solution that levels the playing
            field for job seekers.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">What We Do</h2>
          <p>
            At ATS Checker, we offer state-of-the-art resume analysis tools that
            simulate how Applicant Tracking Systems process and rank resumes.
            Our advanced algorithms provide actionable feedback, helping you
            tailor your resume to stand out in the digital screening process.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Commitment</h2>
          <p>
            We are committed to continuous innovation and staying ahead of the
            curve in ATS technology. Our team of experts constantly updates our
            systems to ensure you have the most accurate and up-to-date advice
            for your job search journey.
          </p>
        </div>
      </div>

      <footer style={{ marginTop: "-17px" }}>
        <Footer />
      </footer>
    </>
  );
};

export default AboutPage;

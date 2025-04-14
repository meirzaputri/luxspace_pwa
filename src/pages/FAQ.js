import React from "react";
import { useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import AsideMenu from "../components/AsideMenu";
import Footer from "../components/Footer";

function FAQ({ cart }) {
  const faqs = [
    {
      id: 1,
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Electronics must be unopened to qualify for a refund.",
    },
    {
      id: 2,
      question: "How long does shipping take?",
      answer:
        "Shipping times vary based on location. Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days.",
    },
    {
      id: 3,
      question: "Are your jewelry pieces real gold and silver?",
      answer:
        "Yes, all our jewelry is made with certified gold and sterling silver. Each piece comes with an authenticity certificate.",
    },
    {
      id: 4,
      question: "Do you offer warranties on electronics?",
      answer:
        "Yes, all electronics come with a 1-year manufacturer’s warranty. Extended warranty options are available at checkout.",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <Header mode="dark" cart={cart} />
      
      {/* <!-- START: BREADCRUMB --> */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto">
          <ul className="breadcrumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link
                to="/faq"
                aria-label="current-page"
                className="text-[#f472b6]"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </section>
      {/* <!-- END: BREADCRUMB --> */}

      <div className="max-w-xl mx-auto p-6">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="mb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full flex justify-between items-center p-4 rounded-xl ${
                openFAQ === index ? "bg-[#f472b6]" : "bg-[#F9CADA]"
              } transition`}
            >
              <span className="text-lg font-semibold">
                {faq.id < 10 ? `0${faq.id}` : faq.id} {faq.question}
              </span>
              <span>{openFAQ === index ? "−" : "+"}</span>
            </button>
            {openFAQ === index && (
              <div className="p-4 bg-purple-50 rounded-xl text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <AsideMenu />
      <Footer />
    </>
  );
}

export default FAQ;

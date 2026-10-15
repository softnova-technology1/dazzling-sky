import React, { useState } from 'react';
import { Plus, X, ChevronRight } from 'lucide-react';
import styles from './Faq.module.css';
import faq from "../../images/faq-head.png"
const generalFaq = [
  {
    question: "Do you offer same-day delivery?",
    answer:
      "Yes! We provide same-day delivery across Singapore for orders placed before our cut-off time.",
  },
  {
    question: "Are the flowers fresh?",
    answer:
      "Absolutely. We source fresh, premium-quality flowers daily to ensure every bouquet looks vibrant and long-lasting.",
  },
  {
    question: "Can I customize my bouquet?",
    answer:
      "Yes. You can request custom flowers, colours, wrapping styles, and personalized messages.",
  },
  {
    question: "Do you deliver on weekends and public holidays?",
    answer:
      "Yes, we deliver on weekends. Public holiday delivery depends on availability — contact us to confirm.",
  },
  {
    question: "Can I schedule a delivery in advance?",
    answer:
      "Of course! You can choose your preferred delivery date at checkout.",
  },
];

const orderProcessFaq = [
  {
    question: "Can I track my order?",
    answer:
      "Yes, you will receive delivery updates. Our team will notify you once your bouquet is on the way.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards, online banking, and digital wallet payments.",
  },
  {
    question: "What if the recipient is not home?",
    answer:
      "Our delivery team will contact the recipient. If unreachable, we will leave the bouquet in a safe spot or reschedule (extra charges may apply).",
  },
  {
    question: "Do you offer corporate or bulk orders?",
    answer:
      "Yes! We provide bouquets for events, offices, celebrations, and corporate gifting.",
  },
  {
    question: "How do I care for my flowers?",
    answer:
      "Place them in clean water, keep them away from direct sunlight, and trim the stems every 2–3 days for longer freshness.",
  },
];

const paymentFaq = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, online banking, UPI, and popular e-wallets for a smooth and secure checkout experience.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. All payments are processed through trusted, encrypted gateways to ensure your information stays safe and protected.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Currently, we do not offer COD. All orders must be paid online to confirm delivery.",
  },
  {
    question: "Will I receive a payment confirmation?",
    answer:
      "Absolutely. Once your payment is successful, a confirmation email/SMS will be sent instantly with your order details.",
  },
  {
    question: "What should I do if my payment fails?",
    answer:
      "If your payment fails, please retry using a different method or contact our support team. We’re happy to help you complete your order.",
  },
  {
    question: "Can I get a refund if I cancel my order?",
    answer:
      "Refunds depend on the cancellation time. If the bouquet has not been prepared or dispatched, a refund may be issued. Please refer to our Cancellation & Refund Policy for more details.",
  },
];

const faqData = [
  { category: "General FAQ", questions: generalFaq },
  { category: "Order Process", questions: orderProcessFaq },
  { category: "Payments", questions: paymentFaq }
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("General FAQ");
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // Smooth scroll to the category section
    const element = document.getElementById(category.replace(/\s+/g, '-').toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles['faq-page']}>
      {/* Dark Theme Split Arch Hero Section */}
      <section className={`${styles['faq-hero']} ${styles['dark-split-arch-hero']}`}>
        <div className={styles['dark-arch-hero-overlay']}></div>
        <div className={styles['dark-arch-hero-container']}>
          
          {/* Left Side: Content */}
          <div className={styles['dark-arch-content-left']}>
             <h1 className={styles['arch-title']}>
               Make Your Home <br/>
               <span>as Comfortable</span> as Possible
             </h1>
             <div className={styles['arch-subtitle-group']}>
               <p className={styles['arch-subtitle']}>Make your home as comfortable as possible with the natural charm of fresh flowers.</p>
               <p className={styles['arch-subtitle']}>Add comfort and elegance to your home with beautifully crafted fresh flower bouquets.</p>
             </div>
          </div>
          
          {/* Right Side: U-Shaped Image with Curved Text */}
          <div className={styles['dark-arch-image-wrapper']}>
            <div className={styles['dark-arch-image-mask']}>
              <img src={faq} alt="Floral Arch" />
            </div>
            
            
          </div>
          
        </div>
      </section>

      {/* Split-Layout FAQ Section */}
      <section className={styles['faq-main-section']}>
        <div className={styles['faq-container']}>
          
          {/* Left Column: Sticky Navigation (Table of Contents) */}
          <div className={styles['faq-sidebar']}>
            <h3 className={styles['sidebar-title']}>Categories</h3>
            <ul className={styles['faq-category-list']}>
              {faqData.map((cat, index) => (
                <li 
                  key={index} 
                  className={activeCategory === cat.category ? styles['active'] : ""}
                  onClick={() => handleCategoryClick(cat.category)}
                >
                  <span className={styles['cat-name']}>{cat.category}</span>
                  <ChevronRight size={16} className={styles['cat-icon']} />
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: All Accordions Listed One By One */}
          <div className={styles['faq-content']}>
            {faqData.map((cat, catIndex) => (
              <div 
                key={catIndex} 
                className={styles['faq-category-section']} 
                id={cat.category.replace(/\s+/g, '-').toLowerCase()}
              >
                <h2 className={styles['faq-category-title']}>{cat.category}</h2>
                
                <div className={styles['faq-accordion-group']}>
                  {cat.questions.map((item, qIndex) => {
                    const id = `${catIndex}-${qIndex}`;
                    const isOpen = openId === id;

                    return (
                      <div 
                        key={qIndex} 
                        className={`${styles['faq-accordion-item']} ${isOpen ? styles['open'] : ""}`}
                        onClick={() => toggleAccordion(id)}
                      >
                        <div className={styles['faq-question']}>
                          <h3>{item.question}</h3>
                          <div className={styles['icon-circle']}>
                            {isOpen ? <X size={18} /> : <Plus size={18} />}
                          </div>
                        </div>
                        <div className={styles['faq-answer']}>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default FAQ;


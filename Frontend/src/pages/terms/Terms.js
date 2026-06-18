import React from 'react';
import styles from './Terms.module.css';

const Terms = () => {
  return (
    <div className={styles.termsContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Terms and Conditions</h1>
        <p className={styles.heroSubtitle}>
          Please read these terms and conditions carefully before placing an order with Dazzling Sky.
        </p>
      </div>

      <div className={styles.termsContent}>
        {/* Section 1 */}
        <div className={styles.termSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>1</span>
            <h2 className={styles.sectionTitle}>Orders and Cancellations</h2>
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.subsectionTitle}>Order Acceptance</h3>
            <p>
              To place an order with Dazzling Sky, customers must provide accurate personal details including name, contact information, delivery address, and valid payment details. Account creation is optional.
            </p>
            <p>
              Upon successful placement of an order, an order confirmation will be sent to the registered email address. If confirmation is not received, customers are advised to contact our support team.
            </p>
            <p>
              All orders are subject to acceptance, and Dazzling Sky reserves the right to refuse or cancel any order at its sole discretion. In such cases, any payment received will be refunded in full using the original payment method.
            </p>

            <h3 className={styles.subsectionTitle}>Order Timing</h3>
            <p>
              Customers may select their preferred delivery date during checkout. Same-day or next-day delivery availability is subject to location, order volume, and operational feasibility. Delivery slots are not guaranteed unless explicitly stated.
            </p>

            <h3 className={styles.subsectionTitle}>Order Modifications</h3>
            <p>
              Requests to modify orders, including delivery details or message cards, must be submitted at least 48 hours prior to the scheduled delivery date.
            </p>
            <p>
              Changes requested after this period may not be accommodated, especially during peak seasons such as Valentine’s Day, Mother’s Day, festive periods, or public holidays.
            </p>

            <h3 className={styles.subsectionTitle}>Cancellations</h3>
            <p>
              Orders may be cancelled up to 48 hours before the scheduled delivery date for a full refund.
            </p>
            <p>
              Orders cancelled after this period may not be eligible for a refund due to preparation and procurement of fresh flowers.
            </p>
            <p>
              Training class bookings are non-refundable once confirmed but may be rescheduled at Dazzling Sky’s discretion.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className={styles.termSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>2</span>
            <h2 className={styles.sectionTitle}>Payments</h2>
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.subsectionTitle}>Accepted Payment Methods</h3>
            <p>Dazzling Sky accepts:</p>
            <ul>
              <li>PayNow and other secure digital scanner–based payment methods supported in Singapore.</li>
            </ul>
            <p>
              Debit cards and credit cards are not accepted. All transactions are processed through secure and authorized digital payment platforms.
            </p>

            <h3 className={styles.subsectionTitle}>Payment Security</h3>
            <p>
              Dazzling Sky does not store, process, or have direct access to customers’ bank or payment details.
            </p>

            <h3 className={styles.subsectionTitle}>Payment Confirmation</h3>
            <p>
              Orders will be processed only after successful payment confirmation.
            </p>
            <p>
              In the event of a failed, pending, or reversed payment, the order may be automatically cancelled without prior notice.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className={styles.termSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>3</span>
            <h2 className={styles.sectionTitle}>Prices</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              All prices displayed are in Singapore Dollars (SGD). Prices are inclusive of applicable Goods and Services Tax (GST) unless stated otherwise.
            </p>
            <p>
              Delivery charges, if applicable, will be clearly displayed during checkout.
            </p>
            <p>
              Dazzling Sky reserves the right to amend prices at any time without prior notice.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className={styles.termSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>4</span>
            <h2 className={styles.sectionTitle}>Delivery Policy</h2>
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.subsectionTitle}>Delivery Coverage</h3>
            <p>
              We currently deliver within Singapore only. Delivery to restricted areas, PO boxes, or inaccessible locations may not be possible.
            </p>

            <h3 className={styles.subsectionTitle}>Delivery Attempts</h3>
            <p>
              If delivery cannot be completed due to incorrect address details, recipient unavailability, or access restrictions, the order may be deemed delivered and no refund will be issued.
            </p>

            <h3 className={styles.subsectionTitle}>Delivery Delays</h3>
            <p>
              While we strive to deliver on the selected date, delays may occur due to traffic conditions, weather, or unforeseen operational issues. Such delays do not entitle customers to refunds.
            </p>

            <h3 className={styles.subsectionTitle}>Special Instructions</h3>
            <p>
              Delivery instructions are followed on a best-effort basis and cannot be guaranteed.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className={styles.termSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>5</span>
            <h2 className={styles.sectionTitle}>Our Promise, Returns and Refunds</h2>
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.subsectionTitle}>Quality Promise</h3>
            <p>
              Dazzling Sky is committed to delivering fresh, beautifully crafted bouquets and garlands. Flowers may be delivered in bud form to ensure longer vase life.
            </p>

            <h3 className={styles.subsectionTitle}>Freshness & Damage Claims</h3>
            <p>
              If flowers arrive damaged or not meeting quality expectations, customers must notify us within 24 hours of delivery with clear photographic evidence.
            </p>
            <p>
              At our discretion, we may offer a replacement or refund.
            </p>

            <h3 className={styles.subsectionTitle}>Non-Delivery</h3>
            <p>
              In the rare event of non-delivery, customers must notify us within 48 hours of the scheduled delivery date to be eligible for a resolution.
            </p>

            <h3 className={styles.subsectionTitle}>Returns</h3>
            <p>
              Due to the perishable nature of flowers, returns are not accepted.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className={styles.termSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>6</span>
            <h2 className={styles.sectionTitle}>Credits, Offers and Promotion Codes</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              Promotion codes are subject to specific terms and validity periods. Only one promotion code may be used per order.
            </p>
            <p>
              Codes are non-transferable, non-refundable, and cannot be exchanged for cash.
            </p>
            <p>
              Dazzling Sky reserves the right to withdraw or modify promotions at any time.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Terms;

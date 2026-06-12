import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/productsData';
import styles from './shipping.module.css';

export default function Shipping() {
    const navigate = useNavigate();

    // Default address list loaded from localStorage or mock initial list
    const [addresses, setAddresses] = useState(() => {
        const localAddresses = localStorage.getItem('dazzling_sky_saved_addresses');
        if (localAddresses) {
            try {
                return JSON.parse(localAddresses);
            } catch (e) {
                console.error(e);
            }
        }
        return [
            {
                id: 1,
                firstName: 'Helena',
                lastName: 'V.',
                address: '123 Luxury Lane, Apt 4B',
                apartment: 'Apt 4B',
                city: 'Beverly Hills',
                state: 'CA',
                zipCode: '90210',
                phone: '123-456-7890',
                email: 'helena@example.com'
            }
        ];
    });

    const [selectedAddressId, setSelectedAddressId] = useState(1);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: ''
    });

    // Save addresses to localStorage whenever updated
    useEffect(() => {
        localStorage.setItem('dazzling_sky_saved_addresses', JSON.stringify(addresses));
    }, [addresses]);

    // Load items to checkout from localStorage
    const [checkoutItems] = useState(() => {
        const localCheckout = localStorage.getItem('dazzling_sky_checkout_items');
        if (localCheckout) {
            try {
                const parsed = JSON.parse(localCheckout);
                return parsed.map(item => {
                    const prod = PRODUCTS.find(p => p.id === item.id);
                    return prod ? { product: prod, quantity: item.quantity } : null;
                }).filter(item => item !== null);
            } catch (e) {
                console.error(e);
            }
        }
        return [];
    });

    // Delivery Options
    const deliveryOptions = [
        { id: 'standard', name: 'Standard Delivery', time: 'Delivered in 2-3 Days', price: 0 },
        { id: 'express', name: 'Express Delivery', time: 'Delivered in 24 Hours', price: 15.00 },
        { id: 'midnight', name: 'Midnight Surprise', time: 'Delivered at 12:00 AM Midnight', price: 25.00 }
    ];

    const [selectedDelivery, setSelectedDelivery] = useState('standard');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionSelect = (optionId) => {
        setSelectedDelivery(optionId);
    };

    const [addressPopupMessage, setAddressPopupMessage] = useState(null);

    // Save Address handler (Add / Edit)
    const handleSaveAddress = (e) => {
        e.preventDefault();
        
        const message = editingAddressId !== null 
            ? 'Address updated successfully!' 
            : 'Address saved successfully!';

        if (editingAddressId !== null) {
            // Edit existing
            setAddresses(prev => prev.map(addr => 
                addr.id === editingAddressId 
                    ? { ...formData, id: editingAddressId } 
                    : addr
            ));
            setEditingAddressId(null);
        } else {
            // Add new
            const newAddress = {
                ...formData,
                id: Date.now()
            };
            setAddresses(prev => [...prev, newAddress]);
            setSelectedAddressId(newAddress.id);
        }

        // Show toast popup
        setAddressPopupMessage(message);
        setTimeout(() => {
            setAddressPopupMessage(null);
        }, 4000);

        // Reset form and hide it
        setFormData({
            firstName: '',
            lastName: '',
            address: '',
            apartment: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            email: ''
        });
        setShowForm(false);
    };

    // Trigger Edit
    const handleEditAddress = (addr, e) => {
        e.stopPropagation(); // Avoid selecting address card
        setEditingAddressId(addr.id);
        setFormData({
            firstName: addr.firstName,
            lastName: addr.lastName,
            address: addr.address,
            apartment: addr.apartment || '',
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            phone: addr.phone,
            email: addr.email
        });
        setShowForm(true);
    };

    const [deletingAddress, setDeletingAddress] = useState(null);

    // Trigger Delete
    const handleDeleteAddress = (address, e) => {
        e.stopPropagation(); // Avoid selecting address card
        setDeletingAddress(address);
    };

    const handleConfirmDelete = () => {
        if (deletingAddress) {
            setAddresses(prev => prev.filter(addr => addr.id !== deletingAddress.id));
            if (selectedAddressId === deletingAddress.id) {
                setSelectedAddressId(null);
            }
            setDeletingAddress(null);
        }
    };

    const handleCancelDelete = () => {
        setDeletingAddress(null);
    };

    // Handle Payment navigation
    const handleProceedToPayment = () => {
        if (!selectedAddressId) {
            alert('Please select or add a delivery address to proceed.');
            return;
        }
        // Save selected address to localStorage for checkout review on confirmation page
        const activeAddr = addresses.find(a => a.id === selectedAddressId);
        if (activeAddr) {
            const formattedAddrStr = `${activeAddr.firstName} ${activeAddr.lastName}, ${activeAddr.address}, ${activeAddr.city}, ${activeAddr.state} ${activeAddr.zipCode}`;
            localStorage.setItem('dazzling_sky_checkout_address', formattedAddrStr);
        }
        navigate('/payment');
    };

    // Calculate Summary Values
    const subtotal = checkoutItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const selectedOption = deliveryOptions.find(opt => opt.id === selectedDelivery);
    const shippingCost = selectedOption ? selectedOption.price : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    return (
        <div className={styles.shippingPageWrapper}>
            <div className={styles.shippingContainer}>
                
                {/* Stepper Header */}
                <header className={styles.pageHeader}>
                    <div className={styles.stepper}>
                        <span className={styles.stepCompleted}>01. Cart</span>
                        <span className={styles.stepDivider}>/</span>
                        <span className={styles.stepActive}>02. Delivery</span>
                        <span className={styles.stepDivider}>/</span>
                        <span className={styles.step}>03. Payment</span>
                    </div>
                    <h1 className={styles.pageTitle}>Delivery Information</h1>
                </header>

                <div className={styles.shippingGrid}>
                    
                    {/* Left Column Form */}
                    <div className={styles.formSection}>
                        
                        {/* Saved Addresses Section */}
                        <div className={styles.savedAddressesSection}>
                            <h2 className={styles.sectionTitle}>Select Delivery Address</h2>
                            
                            <div className={styles.addressCardList}>
                                {addresses.map(addr => (
                                    <div 
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.addressCardSelected : ''}`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="selectedAddress"
                                            className={styles.radioInput}
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                        />
                                        <div className={styles.addressInfo}>
                                            <span className={styles.addressName}>{addr.firstName} {addr.lastName}</span>
                                            <span className={styles.addressDetails}>
                                                {addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}, {addr.city}, {addr.state} {addr.zipCode}
                                            </span>
                                            <span className={styles.addressContact}>
                                                Phone: {addr.phone} | Email: {addr.email}
                                            </span>
                                        </div>
                                        <div className={styles.addressActions}>
                                            <button 
                                                className={styles.actionIconBtn} 
                                                onClick={(e) => handleEditAddress(addr, e)}
                                                title="Edit Address"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                            </button>
                                            <button 
                                                className={`${styles.actionIconBtn} ${styles.actionDeleteBtn}`} 
                                                onClick={(e) => handleDeleteAddress(addr, e)}
                                                title="Delete Address"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!showForm && (
                                <button 
                                    className={styles.addNewBtn}
                                    onClick={() => {
                                        setEditingAddressId(null);
                                        setShowForm(true);
                                    }}
                                >
                                    + Add New Address
                                </button>
                            )}
                        </div>

                        {/* Add / Edit Address Form */}
                        {showForm && (
                            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <h2 className={styles.sectionTitle}>
                                    {editingAddressId !== null ? 'Edit Address' : 'Add New Address'}
                                </h2>
                                
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>First Name *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Last Name *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                        <label className={styles.inputLabel}>Street Address *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="address" 
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="House number and street name" 
                                            required 
                                        />
                                    </div>
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                        <label className={styles.inputLabel}>Apartment, suite, unit etc. (optional)</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="apartment" 
                                            value={formData.apartment}
                                            onChange={handleInputChange}
                                            placeholder="Apartment, suite, unit, etc." 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Town / City *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="city" 
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>State / Province *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="state" 
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>ZIP / Postal Code *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="zipCode" 
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Phone *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="tel" 
                                            name="phone" 
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                        <label className={styles.inputLabel}>Email Address *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="email" 
                                            name="email" 
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                                    <button type="submit" className={styles.paymentBtn} style={{ padding: '12px 36px', borderRadius: '12px', fontSize: '13px' }}>
                                        {editingAddressId !== null ? 'Update Address' : 'Save Address'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className={styles.backToCartBtn}
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingAddressId(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Delivery Method Selection */}
                        <h2 className={styles.sectionTitle} style={{ marginTop: '36px' }}>Delivery Options</h2>
                        <div className={styles.deliveryOptions}>
                            {deliveryOptions.map(option => (
                                <div 
                                    key={option.id} 
                                    onClick={() => handleOptionSelect(option.id)}
                                    className={`${styles.optionCard} ${selectedDelivery === option.id ? styles.optionSelected : ''}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="deliveryMethod"
                                        className={styles.radioInput}
                                        checked={selectedDelivery === option.id}
                                        onChange={() => {}} // Controlled state via card click
                                    />
                                    <div className={styles.optionDetails}>
                                        <span className={styles.optionName}>{option.name}</span>
                                        <span className={styles.optionTime}>{option.time}</span>
                                    </div>
                                    <span className={styles.optionPrice}>
                                        {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Summary Column */}
                    <aside className={styles.summarySection}>
                        <h2 className={styles.summaryTitle}>Summary</h2>
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping ({selectedOption ? selectedOption.name : ''})</span>
                                <span style={{ color: shippingCost === 0 ? '#d1bcff' : '#ff8ad8' }}>
                                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Estimated Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryDivider}></div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span className={styles.totalPrice}>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button type="button" onClick={handleProceedToPayment} className={styles.paymentBtn}>
                            <span>Proceed to Payment</span>
                            <span className="material-symbols-outlined">payments</span>
                        </button>
                        
                        <button type="button" className={styles.backToCartBtn} onClick={() => navigate('/cart')}>
                            <span className="material-symbols-outlined">arrow_left_alt</span>
                            <span>Back to Cart</span>
                        </button>
                    </aside>

                </div>
            </div>
            {/* Custom Delete Confirmation Modal */}
            {deletingAddress && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <div className={styles.modalHeader}>
                            <span className="material-symbols-outlined" style={{ color: '#f87171', fontSize: '36px' }}>warning</span>
                            <h3 className={styles.modalTitle}>Delete Address</h3>
                        </div>
                        <p className={styles.modalText}>
                            Are you sure you want to delete the address for <strong>{deletingAddress.firstName} {deletingAddress.lastName}</strong>? This action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalBtnCancel} onClick={handleCancelDelete}>Cancel</button>
                            <button className={styles.modalBtnConfirm} onClick={handleConfirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Address Popup Toast */}
            {addressPopupMessage && (
                <div className={styles.addressPopupOverlay}>
                    <div className={styles.addressPopupCard}>
                        <span className={`material-symbols-outlined ${styles.popupCheck}`}>task_alt</span>
                        <div className={styles.popupInfo}>
                            <h4 className={styles.popupTitle}>Success</h4>
                            <p className={styles.popupName}>{addressPopupMessage}</p>
                        </div>
                        <button className={styles.popupBtnClose} onClick={() => setAddressPopupMessage(null)}>
                            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

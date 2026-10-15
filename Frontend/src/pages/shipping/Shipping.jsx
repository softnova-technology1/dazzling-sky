import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import styles from './shipping.module.css';

export default function Shipping() {
    const navigate = useNavigate();

    // Helper to resolve product images consistently
    const getImageSrc = (img) => {
        if (!img) return '/images/card1.jpg';
        if (typeof img !== 'string') return '/images/card1.jpg';
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
        if (img.startsWith('/uploads/') || img.startsWith('uploads/')) {
            const clean = img.startsWith('/') ? img : `/${img}`;
            return `${API_BASE_URL}${clean}`;
        }
        if (!img.startsWith('/')) {
            return `/${img}`;
        }
        return img;
    };

    // Clean any legacy dummy records (e.g. Helena V. mock records) from localStorage
    const cleanSavedAddresses = () => {
        const raw = localStorage.getItem('dazzling_sky_saved_addresses');
        if (!raw) return [];
        try {
            const list = JSON.parse(raw);
            if (!Array.isArray(list)) return [];
            return list.filter(a => {
                const fullName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
                const email = (a.email || '').toLowerCase();
                const addr = (a.address || '').toLowerCase();
                // Filter out any mock dummy entries
                if (fullName.includes('helena') || email.includes('helena@') || addr.includes('123 luxury lane') || addr.includes('beverly hills')) {
                    return false;
                }
                return true;
            });
        } catch (e) {
            return [];
        }
    };

    // Real saved delivery addresses (Strictly real data; no dummy records)
    const [addresses, setAddresses] = useState(() => cleanSavedAddresses());

    // Selected address ID
    const [selectedAddressId, setSelectedAddressId] = useState(() => {
        const cleaned = cleanSavedAddresses();
        return cleaned.length > 0 ? cleaned[0].id : null;
    });

    const [editingAddressId, setEditingAddressId] = useState(null);

    // If no real saved addresses exist, open address form immediately
    const [showForm, setShowForm] = useState(() => {
        const cleaned = cleanSavedAddresses();
        return cleaned.length === 0;
    });

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

    // Prepopulate name and email if customer is currently logged in
    useEffect(() => {
        // Clean localStorage immediately to remove any persistent mock Helena address
        const cleaned = cleanSavedAddresses();
        localStorage.setItem('dazzling_sky_saved_addresses', JSON.stringify(cleaned));

        const customerInfoStr = localStorage.getItem('customerInfo') || localStorage.getItem('user');
        if (customerInfoStr) {
            try {
                const cust = JSON.parse(customerInfoStr);
                const names = (cust.name || '').split(' ');
                setFormData(prev => ({
                    ...prev,
                    firstName: prev.firstName || names[0] || cust.firstName || '',
                    lastName: prev.lastName || names.slice(1).join(' ') || cust.lastName || '',
                    email: prev.email || cust.email || '',
                    phone: prev.phone || cust.phone || ''
                }));
            } catch (e) {}
        }
    }, []);

    // Save addresses to localStorage whenever updated
    useEffect(() => {
        localStorage.setItem('dazzling_sky_saved_addresses', JSON.stringify(addresses));
    }, [addresses]);

    // Load items to checkout from localStorage (Cart -> Checkout workflow)
    const [checkoutItems, setCheckoutItems] = useState(() => {
        const localCheckout = localStorage.getItem('dazzling_sky_checkout_items');
        if (localCheckout) {
            try {
                const parsed = JSON.parse(localCheckout);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) {
                console.error('Error parsing checkout items', e);
            }
        }
        // Fallback to active shopping cart
        const localCart = localStorage.getItem('dazzling_sky_cart');
        if (localCart) {
            try {
                const parsedCart = JSON.parse(localCart);
                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    return parsedCart;
                }
            } catch (e) {}
        }
        return [];
    });

    // Hydrate items with fresh database data if needed
    useEffect(() => {
        const hydrateCheckoutItems = async () => {
            const needsHydration = checkoutItems.some(it => !it.product || !it.product.name);
            if (needsHydration && checkoutItems.length > 0) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/products`);
                    if (res.ok) {
                        const dbProducts = await res.json();
                        const hydrated = checkoutItems.map(item => {
                            if (item.product && item.product.name) return item;
                            const targetId = item.id || item.product;
                            const found = dbProducts.find(p => p._id === targetId || p.legacyId === targetId);
                            if (found) {
                                return {
                                    product: {
                                        id: found._id,
                                        name: found.name,
                                        price: found.price,
                                        image: found.imageUrl,
                                        collection: found.collectionName || found.category || 'Signature Atelier'
                                    },
                                    quantity: item.quantity || 1
                                };
                            }
                            return item;
                        });
                        setCheckoutItems(hydrated);
                        localStorage.setItem('dazzling_sky_checkout_items', JSON.stringify(hydrated));
                    }
                } catch (err) {
                    console.error('Failed to hydrate checkout items', err);
                }
            }
        };
        hydrateCheckoutItems();
    }, [checkoutItems]);

    // Delivery Options
    const deliveryOptions = [
        { id: 'standard', name: 'Standard Delivery', time: 'Delivered in 2-3 Days', price: 0 },
        { id: 'express', name: 'Express Delivery', time: 'Delivered in 24 Hours', price: 15.00 },
        { id: 'midnight', name: 'Midnight Surprise', time: 'Delivered at 12:00 AM Midnight', price: 25.00 }
    ];

    // Load initial delivery option or default to standard
    const [selectedDelivery, setSelectedDelivery] = useState(() => {
        const savedOption = localStorage.getItem('dazzling_sky_checkout_shipping_option');
        if (savedOption) {
            try {
                const parsed = JSON.parse(savedOption);
                if (parsed?.id) return parsed.id;
            } catch (e) {}
        }
        return 'standard';
    });

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
        if (e) e.preventDefault();
        
        if (!formData.firstName || !formData.address || !formData.city || !formData.phone || !formData.email) {
            alert('Please fill in all required delivery address fields (*)');
            return null;
        }

        const message = editingAddressId !== null 
            ? 'Delivery address updated successfully!' 
            : 'Delivery address saved successfully!';

        let savedId = editingAddressId;

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
            savedId = Date.now();
            const newAddress = {
                ...formData,
                id: savedId
            };
            setAddresses(prev => [...prev, newAddress]);
            setSelectedAddressId(savedId);
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
        return savedId;
    };

    // Trigger Edit
    const handleEditAddress = (addr, e) => {
        e.stopPropagation();
        setEditingAddressId(addr.id);
        setFormData({
            firstName: addr.firstName || '',
            lastName: addr.lastName || '',
            address: addr.address || '',
            apartment: addr.apartment || '',
            city: addr.city || '',
            state: addr.state || '',
            zipCode: addr.zipCode || '',
            phone: addr.phone || '',
            email: addr.email || ''
        });
        setShowForm(true);
    };

    const [deletingAddress, setDeletingAddress] = useState(null);

    // Trigger Delete
    const handleDeleteAddress = (address, e) => {
        e.stopPropagation();
        setDeletingAddress(address);
    };

    const handleConfirmDelete = () => {
        if (deletingAddress) {
            const remaining = addresses.filter(addr => addr.id !== deletingAddress.id);
            setAddresses(remaining);
            if (selectedAddressId === deletingAddress.id) {
                setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
                if (remaining.length === 0) {
                    setShowForm(true);
                }
            }
            setDeletingAddress(null);
        }
    };

    const handleCancelDelete = () => {
        setDeletingAddress(null);
    };

    // Handle Payment navigation (following checkout workflow)
    const handleProceedToPayment = () => {
        if (checkoutItems.length === 0) {
            alert('Your cart is empty. Please add floral items to your bag before proceeding to payment.');
            navigate('/shop');
            return;
        }

        let activeAddr = addresses.find(a => a.id === selectedAddressId);

        // If user is currently typing in the form and clicks proceed without clicking save address first, auto-save and use it
        if (!activeAddr && showForm) {
            if (formData.firstName && formData.address && formData.city && formData.phone && formData.email) {
                const newId = Date.now();
                const newAddr = { ...formData, id: newId };
                setAddresses(prev => [...prev, newAddr]);
                setSelectedAddressId(newId);
                activeAddr = newAddr;
                setShowForm(false);
            }
        }

        if (!activeAddr) {
            alert('Please provide and select a delivery address to proceed.');
            setShowForm(true);
            return;
        }

        // Save selected address object and formatted string to localStorage for payment & order confirmation
        const formattedAddrStr = `${activeAddr.firstName} ${activeAddr.lastName || ''}, ${activeAddr.address}${activeAddr.apartment ? `, ${activeAddr.apartment}` : ''}, ${activeAddr.city}, ${activeAddr.state || ''} ${activeAddr.zipCode || ''}`.trim();
        
        localStorage.setItem('dazzling_sky_checkout_address', formattedAddrStr);
        localStorage.setItem('dazzling_sky_checkout_address_obj', JSON.stringify({
            fullName: `${activeAddr.firstName} ${activeAddr.lastName || ''}`.trim(),
            address: `${activeAddr.address}${activeAddr.apartment ? `, ${activeAddr.apartment}` : ''}`,
            city: activeAddr.city,
            state: activeAddr.state || '',
            postalCode: activeAddr.zipCode || '',
            phone: activeAddr.phone,
            email: activeAddr.email
        }));

        // Save selected delivery option
        const selectedOpt = deliveryOptions.find(opt => opt.id === selectedDelivery) || deliveryOptions[0];
        localStorage.setItem('dazzling_sky_checkout_shipping_option', JSON.stringify(selectedOpt));
        localStorage.setItem('dazzling_sky_checkout_shipping_cost', selectedOpt.price.toString());
        localStorage.setItem('dazzling_sky_checkout_tax', tax.toFixed(2));
        localStorage.setItem('dazzling_sky_checkout_total', total.toFixed(2));

        navigate('/payment');
    };

    // Calculate Summary Values strictly from active items
    const subtotal = checkoutItems.reduce((sum, item) => {
        const price = item.product?.price || item.price || 0;
        const qty = item.quantity || 1;
        return sum + (price * qty);
    }, 0);

    const selectedOption = deliveryOptions.find(opt => opt.id === selectedDelivery) || deliveryOptions[0];
    const shippingCost = selectedOption.price;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    const totalItemCount = checkoutItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

    return (
        <div className={styles.shippingPageWrapper}>
            <div className={styles.shippingContainer}>
                
                {/* Stepper Header */}
                <header className={styles.pageHeader}>
                    <div className={styles.stepper}>
                        <Link to="/cart" className={styles.stepCompleted} style={{ textDecoration: 'none' }}>01. Cart</Link>
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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                                    {addresses.length > 0 ? 'Select Delivery Address' : 'Recipient Address'}
                                </h2>
                                {!showForm && addresses.length > 0 && (
                                    <button 
                                        type="button"
                                        className={styles.addNewBtn}
                                        onClick={() => {
                                            setEditingAddressId(null);
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
                                            setShowForm(true);
                                        }}
                                    >
                                        <Plus size={14} /> Add New Address
                                    </button>
                                )}
                            </div>

                            {/* Saved Address Cards (strictly real user addresses) */}
                            {addresses.length > 0 && (
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
                                                    {addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}, {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zipCode}
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
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    className={`${styles.actionIconBtn} ${styles.actionDeleteBtn}`} 
                                                    onClick={(e) => handleDeleteAddress(addr, e)}
                                                    title="Delete Address"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Address Entry / Edit Form (Shown when no address saved or user clicks Add/Edit) */}
                        {showForm && (
                            <form className={styles.addressForm} onSubmit={handleSaveAddress}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <MapPin size={18} color="#ff8ad8" />
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                                        {editingAddressId !== null ? 'Edit Delivery Address' : (addresses.length === 0 ? 'Enter Recipient Delivery Details' : 'Add New Delivery Address')}
                                    </h3>
                                </div>
                                <p style={{ fontSize: '12.5px', color: 'rgba(229, 226, 225, 0.6)', margin: '0 0 20px 0' }}>
                                    Please provide accurate recipient contact info for luxury courier dispatch.
                                </p>

                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>First Name *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Olivia" 
                                            required 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Last Name</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Laurent" 
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
                                            placeholder="House / building number and street name" 
                                            required 
                                        />
                                    </div>
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                        <label className={styles.inputLabel}>Apartment, Suite, Unit (Optional)</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="apartment" 
                                            value={formData.apartment}
                                            onChange={handleInputChange}
                                            placeholder="Apt, Suite, Unit, Floor, etc." 
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
                                            placeholder="City"
                                            required 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>State / Province</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="text" 
                                            name="state" 
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="State or Region" 
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
                                            placeholder="Postal code"
                                            required 
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Phone Number *</label>
                                        <input 
                                            className={styles.textInput} 
                                            type="tel" 
                                            name="phone" 
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Contact phone for courier"
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
                                            placeholder="For delivery tracking updates"
                                            required 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                    <button type="submit" className={styles.paymentBtn} style={{ padding: '12px 32px', borderRadius: '12px', fontSize: '13px' }}>
                                        {editingAddressId !== null ? 'Update Address' : 'Save & Select Address'}
                                    </button>
                                    {addresses.length > 0 && (
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
                                    )}
                                </div>
                            </form>
                        )}

                        {/* Delivery Method Selection */}
                        <div style={{ marginTop: '20px' }}>
                            <h2 className={styles.sectionTitle} style={{ marginBottom: '16px' }}>Delivery Options</h2>
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
                                            onChange={() => {}}
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

                    </div>

                    {/* Right Summary Column with Product Preview & Totals */}
                    <aside className={styles.summarySection}>
                        <h2 className={styles.summaryTitle}>Summary</h2>

                        {/* Botanical Items Preview (Right Side) */}
                        <div className={styles.previewContainer}>
                            <div className={styles.previewHeader}>
                                <h3 className={styles.previewTitle}>
                                    <ShoppingBag size={15} color="#ff8ad8" />
                                    <span>Selected Items</span>
                                </h3>
                                <span className={styles.previewCountBadge}>
                                    {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
                                </span>
                            </div>

                            {checkoutItems.length === 0 ? (
                                <div className={styles.emptyPreviewNote}>
                                    No items in current selection.<br />
                                    <Link to="/shop" style={{ color: '#ff8ad8', textDecoration: 'none', fontWeight: '600', marginTop: '8px', display: 'inline-block' }}>
                                        Explore Boutique Collection →
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.previewItemList}>
                                    {checkoutItems.map((item, idx) => {
                                        const prod = item.product || item;
                                        const imgUrl = prod.image || prod.imageUrl || '/images/card1.jpg';
                                        const itemPrice = Number(prod.price || 0);
                                        const quantity = item.quantity || 1;
                                        const lineTotal = itemPrice * quantity;

                                        return (
                                            <div key={idx} className={styles.previewItem}>
                                                <div className={styles.previewItemImgWrap}>
                                                    <img 
                                                        src={getImageSrc(imgUrl)} 
                                                        alt={prod.name || 'Floral Arrangement'} 
                                                        className={styles.previewItemImg}
                                                        onError={(e) => { e.target.src = '/images/card1.jpg'; }}
                                                    />
                                                    <span className={styles.previewQtyBadge}>
                                                        {quantity}
                                                    </span>
                                                </div>

                                                <div className={styles.previewItemDetails}>
                                                    <h4 className={styles.previewItemName} title={prod.name}>
                                                        {prod.name}
                                                    </h4>
                                                    <div className={styles.previewItemMeta}>
                                                        <span>{prod.collection || prod.category || 'Signature Floral'}</span>
                                                        <span>•</span>
                                                        <span>${itemPrice.toFixed(2)} each</span>
                                                    </div>
                                                </div>

                                                <div className={styles.previewItemPrice}>
                                                    ${lineTotal.toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown Rows */}
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping ({selectedOption ? selectedOption.name : 'Standard'})</span>
                                <span style={{ color: shippingCost === 0 ? '#4ade80' : '#ff8ad8', fontWeight: '600' }}>
                                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Estimated Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryDivider}></div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span className={styles.totalPrice}>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Proceed to Payment CTA */}
                        <button 
                            type="button" 
                            onClick={handleProceedToPayment} 
                            className={styles.paymentBtn}
                            disabled={checkoutItems.length === 0}
                            style={{ opacity: checkoutItems.length === 0 ? 0.6 : 1, cursor: checkoutItems.length === 0 ? 'not-allowed' : 'pointer' }}
                        >
                            <span>Proceed to Payment</span>
                            <ArrowRight size={18} />
                        </button>
                        
                        <button type="button" className={styles.backToCartBtn} onClick={() => navigate('/cart')}>
                            <ArrowLeft size={16} />
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
                            <AlertCircle size={32} color="#f87171" />
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
                        <CheckCircle size={22} color="#4ade80" />
                        <div className={styles.popupInfo}>
                            <h4 className={styles.popupTitle}>Success</h4>
                            <p className={styles.popupName}>{addressPopupMessage}</p>
                        </div>
                        <button className={styles.popupBtnClose} onClick={() => setAddressPopupMessage(null)}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

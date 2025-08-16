// Show toast notification
function showToast(message, duration = 3000) {
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// حماية الموقع من النسخ والسرقة
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showToast('هذا الإجراء غير مسموح به', 2000);
    return false;
});

// منع اختصارات لوحة المفاتيح
const blockedKeys = [67, 85, 73, 83]; // c, u, i, s
const blockedKeyCombinations = [
    { ctrl: true, key: 'u' },
    { ctrl: true, key: 'U' },
    { ctrl: true, shift: true, key: 'I' },
    { ctrl: true, shift: true, key: 'i' },
    { ctrl: true, key: 's' },
    { ctrl: true, key: 'S' },
    { meta: true, key: 'u' },
    { meta: true, key: 'U' }
];

document.addEventListener('keydown', function(e) {
    // منع F12 و Ctrl+Shift+I و Ctrl+Shift+J و Ctrl+Shift+C
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))
    ) {
        e.preventDefault();
        showToast('عذراً، هذا الإجراء غير مسموح به', 2000);
        return false;
    }
    
    // منع النسخ والقص واللصق
    if (e.ctrlKey || e.metaKey) {
        if (['c', 'x', 'u', 's', 'C', 'X', 'U', 'S'].includes(e.key)) {
            e.preventDefault();
            return false;
        }
    }
});

// منع سحب الصور
window.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// حماية إضافية للصور
function protectImages() {
    // منع فتح الصور في نافذة جديدة
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // إزالة خاصية src من الصور عند محاولة فحصها
    const images = document.getElementsByTagName('img');
    for (let img of images) {
        const originalSrc = img.src;
        img.setAttribute('data-original', originalSrc);
        
        // إضافة مستمع لحدث contextmenu
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // حماية إضافية للصور
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
        img.style.webkitUserDrag = 'none';
        img.style.MozUserSelect = 'none';
        img.style.msUserSelect = 'none';
    }
}

// Add touch event listeners for better mobile interaction
document.addEventListener('DOMContentLoaded', function() {
    // تشغيل حماية الصور
    protectImages();
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('active');
        });
        button.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
});

// Function to get current location (kept for reference, not used in the form anymore)
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                return locationLink;
            },
            (error) => {
                console.error('Error getting location:', error);
                return null;
            }
        );
    }
    return null;
}

// Handle location errors
function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert('من فضلك اسمح للموقع بتحديد مكانك');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('معلومات الموقع غير متوفرة');
            break;
        case error.TIMEOUT:
            alert('انتهت مهلة طلب تحديد الموقع');
            break;
        default:
            alert('حدث خطأ غير معروف');
            break;
    }
}

function sendOrder(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const pickupAddress = document.getElementById('pickupAddress').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const orderDetails = document.getElementById('orderDetails').value;
    const complaints = document.getElementById('complaints').value;

    if (!fullName || !phone || !pickupAddress || !deliveryAddress || !orderDetails) {
        alert('من فضلك أكمل كل البيانات المطلوبة');
        return false;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentIcon = paymentMethod === 'cash' ? '💵' : '💳';
    const paymentText = paymentMethod === 'cash' ? 'كاش' : 'محفظة إلكترونية';

    const message = `شركه ال عسكر للنقل والشحن  ⚡️
` +
        `--------------------------------
` +
        `طلب جديد 📦
` +
        `--------------------------------
` +
        `👤 الاسم: ${fullName}
` +
        `📱 رقم الهاتف: ${phone}
` +
        `📍 *عنوان الاستلام:* ${pickupAddress}
` +
        `📍 *عنوان التسليم:* ${deliveryAddress}
` +
        `${paymentIcon} طريقة الدفع: ${paymentText}\n` +
        `--------------------------------
` +
        `🛒 تفاصيل :
${orderDetails}\n` +
        `--------------------------------
` +
        (complaints ? `📝 الشكاوى والملاحظات:
${complaints}\n` + `--------------------------------
` : '') +
        `🕒 *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}
` +
        `--------------------------------\n` +
        `شكراً لاختياركنا! 🙏`;

    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً 🚀');

    document.getElementById('fullName').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('pickupAddress').value = '';
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('orderDetails').value = '';
    document.getElementById('complaints').value = '';
    document.querySelector('input[name="paymentMethod"]:checked').checked = false;

    window.location.href = `https://wa.me/201117389344?text=${encodeURIComponent(message)}`;
    return false;
}

// Submit order
function submitOrder() {
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const orderDetails = document.getElementById('orderDetails').value;
    const notes = document.getElementById('notes').value;

    if (!fullName || !phone || !address || !orderDetails) {
        alert('من فضلك أكمل كل البيانات المطلوبة');
        return;
    }

    // Format the order message
    const message = `🛍️ *طلب جديد*\n\n` +
        `👤 *الاسم:* ${fullName}\n` +
        `📱 *رقم الهاتف:* ${phone}\n` +
        `📍 *مكان التسليم:* ${address}\n\n` +
        `🛒 *تفاصيل الطلب:*\n${orderDetails}\n\n` +
        (notes ? `📝 *ملاحظات إضافية:*\n${notes}\n\n` : '') +
        `\n🕒 *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}`;

    // Save order to local storage
    saveOrder({
        fullName,
        phone,
        address,
        orderDetails,
        notes,
        timestamp: new Date().toLocaleString()
    });

    // فتح الواتساب مباشرة مع الرسالة
    const whatsappUrl = `https://wa.me/201117389344?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;

    // Clear the form
    clearForm();
}

// Save order to local storage
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Clear the form after submission
function clearForm() {
    document.getElementById('fullName').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('orderDetails').value = '';
    document.getElementById('notes').value = '';
}

// Save user name
function saveUserName() {
    const userName = document.getElementById('userName').value;
    if (userName.trim()) {
        localStorage.setItem('userName', userName);
        currentUser = userName;
        checkUser();
        updateUserInfo();
        
        // Log user activity
        const timestamp = new Date().toLocaleString();
        const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
        userActivity.push({ user: userName, timestamp: timestamp });
        localStorage.setItem('userActivity', JSON.stringify(userActivity));
    }
}

// Check if user is logged in
function checkUser() {
    const loginSection = document.getElementById('loginSection');
    if (currentUser) {
        loginSection.style.display = 'none';
    } else {
        loginSection.style.display = 'block';
    }
}

// Update user info display
function updateUserInfo() {
    const userInfo = document.getElementById('userInfo');
    if (currentUser) {
        userInfo.innerHTML = `أهلاً ${currentUser} | <button onclick="logout()">تسجيل خروج</button>`;
    } else {
        userInfo.innerHTML = '';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userName');
    currentUser = null;
    cart = [];
    updateCart();
    checkUser();
    updateUserInfo();
}

// Submit order
function submitOrder() {
    if (cart.length === 0) {
        alert('السلة فارغة');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const orderDetails = cart.map(item => item.name).join('\n');
    const message = `طلب جديد من: ${currentUser}\n\nالطلبات:\n${orderDetails}\n\nالمجموع: ${total} جنيه`;
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/201117389344?text=${encodeURIComponent(message)}`, '_blank');
    
    // Clear cart after order
    cart = [];
    updateCart();
}

// Initialize the page when loaded
window.onload = init;

// Add scroll effect for navigation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
    } else {
        nav.style.transform = 'translateY(-100%)';
    }
});

// Add smooth transition
document.querySelector('nav').style.transition = 'transform 0.3s ease-in-out';

// Scroll Variables
let lastScrollTop = 0;
const header = document.querySelector('header');
const delta = 5;
const navbarHeight = header.offsetHeight;

// Back to top button functionality
const backToTopButton = document.querySelector('.back-to-top');

// Handle scroll events for header and back to top button
window.addEventListener('scroll', function() {
    // Back to top button logic
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }

    // Header scroll logic
    const st = window.pageYOffset;

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta) return;

    // If scrolled down and are past the navbar, add class nav-up
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scroll Up
        if (st + window.innerHeight < document.documentElement.scrollHeight) {
            header.style.transform = 'translateY(0)';
            header.style.backgroundColor = st > 50 ? 'rgba(0, 0, 0, 0.98)' : 'transparent';
        }
    }

    lastScrollTop = st;
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // تفعيل جميع الروابط للتمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // تجاهل الروابط التي تشير إلى #

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // إضافة تأثير حركي عند النقر على الزر
                this.classList.add('clicked');
                setTimeout(() => this.classList.remove('clicked'), 200);

                // التمرير السلس إلى القسم
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });

                // إذا كان هناك قائمة منسدلة مفتوحة، أغلقها
                const nav = document.querySelector('nav');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            }
        });
    });
});

// Add scroll event listener for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = '#fff';
    }
});

// Modal functionality for menu images
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

// Add click event to all menu images
document.querySelectorAll('.menu-image-item img').forEach(img => {
    img.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
    });
});

// Close modal when clicking the X
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
    if (e.key === 'Escape' && cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
    }
});

// Shopping Cart Functionality
let cart = [];
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const closeCartModal = cartModal.querySelector('.close-modal');

// Add to Cart functionality
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        const menuItem = this.closest('.menu-item');
        const selectedSize = menuItem.querySelector('.size-btn.selected');
        
        if (!selectedSize) {
            alert('الرجاء اختيار الحجم أولاً');
            return;
        }

        const name = menuItem.querySelector('h4').textContent;
        const size = selectedSize.dataset.size;
        const price = parseInt(selectedSize.textContent.match(/\d+/)[0]);

        cart.push({ name, size, price });
        updateCart();

        // Animation effect
        this.innerHTML = '<i class="fas fa-check"></i> تم الإضافة';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-cart-plus"></i> أضف للسلة';
        }, 1500);
    });
});

// Size selection
document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', function() {
        const menuItem = this.closest('.menu-item');
        menuItem.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Cart icon click
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
});

// Close cart modal
closeCartModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Update cart display
function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>الحجم: ${getSizeInArabic(item.size)}</p>
            </div>
            <div class="cart-item-price">
                ${item.price} ج.م
                <button onclick="removeFromCart(${index})" class="remove-item">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });

    totalPrice.textContent = total;
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Convert size to Arabic
function getSizeInArabic(size) {
    const sizes = {
        'small': 'صغير',
        'medium': 'وسط',
        'large': 'كبير'
    };
    return sizes[size];
}

// WhatsApp order
document.getElementById('whatsappOrder').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('السلة فارغة');
        return;
    }

    let message = 'طلب جديد:\n\n';
    let total = 0;

    cart.forEach(item => {
        message += `${item.name} (${getSizeInArabic(item.size)}) - ${item.price} ج.م\n`;
        total += item.price;
    });

    message += `\nالمجموع: ${total} ج.م`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/201003410708?text=${encodedMessage}`, '_blank');
});

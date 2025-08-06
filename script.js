// Bundle Builder Application

const minItems = 3;
let selectedCount = 0;

function updateProgressBar(count) {
  const progressBar = document.getElementById('progressBar');
  const progressCount = document.getElementById('progressCount');
  const percent = Math.min((count / minItems) * 100, 100);
  progressBar.style.width = percent + '%';
  progressCount.textContent = count;
}

class BundleBuilder {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Tie-Dye Lounge Set",
                price: 150.00,
                image: 'product1.svg',
                selected: false
            },
            {
                id: 2, 
                name: "Sunburst Tracksuit",
                price: 150.00,
                image: 'product2.png',
                selected: false
            },
            {
                id: 3,
                name: "Retro Red Streetwear", 
                price: 150.00,
                image: 'product3.svg',
                selected: false
            },
            {
                id: 4,
                name: "Urban Sportwear Combo",
                price: 150.00,
                image: 'product4.svg',
                selected: false
            },
            {
                id: 5,
                name: "Oversized Knit & Coat",
                price: 150.00,
                image: 'product5.svg',
                selected: false
            },
            {
                id: 6,
                name: "Chic Monochrome Blazer",
                price: 150.00,
                image: 'product6.svg',
                selected: false
            }
        ];

        this.bundleSettings = {
            discountThreshold: 3,
            discountPercentage: 30,
            minimumItems: 3
        };

        this.bundle = new Map(); // productId -> quantity
        this.init();
    }

    init() {
        this.renderProducts();
        this.initializeBundle();
        this.bindEvents();
        this.updateUI();
    }

    renderProducts() {
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';

        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;

        const isSelected = product.selected || this.bundle.has(product.id);
        const buttonText = isSelected ? 'Added to Bundle' : 'Add to Bundle';
        const buttonClass = isSelected ? 'added' : '';
        const checkmark = isSelected ? '<svg class="checkmark" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>' : '';

        card.innerHTML = `
    <div class="product-image">
        <img src="images/${product.image}" alt="${product.name}" style="width: 212px;">
    </div>
    <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
    </div>
    <button class="add-to-bundle-btn ${buttonClass}" data-product-id="${product.id}">
        ${checkmark}
        ${buttonText}
    </button>
`;

        return card;
    }

    initializeBundle() {
        // Add pre-selected products to bundle
        this.products.forEach(product => {
            if (product.selected) {
                this.bundle.set(product.id, 1);
            }
        });
    }

    bindEvents() {
        // Product selection - use event delegation properly
        document.getElementById('productGrid').addEventListener('click', (e) => {
            // Check if the clicked element is the button or a child of the button
            let button = e.target;
            if (!button.classList.contains('add-to-bundle-btn')) {
                button = e.target.closest('.add-to-bundle-btn');
            }
            
            if (button && button.classList.contains('add-to-bundle-btn')) {
                e.preventDefault();
                const productId = parseInt(button.dataset.productId);
                this.toggleProductInBundle(productId);
            }
        });

        // Quantity controls and remove buttons
        document.getElementById('selectedProducts').addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('[data-product-id]')?.dataset.productId);
            
            if (!productId) return;

            if (e.target.classList.contains('quantity-btn')) {
                const action = e.target.dataset.action;
                if (action === 'increase') {
                    this.changeQuantity(productId, 1);
                } else if (action === 'decrease') {
                    this.changeQuantity(productId, -1);
                }
            } else if (e.target.classList.contains('remove-btn')) {
                this.removeFromBundle(productId);
            }
        });

        // Proceed button
        document.getElementById('proceedButton').addEventListener('click', () => {
            if (this.getTotalItems() >= this.bundleSettings.minimumItems) {
                alert('Proceeding to checkout with your bundle!');
            }
        });
    }

    toggleProductInBundle(productId) {
        if (this.bundle.has(productId)) {
            this.removeFromBundle(productId);
        } else {
            this.addToBundle(productId, 1);
        }
    }

    addToBundle(productId, quantity = 1) {
        const currentQuantity = this.bundle.get(productId) || 0;
        this.bundle.set(productId, currentQuantity + quantity);
        this.updateUI();
    }

    removeFromBundle(productId) {
        this.bundle.delete(productId);
        this.updateUI();
    }

    changeQuantity(productId, change) {
        const currentQuantity = this.bundle.get(productId) || 0;
        const newQuantity = Math.max(0, currentQuantity + change);
        
        if (newQuantity === 0) {
            this.removeFromBundle(productId);
        } else {
            this.bundle.set(productId, newQuantity);
            this.updateUI();
        }
    }

    updateUI() {
        this.updateProductButtons();
        this.updateSelectedProducts();
        this.updateProgress();
        this.updateSummary();
        this.updateProceedButton();
    }

    updateProductButtons() {
        this.products.forEach(product => {
            // Select the button specifically within the product card
            const productCard = document.querySelector(`.product-card[data-product-id="${product.id}"]`);
            const button = productCard?.querySelector('.add-to-bundle-btn');
            
            if (!button) return;
            
            const isSelected = this.bundle.has(product.id);
            
            if (isSelected) {
                button.classList.add('added');
                button.innerHTML = `
                    <svg class="checkmark" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    Added to Bundle
                `;
            } else {
                button.classList.remove('added');
                button.innerHTML = 'Add to Bundle';
            }
        });
    }

    updateSelectedProducts() {
        const container = document.getElementById('selectedProducts');
        const emptyState = document.getElementById('emptyState');
        
        if (this.bundle.size === 0) {
            emptyState.style.display = 'block';
            container.querySelectorAll('.selected-item').forEach(item => item.remove());
            return;
        }

        emptyState.style.display = 'none';
        
        // Remove items no longer in bundle
        container.querySelectorAll('.selected-item').forEach(item => {
            const productId = parseInt(item.dataset.productId);
            if (!this.bundle.has(productId)) {
                item.remove();
            }
        });

        // Add or update items in bundle
        this.bundle.forEach((quantity, productId) => {
            const product = this.products.find(p => p.id === productId);
            let itemElement = container.querySelector(`[data-product-id="${productId}"]`);
            
            if (!itemElement) {
                itemElement = this.createSelectedItem(product, quantity);
                container.appendChild(itemElement);
            } else {
                this.updateSelectedItem(itemElement, quantity);
            }
        });
    }

    createSelectedItem(product, quantity) {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.dataset.productId = product.id;

        item.innerHTML = `
    <div class="item-thumbnail">
        <img src="images/${product.image}" alt="${product.name}" style="width: 40px;">
    </div>
    <div class="item-details">
        <div class="item-name">${product.name}</div>
        <div class="item-price">$${product.price.toFixed(2)} each</div>
    </div>
    <div class="quantity-controls">
        <button class="quantity-btn" data-action="decrease" ${quantity <= 1 ? 'disabled' : ''}>−</button>
        <span class="quantity-display">${quantity}</span>
        <button class="quantity-btn" data-action="increase">+</button>
    </div>
    <button class="remove-btn" title="Remove from bundle">×</button>
`;

        return item;
    }

    updateSelectedItem(itemElement, quantity) {
        const quantityDisplay = itemElement.querySelector('.quantity-display');
        const decreaseBtn = itemElement.querySelector('[data-action="decrease"]');
        
        quantityDisplay.textContent = quantity;
        decreaseBtn.disabled = quantity <= 1;
    }

    updateProgress() {
        const totalItems = this.getTotalItems();
        selectedCount = totalItems;
        updateProgressBar(selectedCount);
    }

    updateSummary() {
        const subtotal = this.getSubtotal();
        const hasDiscount = this.getTotalItems() >= this.bundleSettings.discountThreshold;
        const discountAmount = hasDiscount ? subtotal * (this.bundleSettings.discountPercentage / 100) : 0;
        const total = subtotal - discountAmount;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;

        const discountRow = document.getElementById('discountRow');
        const discountAmountEl = document.getElementById('discountAmount');
        
        if (hasDiscount) {
            discountRow.style.display = 'flex';
            discountAmountEl.textContent = `-$${discountAmount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    updateProceedButton() {
        const button = document.getElementById('proceedButton');
        const remainingItems = document.getElementById('remainingItems');
        const totalItems = this.getTotalItems();
        const remaining = Math.max(0, this.bundleSettings.minimumItems - totalItems);
        

        if (totalItems >= this.bundleSettings.minimumItems) {
            button.disabled = false;
            button.textContent = 'Proceed to Checkout';
        } else {
            button.disabled = true;
            remainingItems.textContent = remaining;
            button.innerHTML = `Add <span id="remainingItems">${remaining}</span> Items to Proceed`;
        }
    }

    getTotalItems() {
        return Array.from(this.bundle.values()).reduce((sum, quantity) => sum + quantity, 0);
    }

    getSubtotal() {
        let subtotal = 0;
        this.bundle.forEach((quantity, productId) => {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                subtotal += product.price * quantity;
            }
        });
        return subtotal;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BundleBuilder();
});
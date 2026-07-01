document.addEventListener("DOMContentLoaded", (event) => {
    // preloader
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
    document.body.style.position = 'static';

    // HEADER NAV IN MOBILE
    if (document.querySelector(".ul-header-nav")) {
        const ulSidebar = document.querySelector(".ul-sidebar");
        const ulSidebarOpener = document.querySelector(".ul-header-sidebar-opener");
        const ulSidebarCloser = document.querySelector(".ul-sidebar-closer");
        const ulMobileMenuContent = document.querySelector(".to-go-to-sidebar-in-mobile");
        const ulHeaderNavMobileWrapper = document.querySelector(".ul-sidebar-header-nav-wrapper");
        const ulHeaderNavOgWrapper = document.querySelector(".ul-header-nav-wrapper");

        function updateMenuPosition() {
            if (window.innerWidth < 992) {
                ulHeaderNavMobileWrapper.appendChild(ulMobileMenuContent);
            }

            if (window.innerWidth >= 992) {
                ulHeaderNavOgWrapper.appendChild(ulMobileMenuContent);
            }
        }

        updateMenuPosition();

        window.addEventListener("resize", () => {
            updateMenuPosition();
        });

        ulSidebarOpener.addEventListener("click", () => {
            ulSidebar.classList.add("active");
        });

        ulSidebarCloser.addEventListener("click", () => {
            ulSidebar.classList.remove("active");
        });


        // menu dropdown/submenu in mobile
        const ulHeaderNavMobile = document.querySelector(".ul-header-nav");
        if (ulHeaderNavMobile) {
            const ulHeaderNavMobileItems = ulHeaderNavMobile.querySelectorAll(".has-sub-menu");
            ulHeaderNavMobileItems.forEach((item) => {
                const triggerLink = item.querySelector(":scope > a");
                if (triggerLink) {
                    triggerLink.addEventListener("click", (e) => {
                        if (window.innerWidth < 992) {
                            e.preventDefault();
                            item.classList.toggle("active");
                        }
                    });
                }
            });
        }
    }

    // header search in mobile start
    const ulHeaderSearchOpener = document.querySelector(".ul-header-mobile-search-opener");
    const ulHeaderSearchCloser = document.querySelector(".ul-header-mobile-search-closer");
    if (ulHeaderSearchOpener) {
        ulHeaderSearchOpener.addEventListener("click", () => {
            document.querySelector(".ul-header-search-form-wrapper").classList.add("active");
        });
    }

    if (ulHeaderSearchCloser) {
        ulHeaderSearchCloser.addEventListener("click", () => {
            document.querySelector(".ul-header-search-form-wrapper").classList.remove("active");
        });
    }
    // header search in mobile end

    // sticky header
    const headerBottom = document.querySelector(".ul-header-bottom");
    if (headerBottom) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 150) {
                headerBottom.classList.add("is-sticky");
            } else {
                headerBottom.classList.remove("is-sticky");
            }
        });
    }

    if (document.querySelector(".ul-header-top-slider")) {
        new Splide('.ul-header-top-slider', {
            arrows: false,
            pagination: false,
            type: 'loop',
            drag: 'free',
            focus: 'center',
            perPage: 9,
            autoWidth: true,
            gap: 15,
            autoScroll: {
                speed: 1.5,
            },
        }).mount(window.splide.Extensions);
    }

    // search category
    if (document.querySelector("#ul-header-search-category")) {
        new SlimSelect({
            select: '#ul-header-search-category',
            settings: {
                showSearch: false,
            }
        })
    }

    // BANNER SLIDER
    const bannerSlider = new Swiper(".ul-banner-slider", {
        slidesPerView: 1,
        loop: true,
        // slideToClickedSlide: true,
        // effect: "fade",
        autoplay: true,
        navigation: {
            nextEl: ".ul-banner-slider-nav .next",
            prevEl: ".ul-banner-slider-nav .prev",
        },
    });

    // bannerThumbSlider.on('slideChange', function () {
    //     bannerSlider.slideTo(bannerThumbSlider.activeIndex);
    // });


    // products filtering 
    if (document.querySelector(".ul-filter-products-wrapper")) {
        mixitup('.ul-filter-products-wrapper');
    }


    // product slider
    new Swiper(".ul-products-slider-1", {
        slidesPerView: 3,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        navigation: {
            nextEl: ".ul-products-slider-1-nav .next",
            prevEl: ".ul-products-slider-1-nav .prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            480: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                spaceBetween: 20,
                slidesPerView: 4,
            },
            1400: {
                spaceBetween: 22,
                slidesPerView: 4,
            },
            1600: {
                spaceBetween: 26,
                slidesPerView: 4,
            },
            1700: {
                spaceBetween: 30,
                slidesPerView: 4,
            }
        }
    });

    // product slider
    new Swiper(".ul-products-slider-2", {
        slidesPerView: 3,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        navigation: {
            nextEl: ".ul-products-slider-2-nav .next",
            prevEl: ".ul-products-slider-2-nav .prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            480: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                spaceBetween: 20,
                slidesPerView: 4,
            },
            1400: {
                spaceBetween: 22,
                slidesPerView: 4,
            },
            1600: {
                spaceBetween: 26,
                slidesPerView: 4,
            },
            1700: {
                spaceBetween: 30,
                slidesPerView: 4,
            }
        }
    });

    // flash sale slider\
    new Swiper(".ul-flash-sale-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        breakpoints: {
            480: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            },
            1200: {
                spaceBetween: 20,
                slidesPerView: 4,
            },
            1680: {
                spaceBetween: 26,
                slidesPerView: 4,
            },
            1700: {
                spaceBetween: 30,
                slidesPerView: 4.7,
            }
        }
    })

    // reviews slider
    new Swiper(".ul-reviews-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            992: {
                spaceBetween: 20,
                slidesPerView: 3,
            },
            1200: {
                spaceBetween: 20,
                slidesPerView: 4,
            },
            1680: {
                slidesPerView: 4,
                spaceBetween: 26,
            },
            1700: {
                slidesPerView: 4,
                spaceBetween: 30,
            }
        }
    });

    // gallery slider
    new Swiper(".ul-gallery-slider", {
        slidesPerView: 3.2,
        loop: true,
        freeMode: true,
        freeModeMomentum: false,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        speed: 3500,
        centeredSlides: false,
        spaceBetween: 15,
        breakpoints: {
            480: {
                slidesPerView: 4.2,
            },
            576: {
                slidesPerView: 5,
            },
            768: {
                slidesPerView: 6,
            },
            992: {
                spaceBetween: 20,
                slidesPerView: 7,
            },
            1400: {
                spaceBetween: 24,
                slidesPerView: 8,
            },
            1680: {
                spaceBetween: 26,
                slidesPerView: 8.5,
            },
            1700: {
                spaceBetween: 28,
                slidesPerView: 9,
            },
            1920: {
                spaceBetween: 30,
                slidesPerView: 9.5,
            }
        }
    });



    // product details slider
    new Swiper(".ul-product-details-img-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        spaceBetween: 0,
        navigation: {
            nextEl: "#ul-product-details-img-slider-nav .next",
            prevEl: "#ul-product-details-img-slider-nav .prev",
        },
    });

    // search category
    if (document.querySelector("#ul-checkout-country")) {
        new SlimSelect({
            select: '#ul-checkout-country',
            settings: {
                showSearch: false,
                contentLocation: document.querySelector('.ul-checkout-country-wrapper')
            }
        })
    }

    // sidebar products slider
    new Swiper(".ul-sidebar-products-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        spaceBetween: 30,
        navigation: {
            nextEl: ".ul-sidebar-products-slider-nav .next",
            prevEl: ".ul-sidebar-products-slider-nav .prev",
        },
        breakpoints: {
            1400: {
                slidesPerView: 2,
            }
        }
    });

    // trust bar slider (mobile only)
    new Swiper(".ul-trust-slider", {
        slidesPerView: 2,
        loop: true,
        autoplay: {
            delay: 850,
            disableOnInteraction: false,
        },
        speed: 800,
        spaceBetween: 10,
        breakpoints: {
            576: {
                enabled: false,
            }
        }
    });


    // quantity field
    if (document.querySelector(".ul-product-quantity-wrapper")) {
        const quantityWrapper = document.querySelectorAll(".ul-product-quantity-wrapper");

        quantityWrapper.forEach((item) => {
            const quantityInput = item.querySelector(".ul-product-quantity");
            const quantityIncreaseButton = item.querySelector(".quantityIncreaseButton");
            const quantityDecreaseButton = item.querySelector(".quantityDecreaseButton");

            quantityIncreaseButton.addEventListener("click", function () {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            });
            quantityDecreaseButton.addEventListener("click", function () {
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                }
            });
        })
    }

    // parallax effect
    const parallaxImage = document.querySelector(".ul-video-cover");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener("scroll", parallaxEffect);
                parallaxEffect(); // Initialize position
            } else {
                window.removeEventListener("scroll", parallaxEffect);
            }
        });
    });

    if (parallaxImage) {
        observer.observe(parallaxImage);
    }

    function parallaxEffect() {
        const rect = parallaxImage.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const imageCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;

        // Calculate offset from viewport center
        const offset = (imageCenter - viewportCenter) * -0.5; // Adjust speed with multiplier

        parallaxImage.style.transform = `translateY(${offset}px)`;
    }

    // Accordion Logic
    const accordionItems = document.querySelectorAll('.ul-single-accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.ul-single-accordion-item__header');
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // close all other accordions
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('open');
                });

                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    // Product Quick View Logic
    const productCards = document.querySelectorAll('.ul-product, .ul-product-horizontal');
    const quickViewOffcanvas = document.getElementById('productQuickView');
    
    if (productCards.length > 0 && quickViewOffcanvas) {
        const bsOffcanvas = new bootstrap.Offcanvas(quickViewOffcanvas);
        
        productCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevent opening if clicked on actions like add to cart or wishlist
                if (e.target.closest('.ul-product-actions') || e.target.closest('.flaticon-shopping-bag') || e.target.closest('.flaticon-heart')) {
                    return;
                }
                
                // Prevent default navigation if clicking a link inside the card
                if (e.target.tagName.toLowerCase() === 'a') {
                    e.preventDefault();
                }

                // Extract data from the clicked card
                const imgEl = card.querySelector('.ul-product-img img, .ul-product-horizontal-img img');
                const titleEl = card.querySelector('.ul-product-title, .ul-product-horizontal-title');
                const priceEl = card.querySelector('.ul-product-price');
                const categoryEl = card.querySelector('.ul-product-category');
                const discountEl = card.querySelector('.ul-product-discount-tag');

                // Populate offcanvas elements
                if (imgEl) document.getElementById('qv-image').src = imgEl.src;
                if (titleEl) document.getElementById('qv-title').textContent = titleEl.textContent.trim();
                if (priceEl) document.getElementById('qv-price').textContent = priceEl.textContent.trim();
                if (categoryEl) {
                    document.getElementById('qv-category').textContent = categoryEl.textContent.trim();
                } else {
                    document.getElementById('qv-category').textContent = '';
                }
                
                const qvDiscount = document.getElementById('qv-discount');
                if (discountEl) {
                    qvDiscount.textContent = discountEl.textContent.trim();
                    qvDiscount.style.display = 'inline-block';
                } else {
                    qvDiscount.style.display = 'none';
                }

                // Show the offcanvas
                bsOffcanvas.show();
            });
        });
    }

    // --- CART OFFCANVAS LOGIC ---
    const cartOffcanvasEl = document.getElementById('cartOffcanvas');
    if (cartOffcanvasEl) {
        // Initialize cart logic when the offcanvas is opened or just once
        const cartItems = document.querySelectorAll('.ul-cart-item');
        
        function updateCartTotal() {
            const items = document.querySelectorAll('.ul-cart-item:not(.removing)');
            const totalEl = document.querySelector('.ul-cart-subtotal .amount');
            const countEls = document.querySelectorAll('.cart-count');
            
            let total = 0;
            let count = 0;
            items.forEach(item => {
                const priceText = item.querySelector('.ul-cart-price').textContent;
                const price = parseFloat(priceText.replace('$', ''));
                const qtyInput = item.querySelector('.ul-cart-quantity input');
                const qty = qtyInput ? parseInt(qtyInput.value) : 1;
                total += price * qty;
                count += 1; // Assuming counting number of unique items or you can use qty
            });
            
            if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
            countEls.forEach(el => el.textContent = count);
        }

        function checkEmptyCart() {
            const itemsContainer = document.querySelector('.ul-cart-body');
            const filledState = document.getElementById('ul-cart-filled');
            const emptyState = document.getElementById('ul-cart-empty');
            
            if (itemsContainer && itemsContainer.querySelectorAll('.ul-cart-item:not(.removing)').length === 0) {
                if (filledState) filledState.style.display = 'none';
                if (emptyState) emptyState.style.display = 'flex';
                document.querySelectorAll('.cart-count').forEach(el => el.textContent = '0');
            }
        }

        cartItems.forEach(item => {
            const minusBtn = item.querySelector('.minus');
            const plusBtn = item.querySelector('.plus');
            const input = item.querySelector('input');
            const removeBtn = item.querySelector('.ul-cart-remove');

            if (minusBtn && plusBtn && input) {
                minusBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    let val = parseInt(input.value);
                    if (val > 1) {
                        input.value = val - 1;
                        updateCartTotal();
                    }
                });
                plusBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    let val = parseInt(input.value);
                    input.value = val + 1;
                    updateCartTotal();
                });
                input.addEventListener('change', () => {
                    if (input.value < 1) input.value = 1;
                    updateCartTotal();
                });
            }

            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.add('removing');
                    setTimeout(() => {
                        item.remove();
                        updateCartTotal();
                        checkEmptyCart();
                    }, 300); // matches transition time
                });
            }
        });

        const checkoutBtn = document.querySelector('.ul-checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.add('loading');
                const loader = this.querySelector('.ul-btn-loader');
                if(loader) loader.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = 'Checkout.html';
                }, 600);
            });
        }
    }

});
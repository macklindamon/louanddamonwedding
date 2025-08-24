document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = window.innerWidth > 768 ? 80 : 20; // Reduced offset for sticky navbar
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll behavior - detect when sticky
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let navbarTicking = false;
    let navbarInitialTop = null;
    let navbarHeight = null;
    let navbarPlaceholder = null;

    // Get the initial position of the navbar and create placeholder
    if (navbar) {
        // Create a placeholder div to prevent content jumping
        navbarPlaceholder = document.createElement('div');
        navbarPlaceholder.style.display = 'none';
        navbar.parentNode.insertBefore(navbarPlaceholder, navbar.nextSibling);
        
        // Wait for the page to load to get accurate position
        window.addEventListener('load', () => {
            navbarInitialTop = navbar.offsetTop;
            navbarHeight = navbar.offsetHeight;
            navbarPlaceholder.style.height = navbarHeight + 'px';
        });
        
        // Fallback in case load event already fired
        setTimeout(() => {
            if (navbarInitialTop === null) {
                navbarInitialTop = navbar.offsetTop;
                navbarHeight = navbar.offsetHeight;
                navbarPlaceholder.style.height = navbarHeight + 'px';
            }
        }, 100);
    }

    function handleNavbarScroll() {
        if (!navbar || navbarInitialTop === null) return;
        
        const currentScrollY = window.scrollY;
        
        // Check if we've scrolled past the navbar's initial position
        if (currentScrollY >= navbarInitialTop) {
            navbar.classList.add('navbar-scrolled');
            navbarPlaceholder.style.display = 'block'; // Show placeholder to prevent jumping
            console.log('Navbar is fixed - glass effect ON');
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbarPlaceholder.style.display = 'none'; // Hide placeholder
            console.log('Navbar is relative - glass effect OFF');
        }
        
        lastScrollY = currentScrollY;
    }    // Parallax effect for floating leaves, floral corners, and floral top-right
    const floatingLeaves = document.querySelectorAll('.floating-leaf');
    const floralCorners = document.querySelectorAll('.floral-corner');
    const floralTopRight = document.querySelector('.floral-top-right');
    const floralTopLeft = document.querySelector('.floral-top-left');
    let parallaxTicking = false;

    function updateParallaxElements() {
        const scrolled = window.pageYOffset;
        const scrollDirection = scrolled > (window.lastScrollY || 0) ? 1 : -1;
        window.lastScrollY = scrolled;
        
        // Pre-calculate common values for performance
        const scrollFactor = scrolled * 0.001; // Normalized scroll value
        const time = Date.now() * 0.001; // Time for animation variation
        
        // Get section positions for scroll-triggered leaves
        const ceremonySection = document.getElementById('ceremony');
        const detailsSection = document.getElementById('details');
        const ceremonyTop = ceremonySection ? ceremonySection.offsetTop - window.innerHeight : 0;
        const detailsTop = detailsSection ? detailsSection.offsetTop : document.body.scrollHeight;
        
        // Handle floral top-right parallax (moves further to top-right as you scroll)
        if (floralTopRight) {
            const translateX = scrolled * 0.3; // Move further right
            const translateY = -(scrolled * 0.4); // Move further up
            
            // Calculate fade out based on scroll position
            // Start fading at 300px scroll, fully faded by 800px
            const fadeStart = 300;
            const fadeEnd = 800;
            let opacity = 1;
            
            if (scrolled >= fadeStart) {
                if (scrolled >= fadeEnd) {
                    opacity = 0;
                } else {
                    // Linear fade from 1 to 0 between fadeStart and fadeEnd
                    opacity = 1 - ((scrolled - fadeStart) / (fadeEnd - fadeStart));
                }
            }
            
            floralTopRight.style.setProperty('--scroll-offset-x', `${translateX}px`);
            floralTopRight.style.setProperty('--scroll-offset-y', `${translateY}px`);
            floralTopRight.style.opacity = opacity.toString();
        }
        
        // Handle floral top-left parallax (moves further to top-left as you scroll)
        if (floralTopLeft) {
            const translateX = -(scrolled * 0.3); // Move further left
            const translateY = -(scrolled * 0.4); // Move further up
            
            // Calculate fade out based on scroll position
            // Start fading at 300px scroll, fully faded by 800px
            const fadeStart = 300;
            const fadeEnd = 800;
            let opacity = 1;
            
            if (scrolled >= fadeStart) {
                if (scrolled >= fadeEnd) {
                    opacity = 0;
                } else {
                    // Linear fade from 1 to 0 between fadeStart and fadeEnd
                    opacity = 1 - ((scrolled - fadeStart) / (fadeEnd - fadeStart));
                }
            }
            
            floralTopLeft.style.setProperty('--scroll-offset-x', `${translateX}px`);
            floralTopLeft.style.setProperty('--scroll-offset-y', `${translateY}px`);
            floralTopLeft.style.opacity = opacity.toString();
        }
        
        // Handle floral corners parallax
        floralCorners.forEach(corner => {
            if (corner.classList.contains('bottom-left')) {
                // Move bottom-left corner up and slightly left
                const translateX = -(scrolled * 0.2);
                const translateY = -(scrolled * 0.3);
                corner.style.setProperty('--scroll-offset-x', `${translateX}px`);
                corner.style.setProperty('--scroll-offset-y', `${translateY}px`);
            } else if (corner.classList.contains('bottom-right')) {
                // Move bottom-right corner up and to the right (toward top-right)
                const translateX = scrolled * 0.25;
                const translateY = -(scrolled * 0.35);
                corner.style.setProperty('--scroll-offset-x', `${translateX}px`);
                corner.style.setProperty('--scroll-offset-y', `${translateY}px`);
            }
        });
        
        // Handle floating leaves (existing code)
        floatingLeaves.forEach((leaf, index) => {
            const speed = parseFloat(leaf.dataset.speed) || 0.3;
            const isLeftSide = leaf.classList.contains('leaf-1');
            const isTriggered = leaf.dataset.trigger;
            
            // Handle scroll-triggered leaves (leaf-3 and leaf-4)
            if (isTriggered) {
                if (leaf.classList.contains('leaf-3')) {
                    // Leaf 3: Special behavior - starts visible, fades out at 700px scroll
                    if (scrolled >= 500) {
                        // Fade out when 700px scroll is reached
                        leaf.style.opacity = '0';
                    } else {
                        // Stay visible before 700px scroll
                        leaf.style.opacity = '1';
                        
                        // Leaf 3: Moves diagonally right-up with optimized motion
                        const translateX = scrolled * speed * 0.7;
                        const translateY = -(scrolled * speed * 0.5) + Math.sin(scrollFactor * 15) * 20;
                        const rotation = (scrolled * 0.15) + Math.sin(scrollFactor * 12) * 25;
                        
                        leaf.style.setProperty('--scroll-offset-x', `${translateX}px`);
                        leaf.style.setProperty('--scroll-offset-y', `${translateY}px`);
                        leaf.style.setProperty('--scroll-rotation', `${rotation}deg`);
                    }
                } else if (leaf.classList.contains('leaf-4')) {
                    // Leaf 4: Original behavior - fade in at ceremony, fade out at details
                    if (scrolled >= ceremonyTop && scrolled < detailsTop) {
                        // Fade in when ceremony section is reached
                        leaf.style.opacity = '1';
                        
                        // Calculate relative scroll within the active range
                        const relativeScroll = scrolled - ceremonyTop;
                        
                        // Leaf 4: Moves diagonally left-down with optimized pattern
                        const translateX = -(relativeScroll * speed * 0.8);
                        const translateY = (relativeScroll * speed * 0.3) + Math.cos(relativeScroll * 0.01) * 25;
                        const rotation = -(relativeScroll * 0.18) + Math.cos(relativeScroll * 0.008) * 30;
                        
                        leaf.style.setProperty('--scroll-offset-x', `${translateX}px`);
                        leaf.style.setProperty('--scroll-offset-y', `${translateY}px`);
                        leaf.style.setProperty('--scroll-rotation', `${rotation}deg`);
                    } else {
                        // Fade out when outside the active range
                        leaf.style.opacity = '0';
                    }
                }
            } else {
                // Handle original leaves (leaf-1 and leaf-2) - always visible
                if (isLeftSide) {
                    // Leaf 1: Moves diagonally left-up with smooth rotation
                    const translateX = -(scrolled * speed * 1.0);
                    const translateY = -(scrolled * speed * 0.4) + Math.sin(scrollFactor * 10) * 12;
                    const rotation = (scrolled * 0.12) + Math.sin(scrollFactor * 8) * 15;
                    
                    leaf.style.setProperty('--scroll-offset-x', `${translateX}px`);
                    leaf.style.setProperty('--scroll-offset-y', `${translateY}px`);
                    leaf.style.setProperty('--scroll-rotation', `${rotation}deg`);
                } else {
                    // Leaf 2: Moves diagonally right-down with smooth rotation
                    const translateX = scrolled * speed * 0.7;
                    const translateY = (scrolled * speed * 0.5) + Math.cos(scrollFactor * 12) * 15;
                    const rotation = -(scrolled * 0.15) + Math.cos(scrollFactor * 10) * 20;
                    
                    leaf.style.setProperty('--scroll-offset-x', `${translateX}px`);
                    leaf.style.setProperty('--scroll-offset-y', `${translateY}px`);
                    leaf.style.setProperty('--scroll-rotation', `${rotation}deg`);
                }
            }
        });
    }

    // Optimized combined scroll handler with requestAnimationFrame
    function handleOptimizedScroll() {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                // Handle navbar scroll
                handleNavbarScroll();
                // Handle parallax elements
                updateParallaxElements();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }

    // Single scroll event listener for both navbar and parallax
    window.addEventListener('scroll', handleOptimizedScroll, { passive: true });

    // Timeline Animation on Scroll
    function initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Initialize timeline animations
    initTimelineAnimations();

    // Handle RSVP form functionality
    const rsvpForm = document.getElementById('rsvp-form');
    const partySizeSelect = document.getElementById('party-size');
    const addPersonBtn = document.getElementById('add-person');
    const personContainer = document.querySelector('.person-container');
    const eventSelection = document.getElementById('event-selection');
    const attendingRadios = document.querySelectorAll('input[name="attending"]');
    let personCount = 1;

    // Handle attendance radio buttons
    attendingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                eventSelection.style.display = 'block';
                partySizeSelect.closest('.mb-4').style.display = 'block';
                document.querySelector('.people-details').style.display = 'block';
            } else {
                eventSelection.style.display = 'none';
                partySizeSelect.closest('.mb-4').style.display = 'none';
                document.querySelector('.people-details').style.display = 'none';
            }
        });
    });

    // Handle party size change
    if (partySizeSelect) {
        partySizeSelect.addEventListener('change', function() {
            const selectedSize = parseInt(this.value);
            updatePersonEntries(selectedSize);
        });
    }

    // Add person functionality
    if (addPersonBtn) {
        addPersonBtn.addEventListener('click', function() {
            personCount++;
            addPersonEntry(personCount);
        });
    }

    function addPersonEntry(personNum) {
        const personEntry = document.createElement('div');
        personEntry.className = 'person-entry mb-4 p-3 border rounded';
        const isFirstPerson = personNum === 1;
        
        // Build the email field HTML only for the first person
        const emailFieldHTML = isFirstPerson ? `
            <div class="mb-3">
                <label class="form-label">Email (required)</label>
                <input type="email" class="form-control" name="person-${personNum}-email" required>
            </div>` : '';
        
        personEntry.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6>Person ${personNum}</h6>
                ${!isFirstPerson ? `<button type="button" class="btn btn-sm btn-outline-danger remove-person" data-person="${personNum}">
                    <i class="fas fa-times"></i> Remove
                </button>` : ''}
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" name="person-${personNum}-firstname" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="person-${personNum}-lastname" required>
                </div>
            </div>
            ${emailFieldHTML}
            <div class="mb-3">
                <label class="form-label">Dietary Requirements</label>
                <textarea class="form-control" name="person-${personNum}-dietary" rows="2" placeholder="Please specify any dietary requirements or allergies"></textarea>
            </div>
        `;
        
        personContainer.appendChild(personEntry);

        // Add remove functionality (only for non-first persons)
        if (!isFirstPerson) {
            const removeBtn = personEntry.querySelector('.remove-person');
            removeBtn.addEventListener('click', function() {
                personEntry.remove();
                renumberPersonEntries();
            });
        }
    }

    function updatePersonEntries(targetSize) {
        const currentEntries = personContainer.querySelectorAll('.person-entry').length;
        
        if (targetSize > currentEntries) {
            // Add more entries
            for (let i = currentEntries + 1; i <= targetSize; i++) {
                addPersonEntry(i);
            }
        } else if (targetSize < currentEntries) {
            // Remove excess entries (from the end) but don't recreate existing ones
            const entries = personContainer.querySelectorAll('.person-entry');
            for (let i = currentEntries - 1; i >= targetSize; i--) {
                entries[i].remove();
            }
        }
        
        personCount = targetSize;
        
        // Only renumber if we actually need to (when entries were removed)
        if (targetSize < currentEntries) {
            renumberPersonEntries();
        }
    }

    function renumberPersonEntries() {
        const entries = personContainer.querySelectorAll('.person-entry');
        entries.forEach((entry, index) => {
            const personNum = index + 1;
            const isFirstPerson = personNum === 1;
            const title = entry.querySelector('h6');
            if (title) title.textContent = `Person ${personNum}`;
            
            // Update all input names
            const inputs = entry.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const name = input.name;
                if (name) {
                    const baseName = name.replace(/person-\d+-/, '');
                    input.name = `person-${personNum}-${baseName}`;
                }
            });

            // Update remove button
            const removeBtn = entry.querySelector('.remove-person');
            if (removeBtn) {
                removeBtn.setAttribute('data-person', personNum);
                // Hide remove button for first person
                removeBtn.style.display = isFirstPerson ? 'none' : 'inline-block';
            }
        });
        
        personCount = entries.length;
    }

    // Handle form submission
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(rsvpForm);
            const rsvpData = {
                attending: formData.get('attending'),
                events: formData.getAll('events[]'),
                partySize: formData.get('party-size'),
                people: [],
                additionalNotes: formData.get('additional-notes')
            };

            // Collect person data
            for (let i = 1; i <= personCount; i++) {
                const person = {
                    firstName: formData.get(`person-${i}-firstname`),
                    lastName: formData.get(`person-${i}-lastname`),
                    dietary: formData.get(`person-${i}-dietary`)
                };
                
                // Only include email for the first person
                if (i === 1) {
                    person.email = formData.get(`person-${i}-email`);
                }
                
                if (person.firstName && person.lastName) {
                    rsvpData.people.push(person);
                }
            }

            // Here you would typically send the data to your server
            console.log('RSVP Data:', rsvpData);
            
            // For now, show a success message
            if (rsvpData.attending === 'yes') {
                alert(`Thank you for your RSVP! 
                
Attending: Yes
Events: ${rsvpData.events.length > 0 ? rsvpData.events.join(', ') : 'None selected'}
Party Size: ${rsvpData.people.length} people
                
We will be in touch soon.`);
            } else {
                alert(`Thank you for letting us know. We'll miss you but understand!`);
            }
            
            // Optionally reset the form
            // rsvpForm.reset();
            // personCount = 1;
            // updatePersonEntries(1);
        });
    }

    // Initialize form
    renumberPersonEntries();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

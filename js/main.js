document.addEventListener('DOMContentLoaded', function() {
    // RSVP form elements initialization
    const rsvpForm = document.getElementById('rsvp-form');
    const partySizeSelect = document.getElementById('party-size');
    const addPersonBtn = document.getElementById('add-person');
    const personContainer = document.querySelector('.person-container');
    const eventSelection = document.getElementById('event-selection');
    const attendingRadios = document.querySelectorAll('input[name="attending"]');
    let personCount = 1;  // Initialize person count

    // Function to show/hide dietary requirements fields
    function showDietaryRequirements(show) {
        const dietaryFields = document.querySelectorAll('textarea[name$="-dietary"]');
        const dietaryLabels = document.querySelectorAll('label');
        
        dietaryFields.forEach(field => {
            const container = field.closest('.mb-3');
            if (container) {
                container.style.display = show ? 'block' : 'none';
            }
        });
        
        // Also hide/show dietary labels specifically
        dietaryLabels.forEach(label => {
            if (label.textContent.includes('Dietary Requirements')) {
                const container = label.closest('.mb-3');
                if (container) {
                    container.style.display = show ? 'block' : 'none';
                }
            }
        });
    }

    // Initialize form by rendering person entries based on selected party size
    function renderInitialPersonEntries() {
        if (partySizeSelect && personContainer) {
            const initialSize = parseInt(partySizeSelect.value) || 1;
            personCount = initialSize;  // Set initial person count
            updatePersonEntries(initialSize);
        }
    }
    
    // Wait for a brief moment to ensure DOM is fully loaded
    setTimeout(renderInitialPersonEntries, 0);
    
    // Initialize dietary requirements visibility based on initial attendance selection
    setTimeout(() => {
        const currentAttendance = document.querySelector('input[name="attending"]:checked');
        if (currentAttendance) {
            showDietaryRequirements(currentAttendance.value === 'true');
        }
    }, 10);
    
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

    // Handle attendance radio buttons
    attendingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Update visibility based on attendance
            if (this.value === 'true') {
                eventSelection.style.display = 'block';
                partySizeSelect.closest('.mb-4').style.display = 'block';
                // Show dietary requirements fields
                showDietaryRequirements(true);
            } else {
                eventSelection.style.display = 'none';
                partySizeSelect.closest('.mb-4').style.display = 'none';
                // Hide dietary requirements fields
                showDietaryRequirements(false);
            }
            // Always show people details
            document.querySelector('.people-details').style.display = 'block';
            
            // Update party size if needed
            if (this.value === 'true') {
                const currentSize = parseInt(partySizeSelect.value) || 1;
                updatePersonEntries(currentSize);
            } else {
                updatePersonEntries(1);  // Reset to 1 person when not attending
            }
        });
    });

    // Handle party size change
    if (partySizeSelect) {
        partySizeSelect.addEventListener('change', function() {
            const selectedSize = parseInt(this.value);
            if (!isNaN(selectedSize) && selectedSize > 0) {
                updatePersonEntries(selectedSize);
            }
        });
    }

    // Add person functionality
    if (addPersonBtn) {
        addPersonBtn.addEventListener('click', function() {
            let currentSize = parseInt(partySizeSelect.value) || 1;
            currentSize++;
            partySizeSelect.value = currentSize;
            
            // Instead of updating all entries, just append a new one
            addPersonEntry(currentSize);
            personCount = currentSize;
            
            // Update entry numbers for consistency
            renumberPersonEntries();
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

        // Check current attendance selection and hide dietary requirements if not attending
        const currentAttendance = document.querySelector('input[name="attending"]:checked');
        if (currentAttendance && currentAttendance.value === 'false') {
            const dietaryField = personEntry.querySelector('textarea[name$="-dietary"]');
            if (dietaryField) {
                const dietaryContainer = dietaryField.closest('.mb-3');
                if (dietaryContainer) {
                    dietaryContainer.style.display = 'none';
                }
            }
        }

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
        if (!personContainer) return;  // Guard against missing container
        
        // Ensure targetSize is valid
        targetSize = Math.max(1, parseInt(targetSize) || 1);
        
        // Collect existing values before updating
        const existingEntries = Array.from(personContainer.querySelectorAll('.person-entry')).map(entry => {
            return {
                firstName: entry.querySelector('input[name$="-firstname"]')?.value || '',
                lastName: entry.querySelector('input[name$="-lastname"]')?.value || '',
                email: entry.querySelector('input[name$="-email"]')?.value || '',
                dietary: entry.querySelector('textarea[name$="-dietary"]')?.value || ''
            };
        });
        
        // Update person count
        personCount = targetSize;
        
        // Clear container
        personContainer.innerHTML = '';
        
        // Add entries up to targetSize, preserving existing values
        for (let i = 1; i <= targetSize; i++) {
            addPersonEntry(i);
            
            // Restore values if they existed
            if (existingEntries[i - 1]) {
                const entry = personContainer.children[i - 1];
                const values = existingEntries[i - 1];
                
                entry.querySelector('input[name$="-firstname"]').value = values.firstName;
                entry.querySelector('input[name$="-lastname"]').value = values.lastName;
                const emailInput = entry.querySelector('input[name$="-email"]');
                if (emailInput) emailInput.value = values.email;
                entry.querySelector('textarea[name$="-dietary"]').value = values.dietary;
            }
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

    // Always show guest details fields, regardless of attendance
    const attendanceRadios = document.querySelectorAll('input[name="attending"]');
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Show guest details section for both Yes and No
            document.querySelector('.people-details').style.display = 'block';
            // Set checked for the selected radio only
            attendanceRadios.forEach(r => {
                r.checked = false;
            });
            this.checked = true;
            // Trigger input event for CSS update
            this.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });

    // Handle form submission
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Initialize Supabase client using CDN global
            const supabase = window.supabase.createClient(
                'https://wklcweheohxcxiwyydbo.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbGN3ZWhlb2h4Y3hpd3l5ZGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NDkyOTEsImV4cCI6MjA3NDAyNTI5MX0.68rSYuWlgT1RMkCEEzFbwpfyfC-cfVN9LrG7wTrjx1U'
            );

            // Collect form data
            const formData = new FormData(rsvpForm);
            const attending = formData.get('attending');
            const events = formData.getAll('events[]');
            const partySize = formData.get('party-size');
            let additionalNotes = formData.get('additional-notes');
            if (!additionalNotes || additionalNotes.trim() === '') {
                additionalNotes = 'none';
            }

            // Validation
            let validationErrors = [];
            if (!attending) validationErrors.push('Attendance selection is required.');
            if (!partySize) validationErrors.push('Party size is required.');

            // Collect guest details
            const personEntries = document.querySelectorAll('.person-entry');
            const guests = [];
            let primaryEmail = '';
            
            // First, get the primary guest's email
            const primaryEmailInput = personEntries[0]?.querySelector('input[name^="person-"][name$="-email"]');
            if (primaryEmailInput) {
                primaryEmail = primaryEmailInput.value.trim();
                if (!primaryEmail) {
                    validationErrors.push('Email is required for the primary guest.');
                }
            }
            
            // Then collect all guest details
            personEntries.forEach((entry, idx) => {
                const firstName = entry.querySelector('input[name^="person-"][name$="-firstname"]').value.trim();
                const lastName = entry.querySelector('input[name^="person-"][name$="-lastname"]').value.trim();
                const dietary = entry.querySelector('textarea[name^="person-"][name$="-dietary"]').value.trim() || 'none';
                
                if (!firstName) validationErrors.push(`First name is required for guest ${idx + 1}.`);
                if (!lastName) validationErrors.push(`Last name is required for guest ${idx + 1}.`);
                
                guests.push({ 
                    first_name: firstName, 
                    last_name: lastName, 
                    email: primaryEmail, // Use the primary guest's email for all guests
                    dietary: dietary
                });
            });

            if (validationErrors.length > 0) {
                alert('Please fix the following errors before submitting:\n' + validationErrors.join('\n'));
                return;
            }

            // Prepare rows for Supabase
            const rows = guests.map(guest => ({
                attending: attending === 'true',
                events,
                party_size: partySize,
                first_name: guest.first_name,
                last_name: guest.last_name,
                email: guest.email,
                dietary: guest.dietary,
                additional_notes: additionalNotes
            }));
            console.log('Rows to insert:', rows);

            // Insert each guest as a separate row
            let error = null;
            for (const row of rows) {
                const { error: insertError } = await supabase.from('rsvp').insert([row]);
                if (insertError) {
                    console.error('Insert error:', insertError);
                    error = insertError;
                    break;
                } else {
                    console.log('Insert success for row:', row);
                }
            }

            if (error) {
                alert('Submission failed: ' + error.message);
            } else {
                alert('RSVP submitted successfully!');
                rsvpForm.reset();
                // Reset form display state
                updatePersonEntries(1);  // Reset to 1 person
                eventSelection.style.display = 'none';
                partySizeSelect.closest('.mb-4').style.display = 'none';
                document.querySelector('.people-details').style.display = 'block';
            }
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

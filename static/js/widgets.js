// Create solution progress widget
function createSolutionWidget() {
    const widget = document.createElement('div');
    widget.className = 'message-widget solution-widget';

    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
        <div class="widget-icon">
            <i class="fas fa-cogs"></i>
        </div>
        <div class="widget-title">AI Solution in Progress</div>
    `;

    const content = document.createElement('div');
    content.className = 'widget-content';
    content.innerHTML = `
        <div class="solution-steps">
            <div class="solution-step" id="step1">
                <div class="step-marker"><i class="fas fa-check"></i></div>
                <div class="step-content">
                    <div class="step-title">Analyzing Request</div>
                    <div class="step-description">Breaking down your requirements</div>
                </div>
            </div>
            <div class="solution-step" id="step2">
                <div class="step-marker"><i class="fas fa-check"></i></div>
                <div class="step-content">
                    <div class="step-title">Gathering Resources</div>
                    <div class="step-description">Collecting necessary data</div>
                </div>
            </div>
            <div class="solution-step" id="step3">
                <div class="step-marker"><i class="fas fa-check"></i></div>
                <div class="step-content">
                    <div class="step-title">Generating Solution</div>
                    <div class="step-description">Creating custom solution</div>
                </div>
            </div>
            <div class="solution-step" id="step4">
                <div class="step-marker"><i class="fas fa-check"></i></div>
                <div class="step-content">
                    <div class="step-title">Optimizing Result</div>
                    <div class="step-description">Refining for best results</div>
                </div>
            </div>
        </div>
    `;

    widget.appendChild(header);
    widget.appendChild(content);

    return widget;
}

// Simulate solution progress
function simulateSolutionProgress(widget, callback) {
    const steps = [
        widget.querySelector('#step1'),
        widget.querySelector('#step2'),
        widget.querySelector('#step3'),
        widget.querySelector('#step4')
    ];

    // Step 1
    steps[0].classList.add('active');

    setTimeout(() => {
        steps[0].classList.add('complete');
        steps[1].classList.add('active');

        setTimeout(() => {
            steps[1].classList.add('complete');
            steps[2].classList.add('active');

            setTimeout(() => {
                steps[2].classList.add('complete');
                steps[3].classList.add('active');

                setTimeout(() => {
                    steps[3].classList.add('complete');

                    // Execute callback when done
                    setTimeout(callback, 500);

                }, 1000);
            }, 1200);
        }, 1000);
    }, 800);
}

// Create agent delivery options widget
function createAgentDeliveryWidget(categoryId, isLogo = false, companyName = '') {
    const widget = document.createElement('div');
    widget.className = 'message-widget';

    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
        <div class="widget-icon">
            <i class="fas fa-th-large"></i>
        </div>
        <div class="widget-title">AI Agent Solutions</div>
    `;

    const content = document.createElement('div');
    content.className = 'widget-content';
    
    // Show loading state initially
    content.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i> Loading agent options...
        </div>
    `;
    
    widget.appendChild(header);
    widget.appendChild(content);

    // Fetch options from API
    const url = `/api/agent_options/${categoryId}${isLogo ? `?is_logo=true&company_name=${encodeURIComponent(companyName)}` : ''}`;
    
    fetch(url)
        .then(response => response.json())
        .then(options => {
            // Create option grid once data is loaded
            const optionsHtml = `
                <div class="delivery-options">
                    ${options.map((option, index) => `
                        <div class="delivery-option" data-index="${index}" data-agent="${option.agent}">
                            <div class="delivery-option-header">
                                <div class="delivery-option-icon">
                                    <i class="${option.icon}"></i>
                                </div>
                                <div class="delivery-option-title">${option.title}</div>
                                <div class="agent-badge">Agent ${option.agent}</div>
                            </div>
                            <div class="delivery-option-description">${option.description}</div>
                            <div class="delivery-option-preview">${option.preview}</div>
                            <div class="agent-ranking">
                                <div class="agent-ranking-stars">
                                    ${'★'.repeat(Math.floor(option.ranking))}${option.ranking % 1 >= 0.5 ? '★' : ''}
                                </div>
                                <div class="agent-ranking-value">${option.ranking}</div>
                                <div class="agent-ranking-count">rating</div>
                            </div>
                            <div class="delivery-option-checkbox"><i class="fas fa-check"></i></div>
                        </div>
                    `).join('')}
                </div>
            `;

            content.innerHTML = optionsHtml;

            // Add event listeners to options
            widget.querySelectorAll('.delivery-option').forEach(option => {
                option.addEventListener('click', function() {
                    // Deselect all options
                    widget.querySelectorAll('.delivery-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });

                    // Select this option
                    this.classList.add('selected');

                    // Get the selected info
                    const index = this.dataset.index;
                    const selectedOption = options[index];
                    const agentName = this.dataset.agent;

                    // Increase agent ranking
                    const newRanking = Math.min(5.0, parseFloat(selectedOption.ranking) + 0.1).toFixed(1);
                    this.querySelector('.agent-ranking-value').textContent = newRanking;

                    // Update stars
                    const starsElement = this.querySelector('.agent-ranking-stars');
                    starsElement.innerHTML = '★'.repeat(Math.floor(newRanking)) + (newRanking % 1 >= 0.5 ? '★' : '');

                    // Send a message about the selection
                    setTimeout(() => {
                        addMessage('user', `I like the ${selectedOption.title} approach by Agent ${agentName}.`);

                        const typingIndicator = addTypingIndicator();

                        setTimeout(() => {
                            chatMessages.removeChild(typingIndicator);
                            addMessage('ai', `Excellent choice! Agent ${agentName}'s ${selectedOption.title} approach is perfect for your needs. I'll finalize this solution and prepare it for delivery. Agent ${agentName} has received a ranking boost for creating a solution that matched your preferences!`);

                            // Add follow-up question
                            setTimeout(() => {
                                addMessage('ai', "Would you like to make any adjustments to this solution before finalizing?");

                                const lastMsg = chatMessages.lastElementChild;
                                const actionsDiv = document.createElement('div');
                                actionsDiv.className = 'message-actions';
                                actionsDiv.innerHTML = `
                                    <button class="message-action-btn">Yes, I'd like some changes</button>
                                    <button class="message-action-btn primary">No, it's perfect as is</button>
                                    <button class="message-action-btn human-touch">It's good, but I want a human touch</button>
                                `;

                                lastMsg.querySelector('.message-content').appendChild(actionsDiv);

                                // Add event listeners
                                actionsDiv.querySelectorAll('.message-action-btn').forEach(btn => {
                                    btn.addEventListener('click', function() {
                                        if (btn.classList.contains('primary')) {
                                            addMessage('user', "No, it's perfect as is. Thank you!");

                                            const typingIndicator = addTypingIndicator();

                                            setTimeout(() => {
                                                chatMessages.removeChild(typingIndicator);
                                                addMessage('ai', "Wonderful! I'm finalizing your solution now. Is there anything else you'd like help with today?");
                                            }, 1000);
                                        } 
                                        else if (btn.classList.contains('human-touch')) {
                                            // Human touch option
                                            addMessage('user', "It's good, but I'd like a human expert to add a professional touch.");

                                            const typingIndicator = addTypingIndicator();

                                            setTimeout(() => {
                                                chatMessages.removeChild(typingIndicator);

                                                // Create Fiverr sellers widget
                                                const fiverrWidget = createFiverrSellersWidget();
                                                addMessage('ai', "No problem! I've found some expert freelancers on Fiverr who specialize in this exact type of work. They can add that human creativity and expertise to take this to the next level:", fiverrWidget);
                                            }, 1500);
                                        }
                                        else {
                                            addMessage('user', "Yes, I'd like some changes.");

                                            const typingIndicator = addTypingIndicator();

                                            setTimeout(() => {
                                                chatMessages.removeChild(typingIndicator);
                                                addMessage('ai', `No problem! What specific adjustments would you like to make to Agent ${agentName}'s solution?`);
                                            }, 1000);
                                        }
                                    });
                                });
                            }, 1000);
                        }, 1500);
                    }, 500);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching agent options:', error);
            content.innerHTML = `<div class="error-message">Error loading agent options. Please try again.</div>`;
        });

    return widget;
}

// Create discovery widget
function createDiscoveryWidget() {
    const widget = document.createElement('div');
    widget.className = 'message-widget discovery-widget';

    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
        <div class="widget-icon">
            <i class="fas fa-lightbulb"></i>
        </div>
        <div class="widget-title">New Territory Discovery</div>
    `;

    const content = document.createElement('div');
    content.className = 'widget-content';
    content.innerHTML = `
        <div class="discovery-badge"><i class="fas fa-gift"></i> +$10 Credits Added</div>
        <div class="discovery-description">
            Your request is unique! We don't have an automated solution for this type of request yet. 
            We've sent it to our developer community who will build automation for this request type.
            <br><br>
            <strong>You'll always be credited as the idea originator.</strong>
        </div>
        <div class="discovery-title"><i class="fas fa-user-tie"></i> Expert Freelancers for This Request</div>
        <div class="freelancers-grid">
            <div class="freelancer-card">
                <div class="freelancer-avatar" style="background-image: url('https://randomuser.me/api/portraits/women/63.jpg')">
                    <div class="online-badge"></div>
                </div>
                <div class="freelancer-info">
                    <h4>Jordan Rivera</h4>
                    <p>Innovation Specialist</p>
                    <div class="skill-tags">
                        <span class="skill-tag">AI</span>
                        <span class="skill-tag">Emerging Tech</span>
                    </div>
                </div>
                <div class="rating">
                    <div class="rating-stars">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                    </div>
                    <div class="rating-value">4.8</div>
                    <div class="rating-count">(92)</div>
                </div>
            </div>
            <div class="freelancer-card">
                <div class="freelancer-avatar" style="background-image: url('https://randomuser.me/api/portraits/men/45.jpg')">
                    <div class="online-badge"></div>
                </div>
                <div class="freelancer-info">
                    <h4>Leo Zhang</h4>
                    <p>Creative Problem Solver</p>
                    <div class="skill-tags">
                        <span class="skill-tag">Innovation</span>
                        <span class="skill-tag">Strategy</span>
                    </div>
                </div>
                <div class="rating">
                    <div class="rating-stars">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                    </div>
                    <div class="rating-value">5.0</div>
                    <div class="rating-count">(34)</div>
                </div>
            </div>
        </div>
    `;

    widget.appendChild(header);
    widget.appendChild(content);

    // Add event listeners
    setTimeout(() => {
        widget.querySelectorAll('.freelancer-card').forEach(card => {
            card.addEventListener('click', function() {
                const name = this.querySelector('h4').textContent;

                setTimeout(() => {
                    addMessage('user', `I'd like to connect with ${name}.`);

                    const typingIndicator = addTypingIndicator();

                    setTimeout(() => {
                        chatMessages.removeChild(typingIndicator);
                        addMessage('ai', `Great choice! ${name} is an excellent specialist for your unique request. I'll arrange a connection right away. Would you like to talk now or schedule a meeting?`);

                        // Add contact options
                        const lastMsg = chatMessages.lastElementChild;
                        const contactOptionsDiv = document.createElement('div');
                        contactOptionsDiv.className = 'message-actions';
                        contactOptionsDiv.innerHTML = `
                            <button class="message-action-btn talk-now"><i class="fas fa-phone-alt"></i> Talk Now</button>
                            <button class="message-action-btn schedule-meeting"><i class="fas fa-calendar-alt"></i> Schedule Meeting</button>
                        `;

                        lastMsg.querySelector('.message-content').appendChild(contactOptionsDiv);

                        // Add event listeners for contact options
                        contactOptionsDiv.querySelector('.talk-now').addEventListener('click', function() {
                            addMessage('user', "I'd like to talk now.");

                            // Show calling animation
                            const callingWidget = createCallingWidget(name);
                            addMessage('ai', `Connecting you with ${name}...`, callingWidget);
                        });

                        contactOptionsDiv.querySelector('.schedule-meeting').addEventListener('click', function() {
                            addMessage('user', "I'd like to schedule a meeting.");

                            // Show scheduling widget
                            const schedulingWidget = createSchedulingWidget(name);
                            addMessage('ai', `Let's find a time that works for you and ${name}:`, schedulingWidget);
                        });
                    }, 1500);
                }, 500);
            });
        });
    }, 100);

    return widget;
}

// Create Fiverr sellers widget
function createFiverrSellersWidget() {
    const widget = document.createElement('div');
    widget.className = 'message-widget';

    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
        <div class="widget-icon">
            <i class="fas fa-user-tie"></i>
        </div>
        <div class="widget-title">Fiverr Specialists</div>
    `;

    const content = document.createElement('div');
    content.className = 'widget-content';
    content.innerHTML = `
        <div class="freelancers-grid">
            <div class="freelancer-card" data-name="Jordan Rivera">
                <div class="freelancer-avatar" style="background-image: url('https://randomuser.me/api/portraits/women/63.jpg')">
                    <div class="online-badge"></div>
                </div>
                <div class="freelancer-info">
                    <h4>Jordan Rivera</h4>
                    <p>Top Rated Plus</p>
                    <div class="skill-tags">
                        <span class="skill-tag">Expert</span>
                        <span class="skill-tag">Fast</span>
                    </div>
                </div>
                <div class="rating">
                    <div class="rating-stars">★★★★★</div>
                    <div class="rating-value">5.0</div>
                    <div class="rating-count">(112)</div>
                </div>
            </div>
            <div class="freelancer-card" data-name="Alex Chen">
                <div class="freelancer-avatar" style="background-image: url('https://randomuser.me/api/portraits/men/32.jpg')">
                </div>
                <div class="freelancer-info">
                    <h4>Alex Chen</h4>
                    <p>Level 2 Seller</p>
                    <div class="skill-tags">
                        <span class="skill-tag">Creative</span>
                        <span class="skill-tag">Detailed</span>
                    </div>
                </div>
                <div class="rating">
                    <div class="rating-stars">★★★★★</div>
                    <div class="rating-value">4.9</div>
                    <div class="rating-count">(87)</div>
                </div>
            </div>
        </div>
    `;

    widget.appendChild(header);
    widget.appendChild(content);

    // Add event listeners
    setTimeout(() => {
        widget.querySelectorAll('.freelancer-card').forEach(card => {
            card.addEventListener('click', function() {
                const name = this.dataset.name;

                addMessage('user', `I'd like to work with ${name}.`);

                const typingIndicator = addTypingIndicator();

                setTimeout(() => {
                    chatMessages.removeChild(typingIndicator);
                    addMessage('ai', `Great choice! ${name} is an excellent specialist for your request. Would you like to talk now or schedule a meeting?`);

                    // Add contact options
                    const lastMsg = chatMessages.lastElementChild;
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'message-actions';
                    actionsDiv.innerHTML = `
                        <button class="message-action-btn talk-now"><i class="fas fa-phone-alt"></i> Talk Now</button>
                        <button class="message-action-btn schedule-meeting"><i class="fas fa-calendar-alt"></i> Schedule Meeting</button>
                    `;

                    lastMsg.querySelector('.message-content').appendChild(actionsDiv);

                    // Add event listeners
                    actionsDiv.querySelector('.talk-now').addEventListener('click', function() {
                        addMessage('user', "I'd like to talk now.");

                        // Show calling animation
                        const callingWidget = createCallingWidget(name);
                        addMessage('ai', "Connecting you with " + name + "...", callingWidget);
                    });

                    actionsDiv.querySelector('.schedule-meeting').addEventListener('click', function() {
                        addMessage('user', "I'd like to schedule a meeting.");

                        // Show scheduling widget
                        const schedulingWidget = createSchedulingWidget(name);
                        addMessage('ai', "Let's find a time that works for you and " + name + ":", schedulingWidget);
                    });
                }, 1000);
            });
        });
    }, 100);

    return widget;
}

// Create calling animation widget
function createCallingWidget(name) {
    const widget = document.createElement('div');
    widget.className = 'message-widget calling-widget';
    widget.style.textAlign = 'center';
    widget.style.padding = '1.5rem';

    widget.innerHTML = `
        <div class="calling-animation" style="margin-bottom: 1rem;">
            <div class="freelancer-avatar" style="
                width: 80px;
                height: 80px;
                margin: 0 auto 1rem auto;
                background-image: url('https://randomuser.me/api/portraits/${name === 'Jordan Rivera' ? 'women/63.jpg' : 'men/32.jpg'}');
                border: 3px solid var(--primary-glow);
                position: relative;
            ">
                <div class="call-rings"></div>
            </div>
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">${name}</div>
            <div style="opacity: 0.7; margin-bottom: 1rem;">Calling...</div>
        </div>
        <button class="message-action-btn" style="
            background-color: #f44336;
            color: white;
            margin: 0 auto;
            width: auto;
            display: inline-flex;
        "><i class="fas fa-phone-slash" style="margin-right: 0.5rem;"></i> End Call</button>
    `;

    // Add end call event
    setTimeout(() => {
        widget.querySelector('button').addEventListener('click', function() {
            // Replace with call ended message
            widget.innerHTML = `
                <div style="font-size: 1rem; opacity: 0.7;">
                    <i class="fas fa-check-circle" style="color: var(--success-color); margin-right: 0.5rem;"></i>
                    Call ended. ${name} will follow up with a message shortly.
                </div>
            `;
        });
    }, 100);

    return widget;
}

// Create scheduling widget
function createSchedulingWidget(name) {
    const widget = document.createElement('div');
    widget.className = 'message-widget scheduling-widget';

    // Generate dates for next 5 days
    const dates = [];
    for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }

    // Available time slots
    const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

    widget.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <div style="font-weight: 600; margin-bottom: 0.5rem;">Select a Date:</div>
            <div class="dates-row">
                ${dates.map(date => `
                    <div class="date-option" data-date="${date.toISOString().split('T')[0]}">
                        <div style="font-weight: 500;">${date.toLocaleDateString('en-US', {weekday: 'short'})}</div>
                        <div style="font-size: 1.2rem; margin: 0.3rem 0;">${date.getDate()}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">${date.toLocaleDateString('en-US', {month: 'short'})}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="time-slots" style="margin-bottom: 1rem; display: none;">
            <div style="font-weight: 600; margin-bottom: 0.5rem;">Select a Time:</div>
            <div class="times-grid">
                ${timeSlots.map(time => `
                    <div class="time-option" data-time="${time}">
                        ${time}
                    </div>
                `).join('')}
            </div>
        </div>

        <button class="generate-btn confirm-meeting" style="display: none;">
            <i class="fas fa-calendar-check"></i> Confirm Meeting
        </button>
    `;

    // Add event listeners
    setTimeout(() => {
        let selectedDate = null;
        let selectedTime = null;

        // Date selection
        widget.querySelectorAll('.date-option').forEach(option => {
            option.addEventListener('click', function() {
                widget.querySelectorAll('.date-option').forEach(opt => {
                    opt.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--card-border');
                    opt.style.backgroundColor = '';
                });

                this.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow');
                this.style.backgroundColor = 'rgba(var(--primary-glow-rgb), 0.1)';

                selectedDate = this.dataset.date;
                widget.querySelector('.time-slots').style.display = 'block';

                // Reset time selection when date changes
                widget.querySelectorAll('.time-option').forEach(opt => {
                    opt.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--card-border');
                    opt.style.backgroundColor = '';
                });
                selectedTime = null;
                widget.querySelector('.confirm-meeting').style.display = 'none';
            });
        });

        // Time selection
        widget.querySelectorAll('.time-option').forEach(option => {
            option.addEventListener('click', function() {
                widget.querySelectorAll('.time-option').forEach(opt => {
                    opt.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--card-border');
                    opt.style.backgroundColor = '';
                });

                this.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow');
                this.style.backgroundColor = 'rgba(var(--primary-glow-rgb), 0.1)';

                selectedTime = this.dataset.time;
                widget.querySelector('.confirm-meeting').style.display = 'flex';
            });
        });

        // Confirm meeting
        widget.querySelector('.confirm-meeting').addEventListener('click', function() {
            if (!selectedDate || !selectedTime) return;

            const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });

            addMessage('user', `I'd like to schedule a meeting on ${formattedDate} at ${selectedTime}.`);

            const typingIndicator = addTypingIndicator();

            setTimeout(() => {
                chatMessages.removeChild(typingIndicator);
                addMessage('ai', `Perfect! I've scheduled your meeting with ${name} for ${formattedDate} at ${selectedTime}. You'll receive a calendar invitation and connection details via email. ${name} is looking forward to discussing your project!`);
            }, 1000);
        });
    }, 100);

    return widget;
}
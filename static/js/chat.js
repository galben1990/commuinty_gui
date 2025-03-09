// Add a message to the chat
function addMessage(type, text, widget = null) {
    const message = document.createElement('div');
    message.className = `message message-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';

    if (type === 'ai') {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    }

    const content = document.createElement('div');
    content.className = 'message-content';

    const textEl = document.createElement('div');
    textEl.className = 'message-text';
    textEl.innerHTML = text;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = getTimeString();

    content.appendChild(textEl);
    content.appendChild(time);

    if (widget) {
        content.appendChild(widget);
    }

    if (type === 'ai') {
        message.appendChild(avatar);
        message.appendChild(content);
    } else {
        message.appendChild(content);
        message.appendChild(avatar);
    }

    chatMessages.appendChild(message);

    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}

// Add a typing indicator
function addTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    const message = document.createElement('div');
    message.className = 'message message-ai';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.appendChild(typingIndicator);

    message.appendChild(avatar);
    message.appendChild(content);

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}

// Continue conversation based on response type
function continueConversation(responseType, categoryId, requestText) {
    const typingIndicator = addTypingIndicator();

    setTimeout(() => {
        chatMessages.removeChild(typingIndicator);

        if (responseType === 'match') {
            handleMatchResponse(categoryId, requestText);
        } else if (responseType === 'partial') {
            handlePartialMatchResponse(categoryId, requestText);
        } else {
            handleNewTerritoryResponse(requestText);
        }
    }, 1000);
}

// Handle Perfect Match Response
async function handleMatchResponse(categoryId, requestText) {
    // Check if it's a logo design request
    if (categoryId === 3 && (requestText.toLowerCase().includes('logo') || 
                             requestText.toLowerCase().includes('brand'))) {
        handleLogoRequest(requestText);
    } else {
        try {
            // Get copy from the API
            const response = await CopyAPI.generateResponse(requestText, 'match', {
                category_id: categoryId
            });
            
            // Display the main message
            addMessage('ai', response.text);
            
            // Display the follow-up question
            addMessage('ai', response.followup);
            
            // Add action buttons
            const lastMessage = chatMessages.lastElementChild;
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';

            if (categoryId === 1) { // Development
                actionsDiv.innerHTML = `
                    <button class="message-action-btn">Web</button>
                    <button class="message-action-btn">Mobile</button>
                    <button class="message-action-btn">Desktop</button>
                    <button class="message-action-btn">All Platforms</button>
                `;
            } else if (categoryId === 2) { // Content
                actionsDiv.innerHTML = `
                    <button class="message-action-btn">General Audience</button>
                    <button class="message-action-btn">Professionals</button>
                    <button class="message-action-btn">Technical</button>
                    <button class="message-action-btn">Creative</button>
                `;
            } else if (categoryId === 3) { // Creative
                actionsDiv.innerHTML = `
                    <button class="message-action-btn">Modern</button>
                    <button class="message-action-btn">Minimalist</button>
                    <button class="message-action-btn">Bold</button>
                    <button class="message-action-btn">Elegant</button>
                `;
            } else { // Business
                actionsDiv.innerHTML = `
                    <button class="message-action-btn">Increase Sales</button>
                    <button class="message-action-btn">Brand Awareness</button>
                    <button class="message-action-btn">Customer Retention</button>
                    <button class="message-action-btn">Lead Generation</button>
                `;
            }

            lastMessage.querySelector('.message-content').appendChild(actionsDiv);

            // Add event listeners to buttons
            actionsDiv.querySelectorAll('.message-action-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Send user message with selection
                    addMessage('user', btn.textContent);

                    // Show typing indicator
                    const typingIndicator = addTypingIndicator();

                    // Send second requirement question
                    setTimeout(() => {
                        chatMessages.removeChild(typingIndicator);

                        if (categoryId === 1) { // Development
                            addMessage('ai', "Thanks! And what features are most important for your project?");
                            addSecondRequirementOptions(categoryId, "User Experience", "Performance", "Security", "Scalability");
                        } else if (categoryId === 2) { // Content
                            addMessage('ai', "Got it! And what's the primary purpose of this content?");
                            addSecondRequirementOptions(categoryId, "Informative", "Persuasive", "Educational", "Entertaining");
                        } else if (categoryId === 3) { // Creative
                            addMessage('ai', "Perfect! And what colors would you prefer?");
                            addColorOptions();
                        } else { // Business
                            addMessage('ai', "Understood! What's your timeline for this project?");
                            addSecondRequirementOptions(categoryId, "ASAP", "Within a week", "2-4 weeks", "Flexible");
                        }
                    }, 1000);
                });
            });
        } catch (error) {
            console.error('Error getting match response:', error);
            
            // Fallback to hardcoded response
            addMessage('ai', `I've found a perfect match for your request in our ${getCategoryName(categoryId)} category!`);
            
            if (categoryId === 1) { // Development
                addMessage('ai', "Let me gather some details to help our AI agents create exactly what you need. What platform(s) will this be used on? (Web, Mobile, Desktop)");
            } else if (categoryId === 2) { // Content
                addMessage('ai', "Great! Let me gather some details for our AI content specialists. What's the target audience for this content?");
            } else if (categoryId === 3) { // Creative
                addMessage('ai', "Perfect! To help our AI creative agents get started, could you describe the style you're looking for? (Modern, Minimalist, Bold, etc.)");
            } else { // Business
                addMessage('ai', "Excellent! Let me gather some details to help our business solution agents. What's the primary goal of this project?");
            }
        }
    }
}

// Add second requirement options
function addSecondRequirementOptions(categoryId, opt1, opt2, opt3, opt4) {
    const lastMessage = chatMessages.lastElementChild;
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    actionsDiv.innerHTML = `
        <button class="message-action-btn">${opt1}</button>
        <button class="message-action-btn">${opt2}</button>
        <button class="message-action-btn">${opt3}</button>
        <button class="message-action-btn">${opt4}</button>
    `;

    lastMessage.querySelector('.message-content').appendChild(actionsDiv);

    // Add event listeners
    actionsDiv.querySelectorAll('.message-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Send user message with selection
            addMessage('user', btn.textContent);

            // Show typing indicator
            const typingIndicator = addTypingIndicator();

            // Show generation message
            setTimeout(() => {
                chatMessages.removeChild(typingIndicator);

                // Show solution progress widget
                const solutionWidget = createSolutionWidget();
                addMessage('ai', "Thanks for the details! I'm preparing your solution now.", solutionWidget);

                // Simulate solution progress
                simulateSolutionProgress(solutionWidget, () => {
                    // Show delivery options with 4 agents
                    const deliveryWidget = createAgentDeliveryWidget(categoryId);
                    addMessage('ai', "Your solution is ready! Our 4 AI agents have each created a different approach based on your requirements. Please select the one you prefer:", deliveryWidget);
                });
            }, 1000);
        });
    });
}

// Add color options for creative requests
function addColorOptions() {
    const lastMessage = chatMessages.lastElementChild;
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-options';

    const colors = [
        { name: 'Blue', hex: '#2196F3' },
        { name: 'Green', hex: '#4CAF50' },
        { name: 'Red', hex: '#F44336' },
        { name: 'Purple', hex: '#9C27B0' },
        { name: 'Orange', hex: '#FF9800' },
        { name: 'Teal', hex: '#009688' }
    ];

    colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color.hex;
        colorOption.dataset.color = color.name;
        colorDiv.appendChild(colorOption);
    });

    lastMessage.querySelector('.message-content').appendChild(colorDiv);

    // Add event listeners
    colorDiv.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            // Deselect others
            colorDiv.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Select this one
            this.classList.add('selected');

            // Send user message
            addMessage('user', `I prefer ${this.dataset.color} colors.`);

            // Show generate button
            const typingIndicator = addTypingIndicator();

            setTimeout(() => {
                chatMessages.removeChild(typingIndicator);
                addMessage('ai', "Great choice! Ready to generate your designs?");

                // Add generate button
                const lastMsg = chatMessages.lastElementChild;
                const generateBtn = document.createElement('button');
                generateBtn.className = 'generate-btn';
                generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Designs';
                lastMsg.querySelector('.message-content').appendChild(generateBtn);

                // Add event listener
                generateBtn.addEventListener('click', function() {
                    // Show solution progress widget
                    const solutionWidget = createSolutionWidget();
                    addMessage('ai', "Generating your designs now. This will only take a moment.", solutionWidget);

                    // Simulate solution progress
                    simulateSolutionProgress(solutionWidget, () => {
                        // Show delivery options with 4 agents
                        const deliveryWidget = createAgentDeliveryWidget(3); // Creative category
                        addMessage('ai', "Your designs are ready! Our 4 AI design agents have each created a different approach. Please select the one you prefer:", deliveryWidget);
                    });
                });
            }, 1000);
        });
    });
}

// Handle Logo Request (special flow for logo design)
function handleLogoRequest(requestText) {
    addMessage('ai', "Perfect! I've found our logo design specialists. To create the best logo for you, I'll need a few details.");

    setTimeout(() => {
        addMessage('ai', "What industry or business type is this logo for?");

        // Add form for logo requirements
        const formWidget = document.createElement('div');
        formWidget.className = 'message-widget';

        const header = document.createElement('div');
        header.className = 'widget-header';
        header.innerHTML = `
            <div class="widget-icon">
                <i class="fas fa-pencil-alt"></i>
            </div>
            <div class="widget-title">Logo Requirements</div>
        `;

        const content = document.createElement('div');
        content.className = 'widget-content';
        content.innerHTML = `
            <div class="requirements-form">
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-briefcase"></i> Industry/Business Type</label>
                    <input type="text" class="form-input" id="logo-industry" placeholder="E.g. Technology, Restaurant, Healthcare...">
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-font"></i> Company Name</label>
                    <input type="text" class="form-input" id="logo-name" placeholder="Name to include in the logo">
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-palette"></i> Color Preferences</label>
                    <div class="color-options">
                        <div class="color-option" style="background-color: #2196F3;" data-color="Blue"></div>
                        <div class="color-option" style="background-color: #4CAF50;" data-color="Green"></div>
                        <div class="color-option" style="background-color: #F44336;" data-color="Red"></div>
                        <div class="color-option"style="background-color: #9C27B0;" data-color="Purple"></div>
                        <div class="color-option" style="background-color: #FF9800;" data-color="Orange"></div>
                        <div class="color-option" style="background-color: #009688;" data-color="Teal"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-star"></i> Style Preference</label>
                    <div class="message-actions">
                        <button class="message-action-btn" data-style="Modern">Modern</button>
                        <button class="message-action-btn" data-style="Minimalist">Minimalist</button>
                        <button class="message-action-btn" data-style="Bold">Bold</button>
                        <button class="message-action-btn" data-style="Elegant">Elegant</button>
                    </div>
                </div>
                <button class="generate-btn"><i class="fas fa-magic"></i> Generate Logo Designs</button>
            </div>
        `;

        formWidget.appendChild(header);
        formWidget.appendChild(content);

        // Add the widget
        addMessage('ai', "Please fill out these details to help our AI agents create the perfect logo for you:", formWidget);

        // Add event listeners
        setTimeout(() => {
            // Color selection
            formWidget.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', function() {
                    formWidget.querySelectorAll('.color-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            });

            // Style selection
            formWidget.querySelectorAll('.message-action-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    formWidget.querySelectorAll('.message-action-btn').forEach(b => {
                        b.classList.remove('primary');
                    });
                    this.classList.add('primary');
                });
            });

            // Generate button
            formWidget.querySelector('.generate-btn').addEventListener('click', function() {
                const industry = formWidget.querySelector('#logo-industry').value;
                const name = formWidget.querySelector('#logo-name').value;
                const color = formWidget.querySelector('.color-option.selected')?.dataset.color || 'Blue';
                const style = formWidget.querySelector('.message-action-btn.primary')?.dataset.style || 'Modern';

                if (!industry || !name) {
                    alert('Please fill in the industry and company name.');
                    return;
                }

                // Show user selection
                addMessage('user', `I need a ${style} logo for ${name} in the ${industry} industry using ${color} colors.`);

                // Show solution progress widget
                const solutionWidget = createSolutionWidget();
                addMessage('ai', "Thanks for the details! I'm generating logo designs from our top AI agents now.", solutionWidget);

                // Send the logo details to the server
                // In a real app, we would store these details for future reference
                fetch('/api/analyze_request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        text: `${style} logo for ${name} in ${industry} with ${color} colors`,
                        type: 'logo',
                        details: {
                            industry: industry,
                            companyName: name,
                            color: color,
                            style: style
                        }
                    }),
                })
                .then(() => {
                    // Continue with solution progress regardless of response
                    // Simulate solution progress
                    simulateSolutionProgress(solutionWidget, () => {
                        // Show delivery options with 4 agents specifically for logos
                        const deliveryWidget = createAgentDeliveryWidget(3, true, name); // Creative category, logo specific
                        addMessage('ai', "Your logo designs are ready! Our 4 AI design agents have each created a different concept. Please select the one you prefer:", deliveryWidget);
                    });
                })
                .catch(error => {
                    console.error('Error storing logo details:', error);
                    // Continue with solution progress even if there was an error
                    simulateSolutionProgress(solutionWidget, () => {
                        const deliveryWidget = createAgentDeliveryWidget(3, true, name);
                        addMessage('ai', "Your logo designs are ready! Our 4 AI design agents have each created a different concept. Please select the one you prefer:", deliveryWidget);
                    });
                });
            });
        }, 100);
    }, 500);
}

// Handle Partial Match Response
function handlePartialMatchResponse(categoryId, requestText) {
    addMessage('ai', `I've found a partial match in our ${getCategoryName(categoryId)} category. Parts of your request are familiar, but others will require a custom approach.`);

    setTimeout(() => {
        // Add a question based on category
        if (categoryId === 1) { // Development
            addMessage('ai', "Could you provide more details about the unique aspects of your project that might not be covered by standard solutions?");
        } else if (categoryId === 2) { // Content
            addMessage('ai', "Your content request has some unique elements. Could you share more about what makes this content different from standard approaches?");
        } else if (categoryId === 3) { // Creative
            addMessage('ai', "Your creative request has some unique aspects. Could you elaborate on what makes this different from typical designs?");
        } else { // Business
            addMessage('ai', "Your business solution request has some unique components. Could you provide more details about what makes this different from standard approaches?");
        }

        // Add text input for custom response
        const lastMessage = chatMessages.lastElementChild;
        const customResponseDiv = document.createElement('div');
        customResponseDiv.className = 'form-group';
        customResponseDiv.style.marginTop = '1rem';
        customResponseDiv.innerHTML = `
            <textarea class="form-input" id="custom-response" placeholder="Provide additional details here..." rows="3"></textarea>
            <button class="generate-btn" style="margin-top: 0.5rem;"><i class="fas fa-arrow-right"></i> Submit Details</button>
        `;

        lastMessage.querySelector('.message-content').appendChild(customResponseDiv);

        // Add event listener
        customResponseDiv.querySelector('.generate-btn').addEventListener('click', function() {
            const customResponse = document.getElementById('custom-response').value;

            if (!customResponse) {
                alert('Please provide some additional details.');
                return;
            }

            // Send user message
            addMessage('user', customResponse);

            // Show typing indicator
            const typingIndicator = addTypingIndicator();

            // Process response
            setTimeout(() => {
                chatMessages.removeChild(typingIndicator);
                addMessage('ai', "Thank you for those details! This helps a lot. I'll create a hybrid solution that combines our existing approaches with custom elements for your unique needs.");

                // Show solution progress widget
                const solutionWidget = createSolutionWidget();
                addMessage('ai', "Preparing your hybrid solution now...", solutionWidget);

                // Simulate solution progress
                simulateSolutionProgress(solutionWidget, () => {
                    // Show delivery options with 4 agents
                    const deliveryWidget = createAgentDeliveryWidget(categoryId);
                    addMessage('ai', "Your hybrid solution is ready! Our AI agents have each created a different approach that combines standard elements with your unique requirements. Please select the one you prefer:", deliveryWidget);
                });
            }, 1500);
        });
    }, 500);
}

// Handle New Territory Response
function handleNewTerritoryResponse(requestText) {
    const discoveryWidget = createDiscoveryWidget();
    addMessage('ai', "You've discovered new territory! We've never had a request quite like this before.", discoveryWidget);

    setTimeout(() => {
        addMessage('ai', "While our developer community works on automating solutions for requests like yours, I've identified some freelance specialists who can help you immediately. Would you like to connect with one of them?");

        // Add action buttons
        const lastMessage = chatMessages.lastElementChild;
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        actionsDiv.innerHTML = `
            <button class="message-action-btn">No thanks</button>
            <button class="message-action-btn primary">Connect with specialist</button>
        `;
        lastMessage.querySelector('.message-content').appendChild(actionsDiv);

        // Add event listeners to buttons
        actionsDiv.querySelectorAll('.message-action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (btn.classList.contains('primary')) {
                    addMessage('user', "I'd like to connect with a specialist.");
                    const typingIndicator = addTypingIndicator();

                    setTimeout(() => {
                        chatMessages.removeChild(typingIndicator);
                        addMessage('ai', "Great! I'll set up a connection with Jordan Rivera, who specializes in innovative solutions like what you're looking for. What's the best time for an initial consultation?");

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
                            const callingWidget = createCallingWidget('Jordan Rivera');
                            addMessage('ai', "Connecting you with Jordan Rivera...", callingWidget);
                        });

                        contactOptionsDiv.querySelector('.schedule-meeting').addEventListener('click', function() {
                            addMessage('user', "I'd like to schedule a meeting.");

                            // Show scheduling widget
                            const schedulingWidget = createSchedulingWidget('Jordan Rivera');
                            addMessage('ai', "Let's find a time that works for you and Jordan Rivera:", schedulingWidget);
                        });
                    }, 1000);
                } else {
                    addMessage('user', "No thanks, I'll wait for the automated solution.");
                    const typingIndicator = addTypingIndicator();

                    setTimeout(() => {
                        chatMessages.removeChild(typingIndicator);
                        addMessage('ai', "No problem! I've recorded your request and our developer community will work on creating an automated solution. You'll receive a notification as soon as it's ready. Is there anything else you'd like help with in the meantime?");
                    }, 1000);
                }
            });
        });
    }, 2000);
}
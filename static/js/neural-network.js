// Create neural network widget
function createNeuralNetworkWidget() {
    const widget = document.createElement('div');
    widget.className = 'message-widget';

    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
        <div class="widget-icon">
            <i class="fas fa-project-diagram"></i>
        </div>
        <div class="widget-title">AI Agent Network Search</div>
    `;

    const content = document.createElement('div');
    content.className = 'neural-widget widget-content';
    content.innerHTML = `
        <div class="neural-network" id="neuralNetwork"></div>
        <div class="neural-status">
            <i class="fas fa-sync-alt fa-spin"></i>
            <span>Searching AI agent network...</span>
        </div>
        <div class="neural-legend">
            <div class="legend-item">
                <div class="legend-color c1"></div>
                <span>Dev</span>
            </div>
            <div class="legend-item">
                <div class="legend-color c2"></div>
                <span>Content</span>
            </div>
            <div class="legend-item">
                <div class="legend-color c3"></div>
                <span>Creative</span>
            </div>
            <div class="legend-item">
                <div class="legend-color c4"></div>
                <span>Business</span>
            </div>
        </div>
    `;

    widget.appendChild(header);
    widget.appendChild(content);

    return widget;
}

// Simulate neural network analysis
function simulateNeuralNetworkAnalysis(requestText, neuralWidget, responseType, categoryId) {
    // Create the neural network
    createNeuralNetwork(neuralWidget);

    // Animate the network
    const nodes = neuralWidget.querySelectorAll('.node');
    const paths = neuralWidget.querySelectorAll('.path');

    // Highlight root node
    setTimeout(() => {
        nodes[0].classList.add('highlight');

        // Simulate searching through categories
        animateNetworkSearch(nodes, paths, categoryId, () => {
            // Update status
            const statusText = neuralWidget.querySelector('.neural-status span');

            if (responseType === 'match') {
                statusText.innerHTML = `<span style="color: var(--success-color);">Perfect match found!</span>`;
            } else if (responseType === 'partial') {
                statusText.innerHTML = `<span style="color: var(--warning-color);">Partial match found</span>`;
            } else {
                statusText.innerHTML = `<span style="color: var(--new-color);">New territory discovered!</span>`;
            }

            // Continue conversation based on response type
            setTimeout(() => {
                continueConversation(responseType, categoryId, requestText);
            }, 1000);
        });
    }, 800);
}

// Create neural network visualization with dynamic categories
function createNeuralNetwork(widget) {
    const neuralNetwork = widget.querySelector('.neural-network');
    neuralNetwork.innerHTML = '';

    // Create root node
    const rootNode = document.createElement('div');
    rootNode.className = 'node root';
    rootNode.dataset.id = 'root';
    rootNode.dataset.name = 'Services';
    rootNode.style.left = '50%';
    rootNode.style.top = '50%';
    neuralNetwork.appendChild(rootNode);

    // Create root node label
    const rootLabel = document.createElement('div');
    rootLabel.className = 'node-label';
    rootLabel.textContent = 'Services';
    rootLabel.style.left = '50%';
    rootLabel.style.top = '45%';
    neuralNetwork.appendChild(rootLabel);

    // Fetch agent categories from database (simulated)
    fetchAgentCategories().then(categories => {
        // Draw categories
        categories.forEach((category, i) => {
            const angle = (i * (2 * Math.PI / categories.length));
            const x = 50 + Math.cos(angle) * 30;
            const y = 50 + Math.sin(angle) * 30;

            const node = document.createElement('div');
            node.className = `node category-${category.id}`;
            node.dataset.id = `cat-${category.id}`;
            node.dataset.name = category.name;
            node.style.left = `${x}%`;
            node.style.top = `${y}%`;
            neuralNetwork.appendChild(node);

            // Create node label
            const label = document.createElement('div');
            label.className = 'node-label';
            label.textContent = category.name;
            label.style.left = `${x}%`;
            label.style.top = `${y - 6}%`;
            neuralNetwork.appendChild(label);

            // Create connection to root
            createConnection(neuralNetwork, 50, 50, x, y, category.id);

            // Fetch subcategories for this category
            fetchSubcategories(category.id).then(subcategories => {
                // Limit to 3 subcategories for visualization
                const visibleSubcats = subcategories.slice(0, 3);

                visibleSubcats.forEach((subcat, j) => {
                    const subAngle = angle + (j - 1) * Math.PI / 8;
                    const subX = x + Math.cos(subAngle) * 15;
                    const subY = y + Math.sin(subAngle) * 10;

                    const subNode = document.createElement('div');
                    subNode.className = `node category-${category.id}`;
                    subNode.dataset.id = `subcat-${category.id}-${j}`;
                    subNode.dataset.name = subcat.name;
                    subNode.style.left = `${subX}%`;
                    subNode.style.top = `${subY}%`;
                    neuralNetwork.appendChild(subNode);

                    // Create subcategory label
                    const subLabel = document.createElement('div');
                    subLabel.className = 'node-label';
                    subLabel.textContent = subcat.name;
                    subLabel.style.left = `${subX}%`;
                    subLabel.style.top = `${subY - 5}%`;
                    neuralNetwork.appendChild(subLabel);

                    // Create connection to category
                    createConnection(neuralNetwork, x, y, subX, subY, category.id);
                });
            });
        });
    });

    return neuralNetwork;
}

// Real API calls to fetch agent data
function fetchAgentCategories() {
    return fetch('/api/agent_categories')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching agent categories:', error);
            return [];
        });
}

function fetchSubcategories(categoryId) {
    return fetch(`/api/subcategories/${categoryId}`)
        .then(response => response.json())
        .catch(error => {
            console.error(`Error fetching subcategories for category ${categoryId}:`, error);
            return [];
        });
}

// Create connection between two points
function createConnection(container, x1, y1, x2, y2, categoryId) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const path = document.createElement('div');
    path.className = `path category-${categoryId}`;
    path.style.width = `${distance}%`;
    path.style.left = `${x1}%`;
    path.style.top = `${y1}%`;
    path.style.transform = `rotate(${angle}deg)`;

    container.appendChild(path);
    return path;
}

// Animate through the network search
function animateNetworkSearch(nodes, paths, categoryId, callback) {
    let currentNode = 1; // Start from 1 (after root)
    let currentPath = 0;

    // First highlight category nodes in sequence
    let nodesToHighlight = Array.from(nodes).filter(node => 
        node.dataset.id && node.dataset.id.startsWith('cat-')
    );

    // If we have a category, prioritize that one
    if (categoryId) {
        nodesToHighlight.sort((a, b) => {
            const aIsCategory = a.classList.contains(`category-${categoryId}`);
            const bIsCategory = b.classList.contains(`category-${categoryId}`);
            return bIsCategory - aIsCategory;
        });
    }

    // Highlight category nodes first
    highlightNodesSequence(nodesToHighlight, paths, 0, () => {
        // Then highlight subcategory nodes if we have a category match
        if (categoryId) {
            const subNodes = Array.from(nodes).filter(node => 
                node.dataset.id && node.dataset.id.startsWith(`subcat-${categoryId}`)
            );

            highlightNodesSequence(subNodes, paths, 0, callback);
        } else {
            callback();
        }
    });
}

// Highlight nodes in sequence
function highlightNodesSequence(nodes, paths, currentIndex, callback) {
    if (currentIndex >= nodes.length) {
        callback();
        return;
    }

    // Highlight current node
    nodes[currentIndex].classList.add('highlight');

    // Find and highlight paths connected to this node
    paths.forEach(path => {
        const nodeRect = nodes[currentIndex].getBoundingClientRect();
        const pathRect = path.getBoundingClientRect();

        // Simple check if path starts or ends near this node
        if (Math.abs(pathRect.left - nodeRect.left) < 20 && 
            Math.abs(pathRect.top - nodeRect.top) < 20) {
            path.classList.add('active');
        }
    });

    // Move to next node after delay
    setTimeout(() => {
        highlightNodesSequence(nodes, paths, currentIndex + 1, callback);
    }, 300);
}
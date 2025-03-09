# NEXUS Community GUI

This is a modular Flask-based web application with a conversational UI that simulates an AI-powered freelancer matching system.

## Features

- Modern, responsive user interface with both Cyberpunk and Google themes
- Interactive chat-based interface
- Animated neural network visualization
- Dynamic content generation based on user requests
- Rule-based backend for conversation flow
- JSON-based data storage for agent categories and freelancer information

## Requirements

- Python 3.7 or higher
- Flask

## Installation

1. Clone this repository or download the source code

2. Create and activate a virtual environment (recommended):

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install the required packages:

```bash
pip install flask
```

## Running the Application

1. Start the Flask development server:

```bash
# On Windows
python app.py

# On macOS/Linux
python3 app.py
```

2. Open a web browser and navigate to:

```
http://127.0.0.1:5000/
```

## Project Structure

- `app.py` - Main Flask application
- `templates/` - HTML templates
  - `index.html` - Main application template
- `static/` - Static assets
  - `css/` - CSS stylesheets
    - `main.css` - Core styles
    - `themes.css` - Theme-specific styles
    - `widgets.css` - Widget component styles
    - `animations.css` - Animation definitions
    - `responsive.css` - Responsive design styles
  - `js/` - JavaScript files
    - `main.js` - Core functionality
    - `chat.js` - Chat message handling
    - `widgets.js` - UI widget creation
    - `neural-network.js` - Neural network visualization
    - `ui.js` - UI-specific utilities
  - `data/` - JSON data files
    - `agent_categories.json` - Categories of AI agents
    - `subcategories.json` - Subcategories for each agent category
    - `freelancers.json` - Freelancer profiles

## Customization

You can customize the application by:

1. Modifying the JSON data files in `static/data/` to change the agent categories and freelancer profiles
2. Editing the CSS files in `static/css/` to change the appearance
3. Updating the rule-based conversation flow in `app.py` and `static/js/chat.js`

## Creating New Themes

To create a new theme:

1. Add a new theme definition to `static/css/themes.css`
2. Update the theme toggle functionality in `static/js/main.js`

## License

This project is provided as-is with no warranty. Use it at your own risk.

---

Created for demonstration purposes.
from flask import Flask, render_template, request, jsonify
import json
import os
import random

app = Flask(__name__)

# Load JSON data files
def load_json_data(filename):
    filepath = os.path.join('static', 'data', f'{filename}.json')
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

@app.route('/')
def index():
    return render_template('index.html')

# API endpoints to fetch data
@app.route('/api/agent_categories')
def agent_categories():
    return jsonify(load_json_data('agent_categories'))

@app.route('/api/subcategories/<int:category_id>')
def subcategories(category_id):
    all_subcategories = load_json_data('subcategories')
    return jsonify(all_subcategories.get(str(category_id), []))

@app.route('/api/freelancers')
def freelancers():
    return jsonify(load_json_data('freelancers'))

@app.route('/api/analyze_request', methods=['POST'])
def analyze_request():
    # This would eventually use AI, but for now it's rule-based
    request_text = request.json.get('text', '').lower()
    
    # Rule-based analysis
    if any(word in request_text for word in ['website', 'app', 'develop', 'code', 'program']):
        return jsonify({
            'responseType': 'match',
            'categoryId': 1  # Development
        })
    elif any(word in request_text for word in ['content', 'write', 'article', 'copy', 'blog']):
        return jsonify({
            'responseType': 'partial',
            'categoryId': 2  # Content
        })
    elif any(word in request_text for word in ['design', 'logo', 'creative', 'video', 'animation']):
        return jsonify({
            'responseType': 'match',
            'categoryId': 3  # Creative
        })
    else:
        return jsonify({
            'responseType': 'new',
            'categoryId': None
        })

@app.route('/api/agent_options/<int:category_id>')
def agent_options(category_id):
    """Get agent delivery options for a specific category"""
    # Generate options based on category
    is_logo = request.args.get('is_logo', 'false').lower() == 'true'
    company_name = request.args.get('company_name', '')
    
    if is_logo:
        options = [
            {"agent": "Atlas", "title": "Bold Geometric", "description": f"Modern geometric logo for {company_name}", "icon": "fas fa-shapes", "preview": "Abstract geometric shapes"},
            {"agent": "Nova", "title": "Elegant Minimalist", "description": f"Clean minimalist design for {company_name}", "icon": "fas fa-minus-square", "preview": "Clean lines and space"},
            {"agent": "Pulse", "title": "Dynamic Typography", "description": f"Creative typography for {company_name}", "icon": "fas fa-font", "preview": "Custom letterforms"},
            {"agent": "Sphere", "title": "Iconic Symbol", "description": f"Memorable symbol for {company_name}", "icon": "fas fa-star", "preview": "Distinctive mark"}
        ]
    elif category_id == 1:  # Development
        options = [
            {"agent": "Atlas", "title": "Feature-Rich", "description": "Comprehensive solution with all features", "icon": "fas fa-cubes", "preview": "Full feature set"},
            {"agent": "Nova", "title": "Modern & Minimal", "description": "Clean design with focus on core functionality", "icon": "fas fa-columns", "preview": "Sleek interface"},
            {"agent": "Pulse", "title": "Performance Optimized", "description": "Lightweight and extremely fast", "icon": "fas fa-tachometer-alt", "preview": "Speed metrics"},
            {"agent": "Sphere", "title": "Cutting Edge", "description": "Using latest technologies and approaches", "icon": "fas fa-rocket", "preview": "Innovative tech"}
        ]
    elif category_id == 2:  # Content
        options = [
            {"agent": "Atlas", "title": "Professional", "description": "Formal tone with structured approach", "icon": "fas fa-briefcase", "preview": "Business-focused"},
            {"agent": "Nova", "title": "Conversational", "description": "Friendly and engaging style", "icon": "fas fa-comments", "preview": "Reader-friendly"},
            {"agent": "Pulse", "title": "SEO Optimized", "description": "Designed to rank well in search", "icon": "fas fa-search", "preview": "Keyword optimized"},
            {"agent": "Sphere", "title": "Storytelling", "description": "Narrative approach that captivates", "icon": "fas fa-book-open", "preview": "Engaging narrative"}
        ]
    elif category_id == 3:  # Creative
        options = [
            {"agent": "Atlas", "title": "Minimalist", "description": "Clean and elegant design approach", "icon": "fas fa-minus-square", "preview": "Simple elegance"},
            {"agent": "Nova", "title": "Bold & Vibrant", "description": "Eye-catching with strong visual impact", "icon": "fas fa-palette", "preview": "Visual impact"},
            {"agent": "Pulse", "title": "Corporate", "description": "Professional appearance for business use", "icon": "fas fa-building", "preview": "Professional look"},
            {"agent": "Sphere", "title": "Avant-garde", "description": "Experimental and cutting-edge design", "icon": "fas fa-magic", "preview": "Innovative concept"}
        ]
    else:
        options = [
            {"agent": "Atlas", "title": "Data-Driven", "description": "Analytics-based approach with metrics", "icon": "fas fa-chart-bar", "preview": "Performance metrics"},
            {"agent": "Nova", "title": "Strategic", "description": "Long-term vision with milestone approach", "icon": "fas fa-chess", "preview": "Strategic roadmap"},
            {"agent": "Pulse", "title": "Agile Execution", "description": "Flexible implementation with quick wins", "icon": "fas fa-bolt", "preview": "Rapid deployment"},
            {"agent": "Sphere", "title": "Comprehensive", "description": "All-encompassing solution for total coverage", "icon": "fas fa-globe", "preview": "Full solution"}
        ]
    
    # Set initial rankings
    for option in options:
        option["ranking"] = round(4 + random.random(), 1)
    
    return jsonify(options)

@app.route('/api/discovery_freelancers')
def discovery_freelancers():
    """Get freelancers for discovery widget"""
    all_freelancers = load_json_data('freelancers')
    # Return only online freelancers, limited to 2
    online_freelancers = [f for f in all_freelancers if f.get('online', False)][:2]
    return jsonify(online_freelancers)

@app.route('/api/fiverr_sellers')
def fiverr_sellers():
    """Get Fiverr sellers"""
    all_freelancers = load_json_data('freelancers')
    # Return two freelancers as Fiverr sellers
    sellers = all_freelancers[:2]
    return jsonify(sellers)

@app.route('/api/is_known_territory', methods=['POST'])
def is_known_territory():
    """Determine if the request is for known territory"""
    request_text = request.json.get('text', '').lower()
    
    # More extensive rules than analyze_request
    known_categories = {
        # Development keywords
        'website': 1, 'app': 1, 'develop': 1, 'code': 1, 'program': 1, 'frontend': 1, 'backend': 1,
        'javascript': 1, 'python': 1, 'react': 1, 'angular': 1, 'vue': 1, 'flutter': 1, 'mobile': 1,
        
        # Content keywords
        'content': 2, 'write': 2, 'article': 2, 'copy': 2, 'blog': 2, 'post': 2, 'seo': 2,
        'description': 2, 'copywriting': 2, 'translation': 2, 'proofread': 2, 'edit': 2,
        
        # Creative keywords
        'design': 3, 'logo': 3, 'creative': 3, 'video': 3, 'animation': 3, 'illustration': 3,
        'graphic': 3, 'banner': 3, 'poster': 3, 'ui': 3, 'ux': 3, 'thumbnail': 3,
        
        # Business keywords
        'marketing': 4, 'business': 4, 'strategy': 4, 'promotion': 4, 'social media': 4,
        'analytics': 4, 'research': 4, 'data': 4, 'management': 4,
        
        # Finance keywords
        'finance': 5, 'accounting': 5, 'tax': 5, 'investment': 5, 'financial': 5
    }
    
    # Split text into words and check for matches
    words = request_text.split()
    matches = {}
    
    for word in words:
        if word in known_categories:
            category_id = known_categories[word]
            matches[category_id] = matches.get(category_id, 0) + 1
    
    # Check compound keywords
    for compound in ['social media', 'mobile app', 'web development', 'content writing']:
        if compound in request_text:
            category = known_categories.get(compound)
            if category:
                matches[category] = matches.get(category, 0) + 2  # Higher weight for compounds
    
    if not matches:
        return jsonify({
            'known': False,
            'categoryId': None,
            'confidence': 0
        })
    
    # Get category with highest matches
    best_category = max(matches, key=matches.get)
    total_matches = sum(matches.values())
    confidence = matches[best_category] / total_matches
    
    # If there's a clear dominant category with good confidence
    if confidence > 0.5:
        return jsonify({
            'known': True,
            'categoryId': best_category,
            'confidence': confidence
        })
    # If there are multiple potential categories but no clear winner
    elif total_matches > 1:
        return jsonify({
            'known': True,
            'categoryId': best_category,
            'confidence': confidence,
            'partial': True
        })
    # Not enough context to determine category
    else:
        return jsonify({
            'known': False,
            'categoryId': None,
            'confidence': 0
        })

if __name__ == '__main__':
    app.run(debug=True)
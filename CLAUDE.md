# CLAUDE.md - Guidelines for NEXUS Community GUI

## Commands
- **Run app**: `python app.py` or `flask run`
- **Install dependencies**: `pip install -r requirements.txt`
- **Lint**: `flake8 --max-line-length=120 .`
- **Type checking**: `mypy app.py`
- **Format code**: `black --line-length=120 .`
- **Run tests**: `pytest` (when tests are added)

## Code Style Guidelines
- **Formatting**: Follow PEP8, 4-space indentation, 120 character line limit
- **Imports**: Group as: standard library, third-party, local modules (alphabetically)
- **Types**: Add type hints for function parameters and return values
- **Naming**: 
  - Variables/functions: `snake_case`
  - Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
- **Error handling**: Use specific exceptions rather than bare `except` clauses
- **Documentation**: Add docstrings to all functions and classes using """triple quotes"""
- **HTML/CSS/JS**: 2-space indentation, keep related CSS properties grouped
- **JSON data**: Store all app data in `/static/data/` as JSON files
- **File structure**: Keep Flask routes in `app.py`, use modular CSS/JS files
- **API responses**: Use JSON format with consistent structure for all API endpoints
- **Comments**: Include comments for complex logic but prefer self-documenting code
import pytest
from app.main import app
from app.services.storage import init_db


@pytest.fixture(scope="session", autouse=True)
def initialize_database():
    """Initialize database before running tests."""
    init_db()
    yield
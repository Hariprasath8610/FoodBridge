import pytest
from pydantic import ValidationError
from ai.schemas import parse_action,validate_action_coordinates
def test_click_schema():assert parse_action('{"next_action":{"action":"click","x":2,"y":3}}').x==2
def test_reject_missing_coordinate():
    with pytest.raises(ValidationError):parse_action('{"next_action":{"action":"click","x":2}}')
def test_reject_unknown_action_name():
    with pytest.raises(ValidationError):parse_action('{"next_action":{"action":"teleport"}}')
def test_reject_pointer_outside_screenshot():
    action=parse_action('{"next_action":{"action":"click","x":10,"y":3}}')
    with pytest.raises(ValueError):validate_action_coordinates(action,10,10)

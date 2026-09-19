from ai.schemas import parse_action
from security.permissions import requires_confirmation
def test_destructive_command_requires_confirmation():assert requires_confirmation(parse_action('{"next_action":{"action":"system_command","command":"shutdown /s"}}'))
def test_click_is_low_risk():assert not requires_confirmation(parse_action('{"next_action":{"action":"click","x":1,"y":1}}'))

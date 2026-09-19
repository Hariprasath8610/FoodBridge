from ai.schemas import ActionBase,ActionName,SystemCommandAction
_DANGEROUS=("del ","remove-item","rm ","format","shutdown","restart","diskpart","bcdedit","reg add","pip install","winget install")
def requires_confirmation(action:ActionBase)->bool:
    if action.action==ActionName.SYSTEM_COMMAND:return any(x in action.command.lower() for x in _DANGEROUS)
    return action.action==ActionName.ASK_CONFIRMATION
def is_allowed_without_confirmation(action:ActionBase)->bool:return not requires_confirmation(action)

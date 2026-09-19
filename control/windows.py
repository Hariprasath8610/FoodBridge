import subprocess
_APPS={"notepad":["notepad.exe"],"calculator":["calc.exe"],"file explorer":["explorer.exe"],"command prompt":["cmd.exe"],"powershell":["powershell.exe"],"vs code":["code"],"chrome":["chrome"]}
def open_application(application:str)->None:
    command=_APPS.get(application.strip().lower())
    if not command:raise ValueError(f"Application is not in the safe allowlist: {application}")
    subprocess.Popen(command,shell=False)

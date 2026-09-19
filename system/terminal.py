import subprocess
def run_safe_command(command:str)->subprocess.CompletedProcess[str]:return subprocess.run(command,shell=True,capture_output=True,text=True,timeout=30)

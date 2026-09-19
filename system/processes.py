import psutil
def list_processes()->list[dict]:return [{"pid":p.info["pid"],"name":p.info["name"]} for p in psutil.process_iter(["pid","name"])]
def system_info()->dict:return {"cpu_count":psutil.cpu_count(),"memory_percent":psutil.virtual_memory().percent}

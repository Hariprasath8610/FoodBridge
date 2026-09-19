from pathlib import Path
def create_folder(path:str)->Path:
    target=Path(path).expanduser().resolve();target.mkdir(parents=True,exist_ok=True);return target
def find_files(directory:str,pattern:str="*")->list[Path]:return list(Path(directory).expanduser().glob(pattern))
def open_file(path:str)->None:
    import os;os.startfile(Path(path).expanduser().resolve())

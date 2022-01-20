import subprocess
import mcjson
import re
import eel
import glob
import tkinter
from tkinter import filedialog


process = None


@eel.expose
def open_file():
    root = tkinter.Tk()
    root.attributes("-topmost", True)
    root.withdraw()
    path = tkinter.filedialog.askdirectory(initialdir='os.getenv("HOMEDRIVE") + os.getenv("HOMEPATH") "\\Documents"')
    if not check_dir(path):
        eel.add_alert("jarファイルもしくはserver.propertiesが見つかりませんでした。", False)
        return
    return path


def check_dir(path):
    jar = list()
    pro = None
    files = glob.glob(path + "/*")
    for file in files:
        if re.match(".*\.jar$", file):
            jar.append(file)
        if re.match(".*\\\server\.properties$", file):
            pro = file
    if not jar or pro is None:
        return False
    mcjson.update_json(path, jar, pro)
    return True


@eel.expose
def run_mc_server(path, jar, xmx, xms, gui):
    cmd = f'java -Xmx{xmx}G -Xms{xms}G -jar "{jar}"'
    cmd = cmd if gui else cmd + " nogui"
    global process
    process = subprocess.Popen(f'{cmd}', cwd=path)
    eel.add_alert("サーバーを起動しました。", True)


@eel.expose
def stop_mc_server():
    global process
    if process is None:
        eel.add_alert("プロセスを実行していません。", False)
        return
    process.kill()
    print("\n-----------終了-----------\n")
    process = None
    eel.add_alert("プロセスを強制終了しました。", True)


eel.init('gui')
eel.start('index.html')

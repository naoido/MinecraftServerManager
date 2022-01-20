import json
from typing import Dict
import eel


def update_json(path, jar, pro):
    try:
        file = open("file.json", mode="r+", encoding="utf-8")
        json_data = json.load(file)
        json_data[path] = {"jar": jar, "pro": pro}
    except Exception:
        json_data = {path: {"jar": jar, "pro": pro}}
    file = open("file.json", mode="w+", encoding="utf-8")
    json.dump(json_data, file, indent=2, ensure_ascii=False)


def add_name_json(path, name):
    try:
        file = open("file.json", mode="r+", encoding="utf-8")
        json_data = json.load(file)
        json_data[path][name] = name
    except Exception:
        return False
    return True


@eel.expose
def path_load():
    data: Dict[str, Dict[str, list]] = {}
    file = open("file.json", mode="r+", encoding="utf-8")
    json_data = json.load(file)
    for k in json_data.keys():
        data[k] = {"jar": json_data[k]["jar"], "pro": json_data[k]["pro"]}
    return data


@eel.expose
def del_path(path):
    print(path)
    try:
        file = open("file.json", mode="r+", encoding="utf-8")
        json_data = json.load(file)
        del json_data[path]
    except Exception:
        return False
    file = open("file.json", mode="w+", encoding="utf-8")
    json.dump(json_data, file, indent=2, ensure_ascii=False)
    return True


@eel.expose
def del_jar(jar_idx, path):
    try:
        file = open("file.json", mode="r+", encoding="utf-8")
        json_data = json.load(file)
        del json_data[path]["jar"][jar_idx]
    except Exception as e:
        print(e)
        return False
    file = open("file.json", mode="w+", encoding="utf-8")
    json.dump(json_data, file, indent=2, ensure_ascii=False)
    return True

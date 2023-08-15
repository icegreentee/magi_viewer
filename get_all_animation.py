import gzip
import json
import os

source_package = "./package"
source_img_native = "./image_native"

jsons = {
}


def unzip(file):
    with gzip.open(file, 'r') as f:
        json_data = f.read()
        json_data = json_data.decode()[:-1]
        with open(file[:-3], "w", encoding="utf-8") as f:
            f.write(json_data)
        return json.loads(json_data)


def get_json_data(dirpath, filepath):
    if filepath.split(".")[-1] == "gz":
        data = unzip(dirpath + "/" + filepath)
    else:
        with open(dirpath + "/" + filepath, "r") as f:
            data = json.load(f)
    animation_data = data["animation_data"]
    plist_l = data["config_file_path"]
    png_l = data["config_png_path"]
    name = animation_data[0]["name"]
    mov_data = []
    for i in animation_data[0]["mov_data"]:
        mov_data.append(i["name"])
    new_data = {
        "base": dirpath,
        "name": name,
        "plist_l": plist_l,
        "png_l": png_l,
        "mov_data": mov_data
    }
    # print(data)
    return new_data


def add_package(root="package"):
    new_json = {}
    for dirpath, dirnames, filenames in os.walk(root):
        for filepath in filenames:
            if filepath.split(".")[-1] == "ExportJson":
                data = get_json_data(dirpath, filepath)
                file_level = dirpath.split("\\")[1]
                if file_level in new_json:
                    new_json[file_level][filepath] = data
                else:
                    new_json[file_level] = {filepath: data}
    jsons[root] = new_json


def add_image_native(root="image_native"):
    new_json = {}
    for dirpath, dirnames, filenames in os.walk(root):
        for filepath in filenames:
            if filepath.split(".")[-1] == "gz":
                data = get_json_data(dirpath, filepath)
                file_level = dirpath.split("\\")[1]
                filepath = filepath[:-3]
                if file_level in new_json:
                    new_json[file_level][filepath] = data
                else:
                    new_json[file_level] = {filepath: data}
    jsons[root] = new_json


add_package()
add_image_native()

with open('output.json', 'w') as f:
    json.dump(jsons, f)

# -*- coding: UTF-8 -*-
import json
import os

Live2d_PATH = "../image_native/live2d_v4/"
dl = os.listdir(Live2d_PATH)
dl.sort()
chars = {}
for live2d_dir in dl:
    char_id = live2d_dir[0:-2]
    with open(Live2d_PATH + live2d_dir + "/params.json", "r", encoding="utf-8") as f:
        charaname = json.load(f)["charaName"].strip().replace('(圧縮)', '').replace('（圧縮）', '').replace('_圧縮', '').strip(
            '_圧縮').replace(' ', '')
    if char_id not in chars:
        chars[char_id] = {live2d_dir: charaname}
    else:
        chars[char_id][live2d_dir] = charaname

with open(  "list.json", 'w', encoding="UTF-8") as f:
    json.dump(chars, f, ensure_ascii=False, indent=4, sort_keys=True)
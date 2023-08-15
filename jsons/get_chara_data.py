# -*- coding: UTF-8 -*-
import json

from bs4 import BeautifulSoup

with open('1.html', 'r', encoding="utf-8") as f:
    html_str = f.read()

soup = BeautifulSoup(html_str, 'html.parser')
data = soup.find_all("li")
dic = {}
for i in data:
    index = i.text.split(" ")[0][1:-1]
    # shu = i.img["alt"]
    chinese = i.find_all("a")[1]["title"]
    dic[index] = {"cn": chinese}
print(dic)

with open("./charaCard.json", "r", encoding="utf-8") as f:
    content = json.load(f)

new_l = [
    "./image_native/mini/anime_v2/mini_100101_r.ExportJson",
    "./image_native/mini/anime_v2/mini_100101_r0.plist",
]
for i in content:
    dic[i]["attr"] = content[i]["attributeId"]
    dic[i]["defaultCardId"] = content[i]["defaultCardId"]
    dic[i]["defaultRank"] = content[i]["defaultCardId"] % 10
    e_n = 0
    if "evolutionCard4" in content[i]:
        e_n = 4
    elif "evolutionCard3" in content[i]:
        e_n = 3
    elif "evolutionCard2" in content[i]:
        e_n = 2
    elif "evolutionCard1" in content[i]:
        e_n = 1
    dic[i]["maxRank"] = dic[i]["defaultRank"]+e_n
    new_l.append("./image_native/mini/anime_v2/mini_" + i + "00_r.ExportJson")
    new_l.append("./image_native/mini/anime_v2/mini_" + i + "00_r0.plist")

with open("./chara_data.json", "w", encoding="utf-8") as f:
    json.dump(dic, f, indent=4, ensure_ascii=False)

with open("./mini_data.json", "w", encoding="utf-8") as f:
    json.dump(new_l, f, indent=4, ensure_ascii=False)

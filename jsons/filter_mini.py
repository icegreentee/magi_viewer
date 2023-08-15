# -*- coding: UTF-8 -*-
import os

file_p="../image_native/mini/anime_v2/"
files = [os.path.join(file_p, file) for file in os.listdir(file_p)]

# 遍历文件列表，输出文件名
for file in files:
    if file.split("/")[-1].split("_")[2]=="d" or file.split("/")[-1].split("_")[2]=="m":
        print(file)
        os.remove(file)
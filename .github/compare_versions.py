import os
import json

tag = os.getenv("TAG")

with open("./package.json", "r") as f:
    package_json = json.loads(f.read())
    global main_package_json_version
    main_package_json_version = package_json["version"]
    f.close()
with open("./release/app/package.json", "r") as f:
    package_json = json.loads(f.read())
    global release_package_json_version
    release_package_json_version = package_json["version"]
    f.close()

if main_package_json_version == "" or release_package_json_version == "":
    os._exit(1)

if main_package_json_version != release_package_json_version:
    os._exit(1)

if main_package_json_version != tag or release_package_json_version != tag:
    os._exit(1)

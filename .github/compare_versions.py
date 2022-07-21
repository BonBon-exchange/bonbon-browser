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

print("package.json "+ main_package_json_version + " release package.json " + release_package_json_version + " tag " + tag)
print("ALL EQUAL " + str(main_package_json_version is release_package_json_version is tag))

if main_package_json_version is not release_package_json_version is not tag:
    raise SystemError()
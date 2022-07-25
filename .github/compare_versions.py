import os
import json

import semver

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

tag_simplified = str(tag[1:])

are_package_jsons_equal = semver.compare(main_package_json_version, release_package_json_version)
is_package_json_version_and_tag_equal = semver.compare(main_package_json_version, tag_simplified)

if is_package_json_version_and_tag_equal == 0 and are_package_jsons_equal == 0:
    print("All good")
else:
    print(is_package_json_version_and_tag_equal, are_package_jsons_equal)
    raise RuntimeError()
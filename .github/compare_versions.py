import os
import json
import semver
import re

def extract_version(tag):
    # Extracts a valid SemVer string from the given tag
    match = re.search(r'v(\d+\.\d+\.\d+(-[0-9A-Za-z-.]+)?)', tag)
    return match.group(1) if match else None

# Get the tag from the environment
tag = os.getenv("TAG", "")
tag_simplified = extract_version(tag)

# Load versions from package.json files
with open("./package.json", "r") as f:
    main_package_json = json.load(f)
    main_package_json_version = main_package_json["version"]

with open("./release/app/package.json", "r") as f:
    release_package_json = json.load(f)
    release_package_json_version = release_package_json["version"]

# Check if the extracted tag version is valid
if not tag_simplified:
    raise ValueError(f"{tag} is not a valid SemVer string")

# Compare the versions
are_package_jsons_equal = semver.compare(main_package_json_version, release_package_json_version)
is_package_json_version_and_tag_equal = semver.compare(main_package_json_version, tag_simplified)

# Output result based on comparisons
if is_package_json_version_and_tag_equal == 0 and are_package_jsons_equal == 0:
    print("All good")
else:
    print(f"Version comparison results: Tag vs Main: {is_package_json_version_and_tag_equal}, Main vs Release: {are_package_jsons_equal}")
    raise RuntimeError("Version mismatch detected.")

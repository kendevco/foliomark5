import os
import yaml
import sys

# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Determine the project root (two levels up from the script location)
ROOT_DIR = os.path.dirname(SCRIPT_DIR)

CONFIG_FILE = os.path.join(ROOT_DIR, '.aider.conf.yml')

FILE_TYPES = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json', '.md', '.mdx']
EXCLUDE_FOLDERS = ['.next', 'node_modules', '.vscode', '.git', '.contentlayer', '.husky', 'utils']
INCLUDE_FOLDERS = ['src', 'collections']
SPECIFIC_FILES = ['payload.config.ts', 'utils\BookLog.csv', 'utils\payload-3-movies.txt']

def get_relevant_files(root_dir):
    relevant_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_FOLDERS]

        if not any(folder in root for folder in INCLUDE_FOLDERS) and root != root_dir:
            continue

        for file in files:
            if file.endswith(tuple(FILE_TYPES)) or file in SPECIFIC_FILES:
                file_path = os.path.relpath(os.path.join(root, file), root_dir)
                relevant_files.append(file_path.replace('\\', '/'))

    return relevant_files

def generate_config(files):
    config = {
        'model': 'gpt-4',
        'env-file': '.env',
        'show-model-warnings': True,
        'max-chat-history-tokens': 4096,
        'map-tokens': 2048,
        'edit-format': 'udiff',
        'weak-model': 'gpt-3.5-turbo',
        'files': files,
        'dark-mode': True,
        'pretty': True,
        'stream': True,
        'user-input-color': '#00cc00',
        'assistant-output-color': '#0088ff',
        'show-diffs': True,
        'git': True,
        'gitignore': True,
        'auto-commits': True,
        'dirty-commits': True,
        'attribute-author': True,
        'attribute-committer': True,
        'auto-lint': True,
        'auto-test': False,
        'input-history-file': '.aider.input.history',
        'chat-history-file': '.aider.chat.history.md',
        'restore-chat-history': True,
        'verbose': True,
        'check-update': True,
        'encoding': 'utf-8'
    }

    return config

def write_config(config, file_path):
    with open(file_path, 'w') as f:
        f.write("##########################################################\n")
        f.write("# Aider Configuration for Payload CMS 3.0 BookLog Feature\n")
        f.write("##########################################################\n\n")
        yaml.dump(config, f, default_flow_style=False, sort_keys=False)

if __name__ == '__main__':
    print(f"Script location: {SCRIPT_DIR}")
    print(f"Project root: {ROOT_DIR}")
    print(f"Configuration will be generated at: {CONFIG_FILE}")

    relevant_files = get_relevant_files(ROOT_DIR)
    config = generate_config(relevant_files)
    write_config(config, CONFIG_FILE)

    print(f"\nConfiguration file has been generated at: {CONFIG_FILE}")
    print(f"Total files included: {len(relevant_files)}")

    print("\nIncluded files:")
    for file in relevant_files:
        print(f"  - {file}")

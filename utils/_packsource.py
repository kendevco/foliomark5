import os
import sys
import fnmatch
<<<<<<< HEAD
import re
=======
>>>>>>> origin/main

# Always use the root\utils directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UTILS_DIR = os.path.join(ROOT_DIR, 'utils')
OUTPUT_DIR = os.path.join(UTILS_DIR, 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

FILE_TYPES = ['.js', '.jsx', '.ts', '.tsx', '.prisma', '.md', '.scss', '.css', '.mdx']
EXCLUDE_FOLDERS = ['.next', 'node_modules', '.vscode', '.git', '.contentlayer', '.husky', 'utils']
EXCLUDE_FILES = ['package-lock.json', '*.log', '*.lock', '*.env', '*.test.js', '*.spec.js', '*.map', 'pnpm-lock.yaml', 'pnpm-workspace.yaml']
INCLUDE_SUBDIRS = ['(app)', '(frontend)']
MOVIE_RELATED_FILES = ['MovieCards.tsx', 'route.ts', 'add/page.tsx', 'movie/[slug]/page.tsx']

<<<<<<< HEAD
DEPENDENCY_PATTERN = r"import\s+.*?from\s+['\"]([^'\"]+)['\"]"

=======
>>>>>>> origin/main
def get_all_files(root_dir):
    all_files = []
    included_files = []
    excluded_files = []

    for root, dirs, files in os.walk(root_dir):
        # Exclude folders
        dirs[:] = [d for d in dirs if d not in EXCLUDE_FOLDERS]

        # Include specific subdirectories
        if not any(subdir in root for subdir in INCLUDE_SUBDIRS) and 'app' not in root:
            continue

        for file in files:
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, root_dir)

            if file.lower().endswith(tuple(FILE_TYPES)) and not any(fnmatch.fnmatch(file, pattern) for pattern in EXCLUDE_FILES):
                if 'app' in relative_path or any(movie_file in relative_path for movie_file in MOVIE_RELATED_FILES):
                    included_files.append(relative_path)
                else:
                    excluded_files.append(relative_path)
            else:
                excluded_files.append(relative_path)

            all_files.append(relative_path)

    return all_files, included_files, excluded_files

<<<<<<< HEAD
def extract_dependencies(file_path):
    dependencies = set()
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(DEPENDENCY_PATTERN, content)
        for match in matches:
            if not match.startswith('.'):
                dependencies.add(match.split('/')[0])  # Get only the package name, not submodules
    return dependencies

def write_source_files(included_files, excluded_files, output_file, root_dir):
    all_dependencies = set()
=======
def write_source_files(included_files, excluded_files, output_file, root_dir):
>>>>>>> origin/main
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"// Included files:\n")
        for file in included_files:
            f.write(f"// {file}\n")
            try:
<<<<<<< HEAD
                file_path = os.path.join(root_dir, file)
                with open(file_path, 'r', encoding='utf-8') as source_file:
                    f.write(source_file.read())

                # Extract and accumulate dependencies
                dependencies = extract_dependencies(file_path)
                all_dependencies.update(dependencies)
=======
                with open(os.path.join(root_dir, file), 'r', encoding='utf-8') as source_file:
                    f.write(source_file.read())
>>>>>>> origin/main
            except Exception as e:
                f.write(f"// Error reading file: {str(e)}\n")
            f.write('\n\n')

        f.write(f"\n// Excluded files:\n")
        for file in excluded_files:
            f.write(f"// {file}\n")

<<<<<<< HEAD
    return all_dependencies

=======
>>>>>>> origin/main
def process_directory(dir_name, dir_path):
    all_files, included_files, excluded_files = get_all_files(dir_path)

    if all_files:
        output_file = os.path.join(OUTPUT_DIR, f'{dir_name}_source_files.txt')
<<<<<<< HEAD
        dependencies = write_source_files(included_files, excluded_files, output_file, dir_path)
=======
        write_source_files(included_files, excluded_files, output_file, dir_path)
>>>>>>> origin/main
        print(f"Files from {dir_name} have been processed and written to: {output_file}")
        print(f"  Included files: {len(included_files)}")
        print(f"  Excluded files: {len(excluded_files)}")
    else:
        print(f"No files found in {dir_name}")

<<<<<<< HEAD
    return dir_path, (included_files, excluded_files), dependencies
=======
    return dir_path, (included_files, excluded_files)
>>>>>>> origin/main

def generate_summary(processed_dirs):
    summary_file = os.path.join(OUTPUT_DIR, 'summary.txt')
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("Application Structure Summary:\n\n")
<<<<<<< HEAD
        all_dependencies = set()
        for dir_name, (dir_path, (included_files, excluded_files), dependencies) in processed_dirs.items():
=======
        for dir_name, (dir_path, (included_files, excluded_files)) in processed_dirs.items():
>>>>>>> origin/main
            all_files = included_files + excluded_files
            f.write(f"{dir_name}:\n")
            f.write(f"  Total files: {len(all_files)}\n")
            f.write(f"  Included files: {len(included_files)}\n")
<<<<<<< HEAD
            f.write(f"  Excluded files: {len(excluded_files)}\n")
            f.write(f"  Dependencies: {', '.join(sorted(dependencies))}\n\n")
            all_dependencies.update(dependencies)
        f.write(f"All dependencies:\n{', '.join(sorted(all_dependencies))}\n")
=======
            f.write(f"  Excluded files: {len(excluded_files)}\n\n")
>>>>>>> origin/main
    print(f"Summary has been written to: {summary_file}")

def combine_all_files(processed_dirs):
    combined_file = os.path.join(OUTPUT_DIR, 'all_source_files_combined.txt')
    with open(combined_file, 'w', encoding='utf-8') as f:
<<<<<<< HEAD
        for dir_name, (dir_path, (included_files, excluded_files), _) in processed_dirs.items():
=======
        for dir_name, (dir_path, (included_files, excluded_files)) in processed_dirs.items():
>>>>>>> origin/main
            f.write(f"// Files from {dir_name}:\n\n")
            for file in included_files:
                f.write(f"// {file}\n")
                try:
                    with open(os.path.join(dir_path, file), 'r', encoding='utf-8') as source_file:
                        f.write(source_file.read())
                except Exception as e:
                    f.write(f"// Error reading file: {str(e)}\n")
                f.write('\n\n')
    print(f"All source files have been combined into: {combined_file}")

if __name__ == '__main__':
    processed_dirs = {}

    # Process the src directory specifically
    src_dir = os.path.join(ROOT_DIR, 'src')
    processed_dirs['src'] = process_directory('src', src_dir)

    generate_summary(processed_dirs)
    combine_all_files(processed_dirs)
    print("Processing complete.")

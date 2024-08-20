import os
import sys
import fnmatch
import json

# Always use the root\utils directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UTILS_DIR = os.path.join(ROOT_DIR, 'utils')
OUTPUT_DIR = os.path.join(UTILS_DIR, 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

FILE_TYPES = ['.css', '.scss', '.js', '.jsx', '.ts', '.tsx', '.json']
EXCLUDE_FOLDERS = ['.next', 'node_modules', '.vscode', '.git', '.contentlayer', '.husky']
EXCLUDE_FILES = ['package-lock.json', '*.log', '*.lock', '*.env', '*.test.js', '*.spec.js', '*.map', 'pnpm-lock.yaml', 'pnpm-workspace.yaml']
INCLUDE_SUBDIRS = ['src', 'app', 'styles', 'components']
CSS_RELATED_FILES = ['globals.css', 'tailwind.config.js', 'postcss.config.js', 'next.config.js']

def get_all_files(root_dir):
    all_files = []
    included_files = []
    excluded_files = []

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_FOLDERS]

        if not any(subdir in root for subdir in INCLUDE_SUBDIRS):
            continue

        for file in files:
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, root_dir)

            if file.lower().endswith(tuple(FILE_TYPES)) and not any(fnmatch.fnmatch(file, pattern) for pattern in EXCLUDE_FILES):
                if any(css_file in relative_path for css_file in CSS_RELATED_FILES):
                    included_files.append(relative_path)
                else:
                    excluded_files.append(relative_path)
            else:
                excluded_files.append(relative_path)

            all_files.append(relative_path)

    return all_files, included_files, excluded_files

def write_source_files(included_files, excluded_files, output_file, root_dir):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"// Included files:\n")
        for file in included_files:
            f.write(f"// {file}\n")
            try:
                with open(os.path.join(root_dir, file), 'r', encoding='utf-8') as source_file:
                    content = source_file.read()
                    f.write(content)

                    # Additional analysis for specific files
                    if 'tailwind.config.js' in file:
                        f.write("\n// Tailwind Config Analysis:\n")
                        if 'darkMode' in content:
                            f.write("// darkMode configuration found\n")
                        else:
                            f.write("// No darkMode configuration found. This might be why the app is stuck in light mode.\n")

                    if 'globals.css' in file:
                        f.write("\n// globals.css Analysis:\n")
                        if '@tailwind' in content:
                            f.write("// Tailwind directives found in globals.css\n")
                        else:
                            f.write("// Tailwind directives not found in globals.css. This might cause issues.\n")

            except Exception as e:
                f.write(f"// Error reading file: {str(e)}\n")
            f.write('\n\n')

        f.write(f"\n// Excluded files:\n")
        for file in excluded_files:
            f.write(f"// {file}\n")

def process_directory(dir_name, dir_path):
    all_files, included_files, excluded_files = get_all_files(dir_path)

    if all_files:
        output_file = os.path.join(OUTPUT_DIR, f'{dir_name}_css_tailwind_analysis.txt')
        write_source_files(included_files, excluded_files, output_file, dir_path)
        print(f"CSS and Tailwind related files from {dir_name} have been processed and written to: {output_file}")
        print(f"  Included files: {len(included_files)}")
        print(f"  Excluded files: {len(excluded_files)}")
    else:
        print(f"No files found in {dir_name}")

    return dir_path, (included_files, excluded_files)

def generate_summary(processed_dirs):
    summary_file = os.path.join(OUTPUT_DIR, 'css_tailwind_summary.txt')
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("CSS and Tailwind Configuration Summary:\n\n")
        for dir_name, (dir_path, (included_files, excluded_files)) in processed_dirs.items():
            all_files = included_files + excluded_files
            f.write(f"{dir_name}:\n")
            f.write(f"  Total files analyzed: {len(all_files)}\n")
            f.write(f"  CSS and Tailwind related files: {len(included_files)}\n")
            f.write(f"  Other files: {len(excluded_files)}\n\n")

            # Check for specific files
            css_files = [file for file in included_files if file.endswith('.css')]
            tailwind_config = any('tailwind.config.js' in file for file in included_files)
            postcss_config = any('postcss.config.js' in file for file in included_files)

            f.write(f"  CSS files found: {len(css_files)}\n")
            f.write(f"  Tailwind config found: {'Yes' if tailwind_config else 'No'}\n")
            f.write(f"  PostCSS config found: {'Yes' if postcss_config else 'No'}\n\n")

            if not tailwind_config:
                f.write("  WARNING: Tailwind config not found. This may cause issues with Tailwind CSS.\n")
            if not postcss_config:
                f.write("  WARNING: PostCSS config not found. This may cause issues with CSS processing.\n")
            if not css_files:
                f.write("  WARNING: No CSS files found. Check if styles are properly linked.\n")

    print(f"CSS and Tailwind summary has been written to: {summary_file}")

if __name__ == '__main__':
    processed_dirs = {}

    # Process the src directory
    src_dir = os.path.join(ROOT_DIR, 'src')
    processed_dirs['src'] = process_directory('src', src_dir)

    # Process the app directory if it exists
    app_dir = os.path.join(ROOT_DIR, 'app')
    if os.path.exists(app_dir):
        processed_dirs['app'] = process_directory('app', app_dir)

    generate_summary(processed_dirs)
    print("CSS and Tailwind analysis complete.")

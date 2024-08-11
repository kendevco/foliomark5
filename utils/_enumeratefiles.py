import os
import sys
import fnmatch

# Always use the root\utils directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FILE_TYPES = ['.js', '.jsx', '.ts', '.tsx', '.prisma', '.md', '.scss', '.css', '.mdx']
EXCLUDE_FOLDERS = ['.next', 'node_modules', '.vscode', '.git', '.contentlayer', '.husky', 'utils']
EXCLUDE_FILES = ['package-lock.json', '*.log', '*.lock', '*.env', '*.test.js', '*.spec.js', '*.map', 'pnpm-lock.yaml', 'pnpm-workspace.yaml']
INCLUDE_SUBDIRS = ['(app)', '(frontend)']
MOVIE_RELATED_FILES = ['MovieCards.tsx', 'route.ts', 'add/page.tsx', 'movie/[slug]/page.tsx']

def get_all_files(root_dir):
    all_files = []
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
                    all_files.append(relative_path)

    return all_files

if __name__ == '__main__':
    all_files = get_all_files(ROOT_DIR)
    print("\n".join(all_files))

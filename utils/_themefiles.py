import os
import datetime

def consolidate_files(directory):
    # Get the directory where the script is running
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(script_dir, 'consolidated_providers.txt')

    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(f"Consolidated Provider Files\n")
        outfile.write(f"Generated on: {datetime.datetime.now()}\n\n")

        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, directory)

                    outfile.write(f"\n\n{'='*50}\n")
                    outfile.write(f"File: {relative_path}\n")
                    outfile.write(f"{'='*50}\n\n")

                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"Error reading file: {str(e)}\n")

    print(f"Consolidated files have been written to {output_file}")

if __name__ == "__main__":
    providers_directory = r"C:\Data\Dev\Payload\fmark5\src\app\providers"
    consolidate_files(providers_directory)

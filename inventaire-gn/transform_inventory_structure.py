#!/usr/bin/env python3
"""
Transform Inventory JSON Structure

This script transforms the inventory JSON structure from a flat structure
with separate box content sections to a nested structure where box contents
are directly embedded within their parent boxes.

Usage:
    python transform_inventory_structure.py input.json output.json
"""

import json
import sys
import os

def transform_inventory_data(original_data):
    """
    Transform the inventory data structure.
    
    Args:
        original_data (dict): The original inventory data with separate box content sections.
        
    Returns:
        dict: The transformed inventory data with box contents nested within their parent boxes.
    """
    new_data = {}
    box_content_sections = {}
    
    # First pass: identify all box content sections
    for section_key in list(original_data.keys()):
        if section_key.endswith('_contents') and 'boxId' in original_data[section_key]:
            box_id = original_data[section_key]['boxId']
            box_content_sections[section_key] = box_id
    
    # Second pass: copy regular sections and prepare for nesting
    for section_key in list(original_data.keys()):
        # Skip box content sections (we'll nest them later)
        if section_key not in box_content_sections:
            # Copy the section
            new_data[section_key] = original_data[section_key].copy()
    
    # Third pass: find boxes and add their contents
    for section_key in list(new_data.keys()):
        section = new_data[section_key]
        
        if 'subsections' not in section:
            continue
            
        for subsection_key in list(section['subsections'].keys()):
            subsection = section['subsections'][subsection_key]
            
            if 'items' not in subsection:
                continue
                
            for item in subsection['items']:
                if item.get('isBox') and 'boxId' in item:
                    # Find the corresponding content section
                    content_section_key = f"{item['boxId']}_contents"
                    
                    if content_section_key in original_data:
                        # Add contents property to the box
                        item['contents'] = {}
                        
                        # Copy the subsections from the content section
                        if 'subsections' in original_data[content_section_key]:
                            for content_subsection_key, content_subsection in original_data[content_section_key]['subsections'].items():
                                item['contents'][content_subsection_key] = content_subsection.copy()
    
    return new_data

def main():
    """Main function to process the JSON file."""
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} input.json output.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.isfile(input_file):
        print(f"Error: Input file '{input_file}' does not exist.")
        sys.exit(1)
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError:
        print(f"Error: '{input_file}' is not a valid JSON file.")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading input file: {str(e)}")
        sys.exit(1)
    
    transformed_data = transform_inventory_data(data)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(transformed_data, f, ensure_ascii=False, indent=2)
        print(f"Successfully transformed inventory structure. Output saved to '{output_file}'")
        
        # Print some stats
        original_sections = len(data)
        new_sections = len(transformed_data)
        removed_sections = original_sections - new_sections
        
        print(f"Original sections: {original_sections}")
        print(f"New sections: {new_sections}")
        print(f"Removed sections (box contents): {removed_sections}")
        
    except Exception as e:
        print(f"Error writing output file: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
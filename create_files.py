output_dir="public/assets/"

import os
import sys
from pdf2image import convert_from_path
from PIL import Image
import numpy as np

def trim_whitespace(image):
    """Remove white borders from an image"""
    # Convert image to numpy array
    img_array = np.array(image)
    
    # Find non-white pixels
    if len(img_array.shape) == 3:  # RGB image
        mask = ~((img_array[:,:,0] == 255) & 
                 (img_array[:,:,1] == 255) & 
                 (img_array[:,:,2] == 255))
    else:  # Grayscale image
        mask = img_array < 255
    
    # Find coordinates of non-white pixels
    coords = np.argwhere(mask)
    if len(coords) == 0:  # All white image
        return image
    
    # Find bounding box
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    
    # Crop the image
    return image.crop((x_min, y_min, x_max + 1, y_max + 1))

def convert_pdf_to_jpg(pdf_path, output_dir, dpi=300):
    """Convert PDF to JPG images and remove white borders"""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get filename without extension
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Convert PDF to images
    print(f"Converting {pdf_path} to images...")
    images = convert_from_path(pdf_path, dpi=dpi)
    
    # Process each page
    for i, img in enumerate(images):
        # Remove white borders
        img_trimmed = trim_whitespace(img)
        
        # Create output filename
        output_file = os.path.join(output_dir, f"{base_name}_page_{i+1}.jpg")
        
        # Save the image
        img_trimmed.save(output_file, "JPEG", quality=95)
        print(f"Saved {output_file}")
    
    print(f"Successfully converted {len(images)} pages from {pdf_path}")
    

def create_txt_file_from_jpg_name(pdf_path):
    """Create a text file with the same name as the PDF file"""
    # Get filename without extension
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Create text file
    txt_path = os.path.join(output_dir, f"{base_name}.txt")
    with open(txt_path, "w") as f:
        f.write(f"Text extracted from {pdf_path}")
    
    print(f"Created {txt_path}")
    
    
def convert_jpg_images_to_1024_768(jpg_path):
    """Convert JPG images to 1024x768 resolution"""
    # Open the image
    img = Image.open(jpg_path)
    
    # Resize the image
    img_resized = img.resize((1024, 768))
    
    # Save the image
    img_resized.save(jpg_path)
    print(f"Resized {jpg_path} to 1024x768")

if __name__ == "__main__":
    # if len(sys.argv) < 2:
    #     print("Usage: python create_files.py <path_to_pdf_file>")
    #     sys.exit(1)
    
    # pdf_path = sys.argv[1]
    # convert_pdf_to_jpg(pdf_path, output_dir)

    for filename in os.listdir("public/assets/"):
        if filename.endswith(".jpg"):
            #convert_pdf_to_jpg(filename, output_dir)
            convert_jpg_images_to_1024_768(output_dir+filename)
            #create_txt_file_from_jpg_name(filename)
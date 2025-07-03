from PIL import Image
import os

def compress_images(input_folder="img", output_folder="img_compressed", quality=85):
    """
    Compress all PNG images in a folder
    
    Args:
        input_folder: folder containing original images
        output_folder: folder to save compressed images
        quality: compression quality (1-100, higher = better quality)
    """
    
    # Create output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Get all PNG files
    image_files = [f for f in os.listdir(input_folder) if f.lower().endswith('.png')]
    
    print(f"Found {len(image_files)} images to compress...")
    
    for i, filename in enumerate(image_files):
        try:
            # Open image
            img_path = os.path.join(input_folder, filename)
            with Image.open(img_path) as img:
                
                # Convert RGBA to RGB if needed (for JPEG)
                if img.mode == 'RGBA':
                    # Create white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1])  # Use alpha channel as mask
                    img = background
                
                # Save as JPEG with compression
                output_path = os.path.join(output_folder, filename.replace('.png', '.jpg'))
                img.save(output_path, 'JPEG', quality=quality, optimize=True)
                
                # Get file sizes
                original_size = os.path.getsize(img_path)
                compressed_size = os.path.getsize(output_path)
                reduction = (1 - compressed_size/original_size) * 100
                
                print(f"{i+1:2d}. {filename}: {original_size:,} → {compressed_size:,} bytes ({reduction:.1f}% smaller)")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")
    
    print("\nCompression complete!")

# Alternative: Keep as PNG but optimize
def optimize_pngs(input_folder="img", output_folder="img_optimized"):
    """
    Optimize PNG files without changing format
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    image_files = [f for f in os.listdir(input_folder) if f.lower().endswith('.png')]
    
    for i, filename in enumerate(image_files):
        try:
            img_path = os.path.join(input_folder, filename)
            with Image.open(img_path) as img:
                # Optimize PNG
                output_path = os.path.join(output_folder, filename)
                img.save(output_path, 'PNG', optimize=True)
                
                original_size = os.path.getsize(img_path)
                optimized_size = os.path.getsize(output_path)
                reduction = (1 - optimized_size/original_size) * 100
                
                print(f"{i+1:2d}. {filename}: {original_size:,} → {optimized_size:,} bytes ({reduction:.1f}% smaller)")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    # Run compression
    compress_images(quality=80)  # Adjust quality as needed
    
    # Or run PNG optimization instead
    # optimize_pngs()
from pathlib import Path
from PIL import Image

folder = Path("quickstart-images")
folder.mkdir(exist_ok=True)
for name, size in [("large", (640, 480)),
                   ("medium", (320, 240)), ("small", (64, 64))]:
    Image.new("RGB", size, "#546354").save(folder / f"{name}.png")

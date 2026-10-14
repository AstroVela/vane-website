export const quickstartFixtures = `from pathlib import Path
from PIL import Image

folder = Path("quickstart-images")
folder.mkdir(exist_ok=True)
for name, size in [("large", (640, 480)),
                   ("medium", (320, 240)), ("small", (64, 64))]:
    Image.new("RGB", size, "#546354").save(folder / f"{name}.png")`

export const quickstartSql = `WITH images AS (
  SELECT image_file(file) AS source
  FROM list_files('quickstart-images/*.png')
), metadata AS (
  SELECT source, image_file_metadata(source) AS info FROM images
), thumbnails AS (
  SELECT info.width AS source_width, info.height AS source_height,
         resize(decode_image_file(source, 'RGB'), 224, 224) AS thumbnail
  FROM metadata WHERE info.width >= 300
)
SELECT source_width, source_height,
       image_width(thumbnail) AS width,
       image_height(thumbnail) AS height
FROM thumbnails ORDER BY source_width DESC;`

export const quickstartPython = `import vane

vane.configure(runner="local")
con = vane.connect()
thumbnails = (vane.from_files("quickstart-images/*.png", connection=con)
    .select(vane.image_file(vane.col("file")).alias("source"))
    .select(vane.col("source"),
            vane.image_file_metadata(vane.col("source")).alias("info"))
    .filter("info.width >= 300")
    .project("info.width AS source_width, info.height AS source_height, source")
    .select(vane.col("source_width"), vane.col("source_height"),
            vane.resize(vane.decode_image_file(vane.col("source"), "RGB"),
                        224, 224).alias("thumbnail")))
thumbnails.select(
    vane.col("source_width"), vane.col("source_height"),
    vane.image_width(vane.col("thumbnail")).alias("width"),
    vane.image_height(vane.col("thumbnail")).alias("height"),
).order("source_width DESC").show()`

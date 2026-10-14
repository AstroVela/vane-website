import vane

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
).order("source_width DESC").show()

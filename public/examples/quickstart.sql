WITH images AS (
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
FROM thumbnails ORDER BY source_width DESC;

import CodeWindow from './CodeWindow'

const HERO_PIPELINE_CODE = `import vane

con = vane.connect()
images = con.sql("""
    SELECT image_file(
        'quickstart-images/large.png'
    ) AS source
""")

images.select("""
    source,
    image_file_metadata(source).width AS width,
    resize(
        decode_image_file(source, 'RGB'),
        224, 224
    ) AS image
""").show()`

export default function HomeHeroExecution() {
  return (
    <CodeWindow
      filename="native_images.py"
      language="python"
      code={HERO_PIPELINE_CODE}
      showHeader={false}
    />
  )
}

import {useState} from 'react'
import CodeWindow from './CodeWindow'
import {useSiteLocale} from '../siteI18n'

const python = `from pathlib import Path
from PIL import Image
import vane

assets = Path("quickstart-images").resolve()
assets.mkdir(exist_ok=True)
for name, size, color in [
    ("large", (640, 480), "navy"),
    ("medium", (320, 240), "orange"),
    ("small", (64, 64), "green"),
]:
    Image.new("RGB", size, color).save(assets / f"{name}.png")

con = vane.connect()
files = vane.from_files(
    [str(assets / f"{name}.png") for name in ("large", "medium", "small")],
    connection=con,
)
images = con.sql("SELECT image_file(file) AS source FROM files")
metadata = con.sql("SELECT source, image_file_metadata(source) AS info FROM images")
thumbnails = con.sql("""
    SELECT info.width AS source_width, info.height AS source_height,
           resize(decode_image_file(source, 'RGB'), 224, 224) AS thumbnail
    FROM metadata WHERE info.width >= 300
""")
con.sql("""
    SELECT source_width, source_height,
           image_width(thumbnail) AS width,
           image_height(thumbnail) AS height,
           typeof(thumbnail) AS image_type
    FROM thumbnails ORDER BY source_width DESC
""").show()`
const sql = `SELECT info.width AS source_width, info.height AS source_height,
       resize(decode_image_file(source, 'RGB'), 224, 224) AS thumbnail
FROM metadata
WHERE info.width >= 300;`
export default function HomeHeroExecution() {
  const [active, setActive] = useState('Python'), locale = useSiteLocale()
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <div className="data-example"><div className="marketing-tabs" role="group" aria-label={t('Quickstart language', '快速入门语言')}>{['Python', 'SQL'].map(key => <button key={key} type="button" aria-pressed={active === key} onClick={() => setActive(key)}>{key}</button>)}</div>
    <CodeWindow key={active} filename={active === 'Python' ? 'quickstart.py' : 'thumbnail.sql'} language={active.toLowerCase()} code={active === 'Python' ? python : sql} />
    <p className="marketing-note">{active === 'Python' ? t('Complete runnable example. Creates its own sample images; no model credentials required.', '完整可运行示例，自带样本图片，无需模型凭证。') : t('SQL excerpt. Uses the metadata relation created by the Python example.', 'SQL 片段，使用 Python 示例创建的 metadata 关系。')}</p>
    <div className="quickstart-output"><span>{t('Output', '输出')}</span><table><thead><tr><th>{t('Source', '原图')}</th><th>{t('Thumbnail', '缩略图')}</th><th>{t('Type', '类型')}</th></tr></thead><tbody><tr><td>640 × 480</td><td>224 × 224</td><td>IMAGE</td></tr><tr><td>320 × 240</td><td>224 × 224</td><td>IMAGE</td></tr></tbody></table></div>
  </div>
}

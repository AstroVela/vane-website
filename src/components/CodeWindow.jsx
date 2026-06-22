/* Dark code window (.term): monochrome traffic-light squares + filename,
   optional blinking `running` LED, and a syntax-highlighted body.

   `code` is pre-highlighted markup (spans with .k/.s/.n/.f/.c/.p/.t/.cur),
   mirroring the prototypes exactly — passed through as innerHTML. */
export default function CodeWindow({ filename, running, code, style }) {
  return (
    <div className="term" style={style}>
      <div className="term-bar">
        <span className="sq sq1" />
        <span className="sq sq2" />
        <span className="sq sq3" />
        <span className="fn">{filename}</span>
        {running && (
          <span className="run">
            <span className="led" />
            running
          </span>
        )}
      </div>
      <pre className="code" dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  )
}

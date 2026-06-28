import type {CSSProperties} from 'react'
import { useRef, useState } from 'react'
import { Highlight } from 'prism-react-renderer'
import { vaneCodeTheme } from './codeTheme'

/* Code window (.term): macOS traffic-light dots + filename, optional blinking
   `running` LED, and a syntax-highlighted body.

   Two body sources:
   - `language` set  -> `code` is raw source, tokenized by prism-react-renderer
     and coloured with Vane's low-saturation theme (fenced docs blocks).
   - `language` unset -> `code` is pre-highlighted markup (hand-authored windows
     on the marketing pages), injected as innerHTML with the .k/.s/.c classes.

   `copyable` (on by default) adds a top-right Copy button. */
type CodeWindowProps = {
  filename: string
  running?: boolean
  code: string
  style?: CSSProperties
  copyable?: boolean
  language?: string
}

export default function CodeWindow({
  filename,
  running,
  code,
  style,
  copyable = true,
  language,
}: CodeWindowProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const text = preRef.current?.textContent ?? ''
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — leave the label as-is.
    }
  }

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
        {copyable && (
          <button type="button" className="term-copy" onClick={onCopy} aria-label="Copy code">
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      {language ? (
        <Highlight theme={vaneCodeTheme} code={code} language={language}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="code" ref={preRef}>
              {tokens.map((line, i) => (
                <span key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                  {i < tokens.length - 1 ? '\n' : ''}
                </span>
              ))}
            </pre>
          )}
        </Highlight>
      ) : (
        <pre className="code" ref={preRef} dangerouslySetInnerHTML={{ __html: code }} />
      )}
    </div>
  )
}

import type {PrismTheme} from 'prism-react-renderer'

/* Vane's syntax theme for prism-react-renderer (the same tokenizer Docusaurus'
   classic theme uses). Deliberately NOT a vendor theme like oneLight — token
   types map onto Vane's restrained, low-saturation palette so highlighted
   fenced code matches the hand-authored code windows and the monochrome brand.
   Background is left to the `.term` shell; `plain` only sets the base ink. */
export const vaneCodeTheme: PrismTheme = {
  plain: { color: '#15171E' },
  styles: [
    { types: ['comment', 'prolog', 'cdata', 'doctype'], style: { color: '#9A9DA6', fontStyle: 'italic' } },
    { types: ['keyword', 'boolean', 'atrule', 'selector', 'important', 'rule'], style: { color: '#8E3DA8', fontWeight: 'bold' } },
    { types: ['function', 'function-variable', 'method'], style: { color: '#2E66C4' } },
    { types: ['string', 'char', 'attr-value', 'regex', 'url', 'inserted'], style: { color: '#3F8A3C' } },
    { types: ['number', 'constant', 'symbol'], style: { color: '#A86420' } },
    { types: ['class-name', 'builtin', 'tag', 'type', 'namespace'], style: { color: '#1A7E7B' } },
    { types: ['property', 'attr-name', 'variable', 'parameter'], style: { color: '#B24A38' } },
    { types: ['punctuation', 'operator', 'entity'], style: { color: '#595D67' } },
    { types: ['deleted'], style: { color: '#B23A2E' } },
  ],
}

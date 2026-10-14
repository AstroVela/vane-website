import {useSiteLocale} from '../siteI18n'

export type CodeLanguage = 'sql' | 'python'

export default function CodeLanguageSwitch({value, onChange}: {
  value: CodeLanguage; onChange: (language: CodeLanguage) => void
}) {
  const locale = useSiteLocale()
  return <span className="code-language-switch" role="group" aria-label={locale === 'en' ? 'Code language' : '代码语言'}>
    {(['sql', 'python'] as const).map(language => <button key={language} type="button"
      aria-pressed={value === language} onClick={() => onChange(language)}>
      {language === 'sql' ? 'SQL' : 'Python'}
    </button>)}
  </span>
}

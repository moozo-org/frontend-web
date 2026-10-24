import { useState, type ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  LanguageSwitch,
  Link,
  Pill,
  Switch,
  Text,
  TextField,
  Title,
} from '../../atoms'
import { useTheme } from '../../hooks/useTheme'
import styles from './StyleGuide.module.css'

const colors = [
  '--bg',
  '--surface',
  '--field',
  '--border',
  '--text',
  '--text-muted',
  '--primary',
  '--primary-hover',
  '--on-primary',
  '--danger',
  '--success',
]

const spaces = [
  ['--space-1', '4px'],
  ['--space-2', '8px'],
  ['--space-3', '12px'],
  ['--space-4', '16px'],
  ['--space-5', '24px'],
]

const roles = ['guest', 'organizer', 'vendor']

const Section = ({ name, children }: { name: string; children: ReactNode }) => {
  const { t, i18n } = useTranslation()
  const rulesKey = `styleGuide.${name}.rules`
  const rules = i18n.exists(rulesKey) ? (t(rulesKey, { returnObjects: true }) as string[]) : null

  return (
    <section className={styles.section}>
      <Title level={2}>{t(`styleGuide.${name}.title`)}</Title>
      {rules && (
        <ul className={styles.rules}>
          {rules.map((rule) => (
            <li key={rule}>
              <Text variant="muted" as="span">
                {rule}
              </Text>
            </li>
          ))}
        </ul>
      )}
      <Card>{children}</Card>
    </section>
  )
}

const StyleGuide = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [checked, setChecked] = useState(true)
  const [on, setOn] = useState(true)
  const [pill, setPill] = useState('guest')

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <Title>{t('styleGuide.title')}</Title>
          <Text variant="muted">{t('styleGuide.subtitle')}</Text>
        </div>
        <div className={styles.inline}>
          <LanguageSwitch />
          <Switch
            label={t('styleGuide.dark')}
            checked={isDark}
            onChange={(c) => setTheme(c ? 'dark' : 'light')}
          />
        </div>
      </header>

      <Section name="colors">
        <div className={styles.swatches}>
          {colors.map((name) => (
            <div key={name} className={styles.swatch}>
              <span className={styles.chip} style={{ background: `var(${name})` }} />
              <div>
                <code>{name}</code>
                <Text variant="small">{t(`styleGuide.colors.usage.${name}`)}</Text>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section name="typography">
        <div className={styles.row}>
          <code>{t('styleGuide.typography.level', { level: 1 })} · --fs-xl</code>
          <Title level={1}>{t('styleGuide.typography.title1')}</Title>
        </div>
        <div className={styles.row}>
          <code>{t('styleGuide.typography.level', { level: 2 })} · --fs-lg</code>
          <Title level={2}>{t('styleGuide.typography.title2')}</Title>
        </div>
        <div className={styles.row}>
          <code>{t('styleGuide.typography.level', { level: 3 })} · --fs-md</code>
          <Title level={3}>{t('styleGuide.typography.title3')}</Title>
        </div>
        <Divider />
        <div className={styles.row}>
          <code>Text body</code>
          <Text>{t('styleGuide.typography.body')}</Text>
        </div>
        <div className={styles.row}>
          <code>Text muted</code>
          <Text variant="muted">{t('styleGuide.typography.muted')}</Text>
        </div>
        <div className={styles.row}>
          <code>Text small</code>
          <Text variant="small">{t('styleGuide.typography.small')}</Text>
        </div>
      </Section>

      <Section name="spacing">
        {spaces.map(([name, value]) => (
          <div key={name} className={styles.space}>
            <code>{name}</code>
            <span className={styles.bar} style={{ width: value }} />
            <Text variant="small" as="span">
              {value} · {t(`styleGuide.spacing.usage.${name}`)}
            </Text>
          </div>
        ))}
        <Divider />
        <div className={styles.inline}>
          <span className={styles.radius} style={{ borderRadius: 'var(--radius)' }}>
            --radius
          </span>
          <span className={styles.radius} style={{ borderRadius: 'var(--radius-pill)' }}>
            --radius-pill
          </span>
        </div>
        <Text variant="small">{t('styleGuide.spacing.radius')}</Text>
      </Section>

      <Section name="buttons">
        <div className={styles.inline}>
          <Button>{t('styleGuide.buttons.primary')}</Button>
          <Button variant="secondary">{t('styleGuide.buttons.secondary')}</Button>
          <Button variant="ghost">{t('styleGuide.buttons.ghost')}</Button>
          <Button variant="danger">{t('styleGuide.buttons.danger')}</Button>
        </div>
        <div className={styles.inline}>
          <Button size="sm">{t('styleGuide.buttons.small')}</Button>
          <Button loading>{t('styleGuide.buttons.loading')}</Button>
          <Button disabled>{t('styleGuide.buttons.disabled')}</Button>
        </div>
      </Section>

      <Section name="inputs">
        <TextField label={t('styleGuide.inputs.email')} type="email" placeholder="you@mail.com" />
        <TextField
          label={t('styleGuide.inputs.password')}
          type="password"
          hint={t('styleGuide.inputs.passwordHint')}
        />
        <TextField
          label={t('styleGuide.inputs.phone')}
          defaultValue="06"
          error={t('styleGuide.inputs.phoneError')}
        />
        <TextField
          label={t('styleGuide.inputs.disabled')}
          defaultValue={t('styleGuide.inputs.disabledValue')}
          disabled
        />
      </Section>

      <Section name="selection">
        <Checkbox
          label={
            <Trans
              i18nKey="styleGuide.selection.acceptTerms"
              components={{ link: <Link to="/style" /> }}
            />
          }
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <Checkbox
          label={t('styleGuide.selection.required')}
          error={t('styleGuide.selection.termsError')}
        />
        <Switch label={t('styleGuide.selection.notifications')} checked={on} onChange={setOn} />
        <div className={styles.inline}>
          {roles.map((p) => (
            <Pill key={p} selected={pill === p} onClick={() => setPill(p)}>
              {t(`styleGuide.selection.roles.${p}`)}
            </Pill>
          ))}
        </div>
      </Section>

      <Section name="feedback">
        <Alert variant="error">{t('styleGuide.feedback.error')}</Alert>
        <Alert variant="success">{t('styleGuide.feedback.success')}</Alert>
        <Alert>{t('styleGuide.feedback.info')}</Alert>
        <Divider label={t('styleGuide.feedback.or')} />
        <div className={styles.inline}>
          <Link to="/style">{t('styleGuide.feedback.createAccount')}</Link>
          <Link to="/style" variant="muted">
            {t('styleGuide.feedback.forgotPassword')}
          </Link>
        </div>
      </Section>
    </main>
  )
}

export default StyleGuide

import { useState, type ReactNode } from 'react'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
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
  ['--bg', 'Page background'],
  ['--surface', 'Cards, modals'],
  ['--field', 'Inputs, secondary buttons, pills off'],
  ['--border', 'Every border and divider'],
  ['--text', 'Titles and body text'],
  ['--text-muted', 'Labels, hints, placeholders'],
  ['--primary', 'Main action, active states, focus'],
  ['--primary-hover', 'Hover on primary only'],
  ['--on-primary', 'Text and icons on primary'],
  ['--danger', 'Errors, destructive actions'],
  ['--success', 'Confirmations'],
]

const spaces = [
  ['--space-1', '4px', 'Label → message'],
  ['--space-2', '8px', 'Inside a control, label → input'],
  ['--space-3', '12px', 'Between related items'],
  ['--space-4', '16px', 'Between fields'],
  ['--space-5', '24px', 'Card padding, between sections'],
]

const Section = ({
  title,
  rules,
  children,
}: {
  title: string
  rules?: string[]
  children: ReactNode
}) => (
  <section className={styles.section}>
    <Title level={2}>{title}</Title>
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

const StyleGuide = () => {
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
          <Title>Style guide</Title>
          <Text variant="muted">Tokens, components and the rules to use them.</Text>
        </div>
        <Switch label="Dark" checked={isDark} onChange={(c) => setTheme(c ? 'dark' : 'light')} />
      </header>

      <Section
        title="Colors"
        rules={[
          'Only use these variables, never a raw hex in a component.',
          'Primary is for the one main action of a screen.',
          'Disabled = opacity 0.5. Tints = color-mix on an existing color.',
        ]}
      >
        <div className={styles.swatches}>
          {colors.map(([name, usage]) => (
            <div key={name} className={styles.swatch}>
              <span className={styles.chip} style={{ background: `var(${name})` }} />
              <div>
                <code>{name}</code>
                <Text variant="small">{usage}</Text>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        rules={[
          'Sora for titles, Manrope for everything else.',
          'One Title 1 per page. Never skip a level (1 → 3).',
          'Use <Title> and <Text>, not raw tags with custom sizes.',
        ]}
      >
        <div className={styles.row}>
          <code>Title 1 · --fs-xl</code>
          <Title level={1}>Welcome back</Title>
        </div>
        <div className={styles.row}>
          <code>Title 2 · --fs-lg</code>
          <Title level={2}>Your account</Title>
        </div>
        <div className={styles.row}>
          <code>Title 3 · --fs-md</code>
          <Title level={3}>Personal details</Title>
        </div>
        <Divider />
        <div className={styles.row}>
          <code>Text body</code>
          <Text>Enter your email to receive a reset link.</Text>
        </div>
        <div className={styles.row}>
          <code>Text muted</code>
          <Text variant="muted">We will never share your email.</Text>
        </div>
        <div className={styles.row}>
          <code>Text small</code>
          <Text variant="small">At least 8 characters.</Text>
        </div>
      </Section>

      <Section title="Spacing & radius" rules={['Only use the scale. No 5px, no 18px.']}>
        {spaces.map(([name, value, usage]) => (
          <div key={name} className={styles.space}>
            <code>{name}</code>
            <span className={styles.bar} style={{ width: value }} />
            <Text variant="small" as="span">
              {value} · {usage}
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
        <Text variant="small">
          Radius for fields and alerts, pill for buttons, pills and switches.
        </Text>
      </Section>

      <Section
        title="Buttons"
        rules={[
          'One primary per screen. Others are secondary or ghost.',
          'Full width on auth forms.',
          'Danger only for destructive actions (delete, leave).',
        ]}
      >
        <div className={styles.inline}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className={styles.inline}>
          <Button size="sm">Small</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section
        title="Inputs"
        rules={[
          'Always a visible label. Placeholder is an example, not the label.',
          'Error replaces the hint, under the field.',
          'Form-level errors (wrong password) go in an Alert above the form.',
        ]}
      >
        <TextField label="Email" type="email" placeholder="you@mail.com" />
        <TextField label="Password" type="password" hint="At least 8 characters" />
        <TextField label="Phone" defaultValue="06" error="Invalid phone number" />
        <TextField label="Disabled" defaultValue="Can't edit" disabled />
      </Section>

      <Section
        title="Selection"
        rules={[
          'Checkbox: a choice to confirm (terms, remember me).',
          'Switch: a setting applied immediately.',
          'Pill: pick one option among a few short ones.',
        ]}
      >
        <Checkbox
          label={
            <>
              I accept the <Link to="/style">terms</Link>
            </>
          }
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <Checkbox label="Required" error="You must accept the terms" />
        <Switch label="Notifications" checked={on} onChange={setOn} />
        <div className={styles.inline}>
          {['guest', 'organizer', 'vendor'].map((p) => (
            <Pill key={p} selected={pill === p} onClick={() => setPill(p)}>
              {p}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Feedback & navigation">
        <Alert variant="error">Wrong email or password.</Alert>
        <Alert variant="success">Reset link sent to your inbox.</Alert>
        <Alert>Your code expires in 10 minutes.</Alert>
        <Divider label="or" />
        <div className={styles.inline}>
          <Link to="/style">Create an account</Link>
          <Link to="/style" variant="muted">
            Forgot password?
          </Link>
        </div>
      </Section>
    </main>
  )
}

export default StyleGuide

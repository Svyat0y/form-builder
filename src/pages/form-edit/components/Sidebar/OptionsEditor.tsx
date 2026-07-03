import { FC } from 'react'
import styles from './Sidebar.module.scss'
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, XIcon } from '../icons'

interface OptionsEditorProps {
  options: string[]
  onChange: (options: string[]) => void
}

// Reorder via up/down buttons rather than drag-and-drop — the spec allows
// either (docs/pages/form-editor.md, decision #2); a second nested DnD
// context inside the already-scrolling sidebar wasn't worth the complexity
// for what's usually a handful of options.
export const OptionsEditor: FC<OptionsEditorProps> = ({
  options,
  onChange,
}) => {
  const updateOption = (index: number, value: string) => {
    const next = [...options]
    next[index] = value
    onChange(next)
  }

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index))
  }

  const moveOption = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= options.length) return
    const next = [...options]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const addOption = () => {
    onChange([...options, `Option ${options.length + 1}`])
  }

  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>Options</div>
      <div className={styles.optionsList}>
        {options.map((option, index) => (
          <div key={index} className={styles.optionRow}>
            <div className={styles.optionMoveBtns}>
              <button
                type="button"
                className={styles.optionMoveBtn}
                aria-label="Move option up"
                disabled={index === 0}
                onClick={() => moveOption(index, -1)}
              >
                <ChevronUpIcon />
              </button>
              <button
                type="button"
                className={styles.optionMoveBtn}
                aria-label="Move option down"
                disabled={index === options.length - 1}
                onClick={() => moveOption(index, 1)}
              >
                <ChevronDownIcon />
              </button>
            </div>
            <input
              className={styles.input}
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
            />
            <button
              type="button"
              className={styles.optionRemoveBtn}
              aria-label="Remove option"
              onClick={() => removeOption(index)}
              disabled={options.length <= 1}
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addOptionBtn} onClick={addOption}>
        <PlusIcon />
        Add option
      </button>
    </div>
  )
}

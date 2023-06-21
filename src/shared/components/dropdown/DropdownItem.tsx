import { FC, useCallback } from "react"
import { classList } from "../../utils/classList.ts"

export type DropdownKey = string | number | undefined

export type DropdownOption<A extends DropdownKey = DropdownKey> = {
  id: A
  name: string
  disabled?: boolean
}

type Props<A extends DropdownKey> = {
  active: A
  disabled: boolean
  option: DropdownOption<A>
  onChange(option: A): void
}

export const DropdownItem = <A extends DropdownKey>(props: Props<A>): ReturnType<FC<Props<A>>> => {
  const { active, disabled, onChange, option } = props

  const handleClick = useCallback(
    () => disabled || option.disabled === true ? undefined : onChange(option.id),
    [ disabled, onChange, option ]
  )

  return (
    <li
      className={classList({
        active: option.id === active,
        disabled: option.disabled === true,
      })}
      onClick={handleClick}
      >
      {option.name}
    </li>
  )
}

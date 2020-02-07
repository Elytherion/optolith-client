import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
}

export const Box: React.FC<Props> = ({ children, className }) => (
  <div className={classListMaybe (List (Just ("box"), Maybe (className)))}>
    {children}
  </div>
)

// [START components/ContentContainer.tsx]
import { ReactNode, FC } from "react"

const ContentContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="cursor-crosshair">
      {children}
    </div>
  )
}

export default ContentContainer;
// [END components/ContentContainer.tsx]

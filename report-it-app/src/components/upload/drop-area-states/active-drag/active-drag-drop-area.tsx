import EnabledDropArea from '../enabled'
import FileDropped from '../file-dropped'

interface Props {
  isFileDropped: boolean
}

export default function ActiveDragDropArea({ isFileDropped }: Props) {
  if (isFileDropped) return <FileDropped />
  return <EnabledDropArea />
}

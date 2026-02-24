import "./index.less"
export default function CommonBoxHeader(props) {
  const { title } = props
  return (
    <div className="cbox-header">
      <span>{title}</span>
    </div>
  )
}

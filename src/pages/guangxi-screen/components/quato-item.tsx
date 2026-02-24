import "./quato-item.less"
interface IProps {
  type: string
  value: number
  name: string
  unit: string
  horizon?: boolean
}
export default function QuatoOneItem(props: IProps) {
  const { type, value, name, unit, horizon } = props
  return (
    <div className=" common-quato">
      {!horizon ? (
        <div className="quato-one">
          <i className={"i-" + type}></i>
          <span className="quato-one-name">
            {name}({unit})
          </span>
          <span className="quato-one-value">{value}</span>
        </div>
      ) : (
        <div className="quato-horizon">
          <i className={"i-" + type}></i>
          <span className="quato-one-value">{value}</span>
          <span className="quato-one-name">
            {name}({unit})
          </span>
        </div>
      )}
    </div>
  )
}

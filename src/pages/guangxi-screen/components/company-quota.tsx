import "./company-quota.less"
export default function CompanyQuota(props) {
  const { list } = props
  return (
    <div className="cpn-quota">
      {list?.map((i) => {
        return (
          <div className="cpn-quota-item" key={i.id}>
            <div className="item-top">
              <i className="icon"></i>
              <span className="item-top-name">{i.name}</span>
            </div>
            <div className="item-value">{i.value}</div>
          </div>
        )
      })}
    </div>
  )
}

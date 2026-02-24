import DatePicker from "@/components/custom-date-picker"
import SelectWidthAll from "@/components/select-with-all"
import { FormSchema } from "@/types/i-form"
export const useRenderItem = () => {
  // 渲染 select options
  const renderSelect = (item: FormSchema) => {
    return (
      <SelectWidthAll
        value={item?.value}
        options={item?.componentProps?.options}
        onChange={item?.componentProps?.onChange}
        defaultValue={item.defaultValue}
        {...item?.componentProps}
      />
    )
  }

  const renderDatePick = (item: FormSchema) => {
    return (
      <DatePicker
        onChange={item?.componentProps?.onChange}
        format={item?.componentProps?.format}
        {...item?.componentProps}
      />
    )
  }

  return {
    renderSelect,
    renderDatePick,
  }
}

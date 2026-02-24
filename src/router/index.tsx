import { AtomUserOfMenuMap } from "@store/atom-menu.ts"
import { useAtomValue } from "jotai"
import { createHashRouter, RouterProvider } from "react-router-dom"

export default function Routes() {
  const menuOfUser = useAtomValue(AtomUserOfMenuMap)
  const routerList = createHashRouter(menuOfUser)
  return <RouterProvider router={routerList} />
}

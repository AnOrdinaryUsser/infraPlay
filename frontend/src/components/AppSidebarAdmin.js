import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CImage } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import esalab from './../assets/images/esalab.png'
import navigationAdmin from '../_navAdmin'

/**
 * @component AppSidebarAdmin
 * @description Component for vertical admin nav bar.
 */
const AppSidebarAdmin = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarNav style={{backgroundColor: '#fbb387'}}>
        <SimpleBar>
          <AppSidebarNav items={navigationAdmin} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler style={{backgroundColor: '#f99354'}}
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebarAdmin)

import equipmentList from '../views/equipmentAnalysis/equipmentList'
import warningMenu from '../views/earlyWarningCenter/warningMenu'
import warningRecord from '../views/warningRecord'
import warningSetting from '../views/earlyWarningCenter/warningSetting'
import commonMenu from '../views/roleManagement/commonMenu'
import user from '../views/roleManagement/user'
import role from '../views/roleManagement/role'
import organization from '../views/roleManagement/organization'
function getComponent (name) {
  if (name === '/equipmentList') {
    return equipmentList
  } else if (name === '/warningCenter') {
    return warningMenu
  } else if (name === '/warningRecord') {
    return warningRecord
  } else if (name === '/warningSetting') {
    return warningSetting
  } else if (name === '/system') {
    return commonMenu
  } else if (name === '/user') {
    return user
  } else if (name === '/role') {
    return role
  } else if (name === '/organization') {
    return organization
  }
}
export { getComponent }

/**
 * Created by Labbor on 2017/8/28.
 */
import {
  Dictionary
} from './dictionary-core'

var gachaTypes = new Dictionary({
  // 100: '新手祈愿',
  // 200: '常驻祈愿',
  // 301: '角色活动祈愿',
  // 302: '武器活动祈愿',
  100: '新手池',
  200: '常驻池',
  301: '角色up池',
  302: '武器up池',
})

export {
  Dictionary,
  gachaTypes
}

import { MessageBox, Message  } from 'element-ui';
import { reactive, ref } from '@vue/composition-api'

export function deleteInfo(){
    const confirm = (data)=>{
      MessageBox.confirm(data.content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          data.method && data.method(data.value || '')
          data.username && sessionStorage.removeItem(data.username)
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });
    };

    return{
      confirm
    }
}
(() => {
    // 入口函数

    function init() {
        initEvent();
    }

    // 绑定事件
    function initEvent() {
        formContainer.addEventListener('submit', onFormSubmitClick);
    }

    function onFormSubmitClick(e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 获取账号和密码输入值
        const loginId = userName.value;
        const loginPwd = userPassword.value;
        // console.log(loginId, loginPwd);
        if (!loginId || !loginPwd) {
            window.alert('用户名或密码不能为空');
            return;
        }
        // 发送表单数据
        sendData(loginId, loginPwd);
    }

    async function sendData(loginId, loginPwd) {
        // console.log('sendDate');
        // const res = await fetch('https://study.duyiedu.com/api/user/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         loginId,
        //         loginPwd
        //     })
        // });
        const result = await fetchFn({
            url: '/user/login',
            method: 'POST',
            params: {
                loginId,
                loginPwd
            }
        });
        if (result.code === 0) {
            // 登录成功
            // 获取用户表示, 存储用户表示
            window.location.replace('./index.html');
        } else {
            // 登录失败
            // console.log('登录失败');
            window.alert(result.msg);
        }
    }
    init();
    initEvent();
})()
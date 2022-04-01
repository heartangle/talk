(() => {
    let isRepeat = false;

    function init() {
        initEvent();
    }

    function initEvent() {
        userName.addEventListener('blur', onUserNameBlur);
        formContainer.addEventListener('submit', onFormSubmit)
    }

    async function onUserNameBlur(e) {
        // 获取用户账户
        const loginId = userName.value.trim();
        // 判断是否为空
        if (!loginId) {
            return;
        }
        // 调用接口检测
        // const res = await fetch(`https://study.duyiedu.com/api/user/exists?loginId=${loginId}`);

        const result = await fetchFn({
            url: '/user/exists',
            method: 'GET',
            params: {
                loginId
            }
        });
        isRepeat = result.data;
        if (isRepeat) {
            window.alert('账号已经存在');
        }
    }

    async function onFormSubmit(e) {
        // 组织表单提交默认操作
        e.preventDefault();
        // console.log('onFormSubmit');
        const loginId = userName.value.trim();
        const nickname = userNickname.value.trim();
        const loginPwd = userPassword.value.trim();
        const confirmPwd = userConfirmPassword.value.trim();
        // 表单验证操作
        if (!checkForm(loginId, nickname, loginPwd, confirmPwd)) {
            // 验证失败, 返回
            return;
        }
        // 请求数据
        // const res = await fetch('https://study.duyiedu.com/api/user/reg', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': '	application/json'
        //     },
        //     body: JSON.stringify({
        //         loginId,
        //         nickname,
        //         loginPwd
        //     })
        // })
        const result = await fetchFn({
            url: '/user/reg',
            method: 'POST',
            params: {
                loginId,
                nickname,
                loginPwd
            }
        });
        // console.log(result);
        if (result.code !== 0) {
            window.alert(result.msg);
            return;
        }
        window.location.replace('./login.html');
    }

    // 验证函数
    function checkForm(loginId, nickname, loginPwd, confirmPwd) {
        if (!loginId) {
            window.alert('注册用户不能为空');
            return;
        } else if (!nickname) {
            window.alert('昵称不能为空');
            return;
        } else if (!loginPwd) {
            window.alert('注册密码不能为空');
            return;
        } else if (!confirmPwd) {
            window.alert('验证密码不能为空');
            return;
        } else if (loginPwd !== confirmPwd) {
            window.alert('密码不一致');
            return;
        } else if (isRepeat) {
            window.alert('账号已经注册过, 请更换注册名称');
            return;
        }
        return true;
    }
    init();
})()
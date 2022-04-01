(() => {
    let page = 0;
    let size = 100;
    let chatTotal = 0;
    let showSelectContainerFlag = true;
    let sendType = 'enter';

    function init() {
        // 获取登录用户信息
        getUserInfo();
        // 获取聊天记录
        initChatList('bottom');

        initEvent();
    }

    async function getUserInfo() {
        const res = await fetchFn({
            url: '/user/profile'
        });
        // console.log(res);
        if (res.status === 401) {
            window.alert('权限token不正确');
            sessionStorage.removeItem('token');
            window.location.replace('./login.html');
            return;
        }
        // console.log(res);
        // 设置用户信息
        nickName.innerHTML = res.data.nickname;
        accountName.innerHTML = res.data.loginId;
        loginTime.innerHTML = formaDate(res.data.lastLoginTime);
    }

    async function initChatList(direction) {
        const res = await fetchFn({
            url: '/chat/history',
            params: {
                page,
                size
            }
        });
        chatTotal = res.chatTotal;
        // console.log(res);
        // 渲染链条界面
        renderChatData(res.data, direction);
    }

    function renderChatData(data, direction = 'bottom') {
        data.reverse();
        // 没有历史记录
        if (!data.length) {
            contentBody.innerHTML = `
            <div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                </div>
            </div>`
            return;
        }
        // 有历史记录
        const chatData = data.map(item => {
            // console.log(item);
            return item.from === 'user' ?
                `<div class="chat-container avatar-container">
                <img src="./img/avtar.png" alt="">
                <div class="chat-txt">${item.content}</div>
            </div>` :
                `<div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    ${item.content}
                </div>
            </div>`
        }).join('');
        // console.log(chatData);
        if (direction === 'bottom') {
            contentBody.innerHTML += chatData;
            const bottomDistance = document.querySelectorAll('.chat-container')[document.querySelectorAll('.chat-container').length - 1].offsetTop;
            // console.log(bottomDistance);
            contentBody.scrollTo(0, bottomDistance);
        } else {
            contentBody.innerHTML = chatData + contentBody.innerHTML;
        }
    }

    function initEvent() {
        sendBtn.addEventListener('click', onSendBtnClick);
        clearBtn.addEventListener('click', () => {
            inputContainer.value = '';
        });
        contentBody.addEventListener('scroll', onContentScroll);
        arrowContainer.addEventListener('click', onArrowContainerClick);
        document.querySelectorAll('.select-item').forEach(node => {
            node.addEventListener('click', onSelectItemClick);
        });
        inputContainer.addEventListener('keyup', onInputContainerKeyup);
        // 退出处理
        closeBtn.addEventListener('click', onCloseBtnClick);
    }

    function onCloseBtnClick() {
        // 清空 session 存储的 token
        sessionStorage.removeItem('token');
        // 界面跳转
        window.location.replace('./login.html');
    }

    function onInputContainerKeyup(e) {
        // console.log(e.keyCode, sendType, e.ctrlKey);
        if ((e.keyCode === 13 && sendType === 'enter' && !e.ctrlKey) || (e.keyCode === 13 && sendType === 'ctrlEnter' && e.ctrlKey)) {
            // console.log('回车发送');
            sendBtn.click();
        }
    }

    function onSelectItemClick() {
        // console.log(this);
        // 高亮处理
        document.querySelectorAll('.select-item').forEach(node => {
            node.classList.remove('on');
        })
        this.classList.add('on');
        // 设置按什么模式发送
        sendType = this.dataset.type;
        console.log(sendType);
        selectConatiner.style.display = 'none';
        showSelectContainerFlag = true;
    }


    function onArrowContainerClick() {
        if (showSelectContainerFlag) {
            selectConatiner.style.display = 'block';
            showSelectContainerFlag = false;
        } else {
            selectConatiner.style.display = 'none';
            showSelectContainerFlag = true;
        }
    }
    // 滚动事件监听函数
    function onContentScroll() {
        // console.log(123);
        // 加载第二页的数据
        // console.log(this.scrollTop);
        if (this.scrollTop === 0) {
            // 判断后端是否还有数据
            if ((page + 1) * size < chatTotal) {
                page++;
                initChatList('top');
            }
        }
    }
    async function onSendBtnClick() {
        // 判断发送值是否为空
        const content = inputContainer.value.trim();
        if (!content) {
            window.alert('发送消息不能为空');
            return;
        }
        // 调用渲染函数, 渲染消息
        renderChatData([{ from: 'user', content }]);
        inputContainer.value = '';
        // 发送数据到后端
        const res = await fetchFn({
            url: '/chat',
            method: 'POST',
            params: {
                content
            }
        });
        if (res.code === 0) {
            renderChatData([{ from: 'robot', content: res.data.content }]);
        }
    }
    init();
})()
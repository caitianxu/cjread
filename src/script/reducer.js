const defaultState = {
    name: '我是一个全局的公共参数',
    modal_version: false
};

export default (state = defaultState, action) => {
    let newState = {
        ...state
    };
    switch (action.type) {
        case 'change_modal_visible':
            newState.modal_version = action.data;
            break;
        default:
            break;
    }
    return newState;
};